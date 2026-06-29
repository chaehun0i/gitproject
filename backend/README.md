# Backend

FastAPI 기반 CommitLens 백엔드입니다.

## 실행 방식

현재 개발 기준은 DB와 Redis만 Docker로 실행하고, 백엔드는 로컬에서 실행합니다.

```powershell
uv sync
uv run uvicorn main:app --reload
```

## 구조

```text
backend/
  main.py              FastAPI 앱 생성
  core/                settings, 보안 유틸
  routes/              API 라우터
  schemas/             요청/응답 모델
  utils/               기능별 공통 유틸
    fastset.py         라우터 일괄 등록
    auth.py            로그인 유지/쿠키 처리
    db.py              DB 연결/사용자 조회
    rediscl.py         Redis 세션 처리
    tokenset.py        JWE 토큰 생성/검증
```

## 환경 변수

환경 변수는 `.env`에 두고 `core/settings.py`에서 읽습니다. 코드에서 직접 `os.getenv`를 호출하지 않습니다.

기본값은 로컬 실행 기준입니다.

- `DATABASE_URL=postgresql://app:app_password@localhost:5432/app`
- `REDIS_URL=redis://localhost:6379/0`
- `FRONTEND_ORIGIN=http://localhost:5173`
