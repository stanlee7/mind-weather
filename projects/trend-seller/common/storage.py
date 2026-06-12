"""수집 결과 로컬 JSON 저장 헬퍼. Supabase 연동 전까지의 표준 출력 경로."""
from __future__ import annotations

import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"


def save_json(relative_path: str, payload: object) -> Path:
    """data/ 아래에 UTF-8 JSON으로 저장하고 전체 경로를 반환한다."""
    path = DATA_DIR / relative_path
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    return path


def load_json(path: str | Path) -> object:
    with open(path, encoding="utf-8") as f:
        return json.load(f)
