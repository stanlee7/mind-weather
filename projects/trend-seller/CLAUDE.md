# trend-seller

도매매(도매꾹 OpenAPI) 트렌드 상품을 자동 발굴해서 네이버 스마트스토어에 등록하는 파이프라인.
Python 3.10 기반.

## 파이프라인 구조

```
collectors/  트렌드 수집 (네이버 데이터랩, 추후 다른 소스 추가)
matcher/     도매매(도매꾹 OpenAPI) 상품 검색·매칭
scorer/      상품 스코어링 (마진, 경쟁도, 트렌드 강도 등)
uploader/    네이버 커머스API 스마트스토어 상품 등록
common/      공용 유틸 (HTTP 재시도/요율제한, JSON 저장, SQLite)
data/        수집·중간 결과 JSON + trend.db (git 추적 안 함)
```

각 모듈은 독립적으로 `python -m <module>.<script>` 로 실행 가능해야 하고,
입출력은 `data/` 아래 JSON 파일로 주고받는다. 모듈 간 직접 import 의존은
common/ 외에는 만들지 않는다.

## 규칙

### API 키 관리
- 모든 API 키/시크릿은 `.env`로만 관리한다. 코드에 하드코딩 금지.
- `.env`는 `.gitignore`에 포함되어 있다. 새 키가 필요하면 `.env.example`에
  빈 항목을 먼저 추가한다.
- 키 로딩은 `python-dotenv`의 `load_dotenv()` 사용.

### 데이터 저장
- 모듈 간 입출력(그날의 실행 결과)은 로컬 JSON (`data/<모듈>/<이름>_<날짜>.json`).
  JSON 저장은 `common/storage.py`의 `save_json()` 사용
  (UTF-8, `ensure_ascii=False`, 디렉토리 자동 생성).
- 누적 이력·중복 방지(시계열 추적, "이미 등록한 상품인가" 판정)는
  SQLite (`data/trend.db`). 연결은 `common/db.py`의 `get_conn()` 사용 —
  스키마는 `common/db.py`의 `SCHEMA`에 `CREATE TABLE IF NOT EXISTS`로만 추가한다
  (별도 마이그레이션 도구 없음, 컬럼 변경 시 DB 파일 삭제 후 재수집).
- 외부 호스팅 백엔드(Supabase 등)는 쓰지 않는다. 단일 사용자 로컬 파이프라인이고,
  무료 티어 자동 정지 등 운영 리스크만 늘린다.
- mock 모드 실행도 DB에 기록하되 `mock` 컬럼으로 구분한다. 실데이터 조회 시
  `WHERE mock = 0` 필터를 잊지 말 것.

### 외부 API 호출
- 외부 API 호출은 반드시 `common/http.py`의 재시도/요율제한 헬퍼를 통해서 한다.
  - 429/5xx/타임아웃 → 지수 백오프 재시도 (기본 3회)
  - 호출 간 최소 간격 보장 (RateLimiter)
- API별 일일 호출 한도를 코드 주석에 명시한다
  (예: 네이버 데이터랩 1,000회/일, 검색광고 API 별도).

### mock 모드
- 모든 collector는 API 키 없이 테스트 가능해야 한다.
  `USE_MOCK=true`(.env) 또는 `--mock` 플래그 시 mock 데이터로 동작.
- mock 데이터는 각 모듈의 `mock/` 디렉토리에 두고, 실제 API 응답과
  동일한 스키마를 유지한다.

## 외부 API 메모

### 네이버 데이터랩 쇼핑인사이트 (collectors/datalab.py)
- 공식 OpenAPI는 "인기검색어 순위"를 제공하지 않음. 키워드별 트렌드 비율만 제공:
  - `POST /v1/datalab/shopping/category/keywords` — 키워드 최대 5개/호출
  - 헤더: `X-Naver-Client-Id`, `X-Naver-Client-Secret`
- 따라서 흐름은: 후보 키워드 확보(현재 mock, 추후 별도 소스) → 주차별 트렌드 조회
  → 전주 대비 증가율로 급상승 판정.
- 쇼핑 카테고리 ID: 패션의류 50000000, 패션잡화 50000001, 화장품/미용 50000002,
  디지털/가전 50000003, 가구/인테리어 50000004, 출산/육아 50000005,
  식품 50000006, 스포츠/레저 50000007, 생활/건강 50000008

### 도매매/도매꾹 OpenAPI (matcher/) — 추후
### 네이버 커머스API (uploader/) — 추후

## 실행

```powershell
pip install -r requirements.txt
copy .env.example .env   # 키 채우기 (없으면 USE_MOCK=true 유지)
python -m collectors.datalab --mock
```
