# 프론트엔드

현재 프론트엔드는 JavaScript 없이 정적 HTML/CSS만 유지합니다.

프론트엔드 API 연결은 FastAPI MVP API가 정리된 뒤 다시 추가합니다.

## Nginx 연결

Docker로 프론트엔드를 올리면 Nginx가 정적 파일을 서빙합니다.

또한 `/api/` 요청은 같은 Docker 네트워크의 FastAPI 백엔드로 프록시합니다.

```text
browser
  -> frontend nginx
  -> /api/*
  -> backend:8000
```

## Docker 실행

```bash
docker compose --profile frontend up -d frontend
```
