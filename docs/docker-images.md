# Docker 이미지 기준

로컬 Docker Desktop에 있는 이미지 기준으로 기본 태그를 맞춥니다.

## 현재 기준

| 용도 | 이미지 |
| --- | --- |
| 백엔드 uv 실행 환경 | `uv:1` |
| MariaDB | `mariadb:12.1.2` |
| Redis | `redis:8.4.0` |
| 프론트 로컬 실행 | 로컬 Node.js + Vite |
| 프론트 빌드 후보 | `node:24.13.0` |

## 현재 적용 상태

| 영역 | 적용 |
| --- | --- |
| `backend/Dockerfile` | `FROM uv:1` |
| `db/compose.yaml` | `mariadb:12.1.2`, `redis:8.4.0` |
| `frontend/Dockerfile` | 배포 후보용으로 유지 |

프론트는 현재 Vite + React 기반으로 로컬에서 실행합니다.

개발 중 API 요청은 `VITE_API_BASE_URL`에 지정한 FastAPI 백엔드 origin으로 전달합니다.

Docker/Nginx 기반 프론트 배포 구성은 실제 배포 단계에서 다시 고정합니다.
