# CommitLens

Git 커밋 내역과 코드 변경 내용을 분석해 개발 인사이트와 커밋 메시지 추천을 제공하는 포트폴리오용 AI 개발 분석 서비스입니다.

현재 작업 기준은 DB 컨테이너만 Docker Desktop으로 실행하고, 백엔드와 프론트엔드는 로컬에서 실행합니다.

## 기본 구성

```text
backend/    FastAPI 백엔드
frontend/   Vite + React 프론트엔드
db/         PostgreSQL, MariaDB, Redis 실행 설정
docs/       프로젝트 문서
.github/    GitHub Actions
```

## DB 실행

```bash
cd db
docker compose up -d
```

## 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

기본 개발 서버는 Vite 기준 `http://localhost:5173`입니다.

## 백엔드 실행

백엔드는 로컬 FastAPI 실행을 기준으로 합니다. 환경 변수와 실행 방식은 백엔드 문서를 기준으로 관리합니다.

```text
browser -> Vite frontend -> /api proxy -> FastAPI backend
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

## 프론트엔드 문서

화면 구조, 라우팅, CSS 분리 기준은 다음 문서에서 관리합니다.

```text
docs/frontend/README.md
docs/project-structure.md
```
