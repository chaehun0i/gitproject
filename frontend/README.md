# CommitLens Frontend

Vite + React 기반 CommitLens 프론트엔드입니다. 현재는 포트폴리오 시연을 위해 mock 데이터 기반 화면 완성도를 우선하며, 이후 FastAPI 백엔드 API와 연결할 수 있는 구조를 유지합니다.

## 기준

- import 경로는 `vite.config.js`의 alias를 사용합니다.
- 브라우저 기본 `alert()` 대신 앱 내부 커스텀 알럿을 사용합니다.
- 컴포넌트와 핸들러는 `const` 기반 화살표 함수로 작성합니다.
- 화면 구조를 크게 갈아엎기보다 기존 라우팅과 컴포넌트 안에서 필요한 부분을 점진적으로 보정합니다.
- 페이지 전용 CSS는 페이지별 파일로 분리하고, 공통 화면 패턴만 `pageCommon.css`에서 관리합니다.

## 현재 구조

```text
src/
  assets/
    images/
  components/
    analysis/
    common/
    layout/
    modal/
    charts/
    ui/
  pages/
  stores/
  styles/
    global.css
    components/
    layout/
    pages/
  App.jsx
  main.jsx
```

## 실행

```powershell
npm install
npm run dev
npm run build
```

Vite 개발 서버는 기본적으로 `5173` 포트를 사용합니다.

## 라우팅

- `/`: 로그인 전 랜딩 또는 로그인 후 Workspace
- `/login`: 로그인
- `/signup`: 회원가입
- `/projects`: 프로젝트 목록
- `/analysis/new`: 새 분석 시작
- `/analysis/progress`: 분석 진행 상태
- `/analysis/result`: 분석 결과 요약
- `/analysis/detail`: 상세 분석
- `/analysis/commit-message`: 커밋 메시지 생성
- `/history`: 분석 내역
- `/settings`: 마이페이지/설정

## CSS 분리 기준

```text
styles/pages/
  pageCommon.css
  landing.css
  auth.css
  homePage.css
  projectsPage.css
  newAnalysisPage.css
  analysisProgressPage.css
  resultSummaryPage.css
  detailAnalysisPage.css
  commitMessagePage.css
  historyPage.css
  myPage.css
```

- `pageCommon.css`: 페이지 헤더, 카드, 배지, 페이지네이션 등 공통 화면 패턴
- `layout/`: `AppLayout`, `Header`, `Sidebar` 같은 앱 골격
- `components/`: Dialog, Alert, 공통 UI 조각
- 각 페이지 JSX는 필요한 CSS를 직접 import합니다.

## Mock 데이터

```env
VITE_USE_MOCKS=true
VITE_API_BASE_URL=http://localhost:8000
```

- `true`: 포트폴리오 시연용 mock 데이터 사용
- `false`: `src/api.js`의 실제 API 함수로 백엔드 요청

## API 연결

`src/api.js`에서 인증, 프로젝트, 분석 실행, 진행 상태, 결과 요약, 상세 분석, 커밋 메시지, 분석 내역, 마이페이지 설정 API 함수를 관리합니다.

mock을 끄면 화면에서 사용하는 데이터 조회 함수가 바로 실제 API 요청으로 전환됩니다. 이 상태에서는 API 응답이 없거나 실패해도 더미 데이터로 채우지 않습니다.
