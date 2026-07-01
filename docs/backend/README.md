# 백엔드 문서

CommitLens 백엔드는 FastAPI 기반입니다. 현재 개발 방식은 DB와 Redis만 Docker로 실행하고, 백엔드는 로컬에서 실행하는 흐름입니다.

## 구조

- `main.py`: FastAPI 앱 생성
- `utils/fastset.py`: API router 등록
- `routes`: API endpoint
- `schemas`: Pydantic schema
- `core`: settings, 보안 유틸
- `utils`: 인증, 토큰, Redis, DB 접근 유틸

## 인증 흐름

1. `/auth/login` 또는 `/auth/signup`
2. DB `users` 조회 또는 생성
3. UUID session id 생성
4. JWE token 발급
5. Redis에 `session:{uuid}` 저장
6. HttpOnly cookie에 JWE token 저장
7. `/auth/me`에서 access token을 검증하고 Redis refresh session은 `/auth/refresh`에서 확인

## 로컬 실행

```powershell
docker compose --profile db up -d postgres redis
cd backend
uv sync
uv run uvicorn main:app --reload
```
