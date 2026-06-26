# AI 개발 이력 비서

Git 변경 이력을 분석해서 프로젝트가 어떻게 개발됐는지 설명하는 AI 개발 비서 프로젝트입니다.

현재는 업로드를 위한 기본 세팅 단계입니다.

## 기본 구성

```text
backend/    FastAPI 백엔드
frontend/   Nginx 정적 프론트엔드
db/         PostgreSQL, MariaDB, Redis 실행 설정
docs/       프로젝트 문서
.github/    GitHub Actions
```

## DB 실행

```bash
cd db
docker compose up -d
```

## 앱 실행

```bash
docker compose --profile frontend up -d
```

`frontend` profile을 실행하면 FastAPI 백엔드도 함께 포함됩니다.

Nginx는 정적 파일을 제공하고 `/api/` 요청을 백엔드로 전달합니다.

```text
browser -> frontend nginx -> backend:8000
```

## 선택 서비스

```bash
docker compose --profile kafka up -d kafka
docker compose --profile ai up -d ollama
```

## GitHub 원격 저장소

```text
origin: https://github.com/chaehun0i/gitproject.git
```

## 환경 변수

실제 `.env` 파일은 GitHub에 올리지 않습니다.

필요한 값은 `.env.example`을 참고해서 로컬에서만 만듭니다.

## Docker 이미지 기준

현재 로컬 Docker 이미지 기준은 다음 문서에 정리했습니다.

```text
docs/docker-images.md
```
