# 프로젝트 파일 구조

업로드용 기본 세팅 기준 파일 구조입니다.

```text
project/
  backend/
    app/
      main.py
      fastset.py
      core/
        config.py
      routes/
        health.py
        services.py
        projects.py
        analysis_runs.py
      schemas/
        projects.py
        analysis_runs.py
    Dockerfile
    pyproject.toml

  frontend/
    index.html
    nginx.conf
    Dockerfile
    src/
      styles.css
      api/
        README.md

  db/
    compose.yaml
    postgres/init/
    mariadb/init/

  docs/
    project-structure.md
    backend/
    db/
    frontend/
    github/

  .github/workflows/
  docker-compose.yml
  .env.example
  .gitignore
```

## 각 영역에 들어갈 예정인 것

| 영역 | 예정 내용 |
| --- | --- |
| `backend/app/routes` | FastAPI 호출 URL별 라우터 |
| `backend/app/schemas` | 요청/응답 Pydantic 모델 |
| `backend/app/core` | 환경 변수, 설정, 공통 설정 |
| `backend/app/fastset.py` | 라우터 일괄 등록 |
| `frontend/src/api` | 추후 Axios API 호출 코드 |
| `db/postgres/init` | PostgreSQL 초기 스키마 |
| `db/mariadb/init` | MariaDB 초기 스키마 |
| `docs` | 설계 문서 |
