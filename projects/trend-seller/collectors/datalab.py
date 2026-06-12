"""네이버 데이터랩 쇼핑인사이트 — 카테고리별 급상승 키워드 수집.

공식 OpenAPI는 인기검색어 '순위'를 제공하지 않으므로 흐름은 다음과 같다:
  1. 카테고리별 후보 키워드 확보 (현재는 mock/candidate_keywords.json,
     추후 별도 랭킹 소스로 교체)
  2. POST /v1/datalab/shopping/category/keywords 로 주차별 트렌드 비율 조회
     (키워드 최대 5개/호출 → 배치 처리, 일일 한도 1,000회)
  3. 마지막 완전한 주 vs 그 전주 비율을 비교해 급상승 키워드 산출

실행:
  python -m collectors.datalab --mock              # API 키 없이 전체 카테고리
  python -m collectors.datalab --category 패션의류 --top 5
"""
from __future__ import annotations

import argparse
import json
import os
import random
from datetime import date, timedelta
from pathlib import Path

from dotenv import load_dotenv

from common.http import RateLimiter, request_with_retry
from common.storage import save_json

load_dotenv()

DATALAB_URL = "https://openapi.naver.com/v1/datalab/shopping/category/keywords"
MAX_KEYWORDS_PER_CALL = 5  # API 제약: keyword 항목 최대 5개
MOCK_DIR = Path(__file__).resolve().parent / "mock"

# 쇼핑인사이트 1차 카테고리 ID
CATEGORIES = {
    "패션의류": "50000000",
    "패션잡화": "50000001",
    "화장품/미용": "50000002",
    "디지털/가전": "50000003",
    "가구/인테리어": "50000004",
    "출산/육아": "50000005",
    "식품": "50000006",
    "스포츠/레저": "50000007",
    "생활/건강": "50000008",
}
CATEGORY_NAMES = {v: k for k, v in CATEGORIES.items()}

# 데이터랩 API 일일 한도 1,000회 — 호출 간 0.3초 간격이면 충분히 안전
_rate_limiter = RateLimiter(min_interval=0.3)


def load_candidate_keywords(category_id: str) -> list[str]:
    """카테고리별 후보 키워드. 지금은 mock 파일이 유일한 소스다."""
    with open(MOCK_DIR / "candidate_keywords.json", encoding="utf-8") as f:
        candidates = json.load(f)
    return candidates.get(category_id, [])


def fetch_keyword_trends(
    category_id: str,
    keywords: list[str],
    start_date: date,
    end_date: date,
    *,
    use_mock: bool = False,
) -> list[dict]:
    """키워드들의 주차별 트렌드 비율을 반환.

    반환 스키마(공식 API results 항목과 동일):
      [{"title": "키워드", "data": [{"period": "YYYY-MM-DD", "ratio": float}, ...]}]
    """
    if use_mock:
        return _mock_trends(keywords, start_date, end_date)

    client_id = os.environ.get("NAVER_CLIENT_ID")
    client_secret = os.environ.get("NAVER_CLIENT_SECRET")
    if not client_id or not client_secret:
        raise SystemExit(
            "NAVER_CLIENT_ID/NAVER_CLIENT_SECRET가 .env에 없습니다. "
            "키가 없으면 --mock 으로 실행하세요."
        )

    results: list[dict] = []
    for i in range(0, len(keywords), MAX_KEYWORDS_PER_CALL):
        batch = keywords[i : i + MAX_KEYWORDS_PER_CALL]
        body = {
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
            "timeUnit": "week",
            "category": category_id,
            "keyword": [{"name": kw, "param": [kw]} for kw in batch],
        }
        resp = request_with_retry(
            "POST",
            DATALAB_URL,
            headers={
                "X-Naver-Client-Id": client_id,
                "X-Naver-Client-Secret": client_secret,
                "Content-Type": "application/json",
            },
            json=body,
            rate_limiter=_rate_limiter,
        )
        results.extend(resp.json()["results"])
    return results


