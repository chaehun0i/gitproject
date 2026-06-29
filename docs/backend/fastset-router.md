# fastset 라우터 구조

라우터 등록은 `backend/utils/fastset.py`에서 관리합니다.

`fastset.py`는 API 라우터를 한 곳에서 모아 `/api` prefix 아래에 등록합니다.

## 현재 구조

```text
backend/
  main.py
  utils/
    fastset.py
  routes/
    auth.py
    health.py
    services.py
    projects.py
    analysis_runs.py
```

## API 기준

| 파일 | API |
| --- | --- |
| `routes/health.py` | `GET /api/health` |
| `routes/services.py` | `GET /api/services` |
| `routes/auth.py` | `/api/auth/*` |
| `routes/projects.py` | `/api/projects` |
| `routes/analysis_runs.py` | `/api/analysis-runs` |
