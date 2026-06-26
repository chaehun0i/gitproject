# 프론트엔드 현재 방침

현재 단계에서는 JavaScript 프론트엔드 구현을 잠시 제외합니다.

MVP의 우선순위는 다음과 같습니다.

1. FastAPI 라우터 구조 정리
2. DB 스키마와 Compose 실행 흐름 고정
3. 분석 API 계약 설계
4. 이후 프론트엔드 API 연결 재도입

## 현재 프론트 구성

```text
frontend/
  index.html
  src/styles.css
  Dockerfile
```

현재 프론트는 정적 HTML/CSS만 사용합니다.

## Nginx 연결

Docker로 프론트엔드를 실행하면 Nginx가 올라갑니다.

Nginx는 정적 파일을 제공하고, `/api/` 요청을 FastAPI 백엔드로 전달합니다.

```text
브라우저
  -> frontend nginx
  -> /api/*
  -> backend:8000
```

관련 파일은 다음과 같습니다.

```text
frontend/Dockerfile
frontend/nginx.conf
docker-compose.yml
```

## API 연결 계획

API 호출 코드는 지금 바로 사용하지 않고, FastAPI 분석 API가 안정된 뒤 다시 추가합니다.

예정 구조는 다음과 같습니다.

```text
프론트 화면
  ↓
API Client
  ↓
FastAPI /api
```
