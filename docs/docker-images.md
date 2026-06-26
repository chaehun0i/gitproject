# Docker 이미지 기준

로컬 Docker Desktop에 있는 이미지 기준으로 기본 태그를 맞춥니다.

## 현재 기준

| 용도 | 이미지 |
| --- | --- |
| 백엔드 uv 실행 환경 | `uv:1` |
| MariaDB | `mariadb:12.1.2` |
| Redis | `redis:8.4.0` |
| 프론트 빌드 후보 | `node:24.13.0` |

## 현재 적용 상태

| 영역 | 적용 |
| --- | --- |
| `backend/Dockerfile` | `FROM uv:1` |
| `db/compose.yaml` | `mariadb:12.1.2`, `redis:8.4.0` |
| `frontend/Dockerfile` | Nginx 프록시가 필요해서 `nginx:1.27-alpine` 유지 |

프론트는 현재 JavaScript 없이 정적 HTML/CSS만 사용합니다.

Docker로 실행할 때 `/api/` 요청을 FastAPI 백엔드로 넘겨야 하므로 Nginx 이미지를 유지합니다.

나중에 React/Node 프론트를 다시 도입하면 `node:24.13.0`을 기준 이미지로 사용합니다.
