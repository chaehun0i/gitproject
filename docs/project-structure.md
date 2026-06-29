# 프로젝트 구조

CommitLens는 포트폴리오용 AI 커밋 분석 서비스입니다. 현재 개발 기준은 DB와 Redis만 Docker로 실행하고, 백엔드와 프론트엔드는 로컬에서 실행합니다.

```text
backend/
  main.py
  core/
    settings.py
    security.py
  routes/
    auth.py
    health.py
    services.py
    projects.py
    analysis_runs.py
  schemas/
    projects.py
    analysis_runs.py
  utils/
    fastset.py
    auth.py
    db.py
    rediscl.py
    tokenset.py

frontend/
  src/
    App.jsx
    api.js
    main.jsx
    assets/
    components/
      analysis/
      common/
      layout/
    pages/
    stores/
    styles/
      global.css
      components/
      layout/
      pages/
    utils/

db/
  postgres/init/
  mariadb/init/

docs/
  backend/
  db/
  frontend/
  github/
  logs/
```

## 프론트엔드 기준

- `global.css`는 reset과 CSS 변수만 둡니다.
- 페이지 전용 스타일은 `frontend/src/styles/pages`에서 관리합니다.
- 레이아웃 전용 스타일은 `frontend/src/styles/layout`에서 관리합니다.
- 컴포넌트 전용 스타일은 `frontend/src/styles/components`에서 관리합니다.
- 더미 데이터는 `VITE_USE_MOCKS=true|false`로 제어합니다.

## 백엔드 기준

- `.env` 값은 `core/settings.py`에서 읽습니다.
- 코드에서 직접 환경변수를 조회하지 않습니다.
- `routes`는 API 입출력과 라우팅만 담당합니다.
- 인증, 토큰, Redis, DB 접근은 `utils`에 기능별로 분리합니다.
- 로그인 유지는 JWE HttpOnly cookie + Redis UUID session을 기준으로 합니다.

## 정리 기준

- 현재 화면에서 사용하지 않는 샘플 컴포넌트는 제거합니다.
- 빌드 산출물과 캐시는 추적하지 않습니다.
- 구조 변경은 주간 로그에 한글로 기록합니다.
