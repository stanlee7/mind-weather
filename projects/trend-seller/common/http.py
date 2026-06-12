"""외부 API 호출 공용 헬퍼: 지수 백오프 재시도 + 호출 간격 요율제한.

모든 모듈의 외부 API 호출은 request_with_retry()를 통해서 한다 (CLAUDE.md 규칙).
"""
from __future__ import annotations

import time

import requests

RETRYABLE_STATUS = {429, 500, 502, 503, 504}


class RateLimiter:
    """호출 간 최소 간격(초)을 보장하는 단순 리미터."""

    def __init__(self, min_interval: float):
        self.min_interval = min_interval
        self._last_call = 0.0

    def wait(self) -> None:
        elapsed = time.monotonic() - self._last_call
        if elapsed < self.min_interval:
            time.sleep(self.min_interval - elapsed)
        self._last_call = time.monotonic()


def request_with_retry(
    method: str,
    url: str,
    *,
    max_retries: int = 3,
    backoff_base: float = 1.0,
    timeout: float = 10.0,
    rate_limiter: RateLimiter | None = None,
    **kwargs,
) -> requests.Response:
    """429/5xx/네트워크 오류 시 지수 백오프(1s, 2s, 4s...)로 재시도.

    재시도를 모두 소진하면 마지막 예외를 그대로 올리거나
    raise_for_status()로 HTTPError를 발생시킨다.
    """
    last_exc: Exception | None = None
    for attempt in range(max_retries + 1):
        if rate_limiter:
            rate_limiter.wait()
        try:
            resp = requests.request(method, url, timeout=timeout, **kwargs)
            if resp.status_code in RETRYABLE_STATUS:
                last_exc = requests.HTTPError(
                    f"{resp.status_code} {resp.reason}", response=resp
                )
            else:
                resp.raise_for_status()
                return resp
        except (requests.ConnectionError, requests.Timeout) as exc:
            last_exc = exc

        if attempt < max_retries:
            time.sleep(backoff_base * (2**attempt))

    assert last_exc is not None
    raise last_exc
