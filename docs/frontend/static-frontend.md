# 프론트엔드 실행 방침

이 문서는 과거 정적 프론트엔드 메모를 대체합니다. 현재 CommitLens 프론트엔드는 Vite + React 기반이며, 백엔드와 프론트엔드는 로컬에서 실행하고 DB 계열 서비스만 Docker Desktop으로 띄우는 방식을 기준으로 합니다.

## 현재 프론트 구성

```text
frontend/
  package.json
  vite.config.js
  index.html
  src/
    App.jsx
    main.jsx
    pages/
    components/
    stores/
    styles/
```

## 로컬 실행

```powershell
cd frontend
npm install
npm run dev
```

Vite 개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

## API 연결

개발 서버의 API 요청은 `VITE_API_BASE_URL`에 지정한 백엔드 origin을 사용합니다.

```text
browser
  -> Vite frontend
  -> http://localhost:8000
  -> FastAPI backend
```

기본 API 대상은 `http://localhost:8000`이며, 필요하면 `VITE_API_BASE_URL`로 변경합니다.

## 화면 구현 기준

- 로그인 전 화면은 랜딩, 로그인, 회원가입 흐름을 유지합니다.
- 로그인 후 화면은 `AppLayout`에서 고정 헤더와 접힘 가능한 사이드바를 제공합니다.
- 새 분석과 분석 진행은 사용자 흐름상 모달을 우선 사용하고, 기존 라우트도 유지합니다.
- mock 데이터는 `VITE_USE_MOCKS=true|false`로 제어합니다.
- CSS는 공통 페이지 스타일과 페이지별 스타일로 분리합니다.

## Docker 기준

현재 프론트 개발은 로컬 Vite 실행을 우선합니다. Docker/Nginx 배포 구성은 이후 배포 단계에서 별도 정리합니다.
