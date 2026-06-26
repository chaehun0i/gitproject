# 백엔드

FastAPI 기반 백엔드입니다.

## 구조

```text
app/main.py       FastAPI 앱 생성
app/fastset.py    API 라우터 일괄 등록
```

## 로컬 실행

```bash
uv sync
uv run uvicorn app.main:app --reload
```