def _mock_trends(keywords: list[str], start_date: date, end_date: date) -> list[dict]:
    """실제 API와 동일한 스키마의 주차별 mock 트렌드.

    키워드 문자열을 시드로 써서 결정적으로 생성하고,
    약 1/3은 마지막 주에 급등하도록 만들어 급상승 판정 로직을 테스트한다.
    """
    weeks = []
    d = start_date
    while d <= end_date:
        weeks.append(d)
        d += timedelta(weeks=1)

    results = []
    for kw in keywords:
        rng = random.Random(kw)
        base = rng.uniform(20, 70)
        ratios = [round(base * rng.uniform(0.85, 1.15), 2) for _ in weeks]
        if rng.random() < 0.35:  # 급등 키워드
            ratios[-1] = round(ratios[-1] * rng.uniform(1.4, 2.5), 2)
        results.append(
            {
                "title": kw,
                "data": [
                    {"period": w.isoformat(), "ratio": r}
                    for w, r in zip(weeks, ratios)
                ],
            }
        )
    return results


def compute_rising(trends: list[dict], *, min_growth_pct: float = 20.0) -> list[dict]:
    """마지막 주 vs 전주 비율로 급상승 키워드를 추출, 증가율 내림차순 정렬."""
    rising = []
    for item in trends:
        data = item["data"]
        if len(data) < 2:
            continue
        prev, curr = data[-2]["ratio"], data[-1]["ratio"]
        if prev <= 0:
            growth = float("inf") if curr > 0 else 0.0
        else:
            growth = (curr - prev) / prev * 100
        if growth >= min_growth_pct:
            rising.append(
                {
                    "keyword": item["title"],
                    "prev_week_ratio": prev,
                    "curr_week_ratio": curr,
                    "growth_pct": round(growth, 1),
                }
            )
    rising.sort(key=lambda x: x["growth_pct"], reverse=True)
    return rising


def collect(
    category_ids: list[str],
    *,
    use_mock: bool,
    lookback_weeks: int = 8,
    min_growth_pct: float = 20.0,
    top: int | None = None,
) -> dict:
    end_date = date.today() - timedelta(days=1)
    start_date = end_date - timedelta(weeks=lookback_weeks)

    categories = []
    for cid in category_ids:
        keywords = load_candidate_keywords(cid)
        if not keywords:
            print(f"  [skip] {CATEGORY_NAMES.get(cid, cid)}: 후보 키워드 없음")
            continue
        trends = fetch_keyword_trends(
            cid, keywords, start_date, end_date, use_mock=use_mock
        )
        rising = compute_rising(trends, min_growth_pct=min_growth_pct)
        if top:
            rising = rising[:top]
        categories.append(
            {
                "category_id": cid,
                "category_name": CATEGORY_NAMES.get(cid, cid),
                "candidate_count": len(keywords),
                "rising_keywords": rising,
            }
        )

    return {
        "source": "naver_datalab_shopping_insight",
        "mock": use_mock,
        "collected_at": date.today().isoformat(),
        "period": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat(),
            "time_unit": "week",
        },
        "min_growth_pct": min_growth_pct,
        "categories": categories,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="데이터랩 급상승 키워드 수집")
    parser.add_argument("--mock", action="store_true", help="API 키 없이 mock 데이터 사용")
    parser.add_argument(
        "--category",
        help="카테고리 이름(예: 패션의류) 또는 ID. 생략 시 후보 키워드가 있는 전체",
    )
    parser.add_argument("--top", type=int, default=10, help="카테고리당 상위 N개")
    parser.add_argument(
        "--min-growth", type=float, default=20.0, help="급상승 판정 최소 증가율(%%)"
    )
    args = parser.parse_args()

    use_mock = args.mock or os.environ.get("USE_MOCK", "").lower() == "true"

    if args.category:
        cid = CATEGORIES.get(args.category, args.category)
        if cid not in CATEGORY_NAMES:
            raise SystemExit(f"알 수 없는 카테고리: {args.category}")
        category_ids = [cid]
    else:
        with open(MOCK_DIR / "candidate_keywords.json", encoding="utf-8") as f:
            category_ids = list(json.load(f).keys())

    result = collect(
        category_ids,
        use_mock=use_mock,
        min_growth_pct=args.min_growth,
        top=args.top,
    )

    out = save_json(f"datalab/rising_keywords_{date.today().isoformat()}.json", result)

    total = sum(len(c["rising_keywords"]) for c in result["categories"])
    print(f"\n급상승 키워드 {total}개 ({'mock' if use_mock else 'live'} 모드)")
    for cat in result["categories"]:
        print(f"\n[{cat['category_name']}]")
        for i, kw in enumerate(cat["rising_keywords"], 1):
            print(
                f"  {i}. {kw['keyword']}: {kw['prev_week_ratio']} → "
                f"{kw['curr_week_ratio']} (+{kw['growth_pct']}%)"
            )
    print(f"\n저장: {out}")


if __name__ == "__main__":
    main()
