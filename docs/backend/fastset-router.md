# FastAPI 라우터 기본 구조

라우터 등록은 `backend/app/fastset.py`에서 관리합니다.

`fastset.py`는 폴더가 아니라 라우터를 한 번에 등록하기 위한 유틸 파일입니다.

## 현재 구조

```text
backend/app/
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
```

## 라우터 파일 기준

라우터 파일은 호출 URL이 보이도록 이름을 맞춥니다.

| 파일 | API |
| --- | --- |
| `routes/health.py` | `GET /api/health` |
| `routes/services.py` | `GET /api/services` |
| `routes/projects.py` | `/api/projects` |
| `routes/analysis_runs.py` | `/api/analysis-runs` |

## 다음 단계

현재는 DB 연결 전 기본 API 형태만 잡아둔 상태입니다.

이후 `services`, `repositories` 계층을 추가해 실제 DB 작업과 분석 로직을 연결합니다.
