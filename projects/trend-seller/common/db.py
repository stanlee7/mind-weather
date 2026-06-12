"""SQLite 저장소 (data/trend.db) — 누적 이력·중복 방지용.

모듈 간 데이터 교환은 여전히 data/ 아래 JSON으로 하고(CLAUDE.md 참고),
SQLite는 시계열 이력과 "이미 처리했나" 판정에 쓴다.

스키마 변경은 SCHEMA에 CREATE TABLE IF NOT EXISTS로만 추가한다.
기존 테이블 컬럼을 바꿔야 하면 DB 파일을 지우고 재수집 (마이그레이션 도구 없음).
"""
from __future__ import annotations

import sqlite3

from common.storage import DATA_DIR

DB_PATH = DATA_DIR / "trend.db"

SCHEMA = """
-- collectors/datalab.py 급상승 키워드 이력
CREATE TABLE IF NOT EXISTS rising_keywords (
    id              INTEGER PRIMARY KEY,
    collected_at    TEXT NOT NULL,      -- YYYY-MM-DD
    category_id     TEXT NOT NULL,
    category_name   TEXT,
    keyword         TEXT NOT NULL,
    prev_week_ratio REAL,
    curr_week_ratio REAL,
    growth_pct      REAL,
    mock            INTEGER NOT NULL DEFAULT 0,  -- 1이면 mock 데이터 (실조회 시 WHERE mock=0)
    UNIQUE (collected_at, category_id, keyword)
);
"""


def get_conn() -> sqlite3.Connection:
    """연결을 열고 스키마를 보장한다. 사용 후 close()는 호출자 책임."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA)
    return conn
