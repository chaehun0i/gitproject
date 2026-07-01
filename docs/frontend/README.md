# Frontend

CommitLens 프론트엔드는 Vite + React + React Router + Redux Toolkit 기반입니다.

현재 프론트엔드는 포트폴리오 화면 완성도를 우선하며, mock 데이터와 실제 API 연결을 전환할 수 있는 구조를 유지합니다.

## Routing

- `/`: 로그인 전 랜딩 또는 로그인 후 내부 홈
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

## Mock Data

더미 데이터는 환경변수로 제어합니다.

```env
VITE_USE_MOCKS=true
```

- `true`: 포트폴리오 데모용 더미 데이터 표시
- `false`: 더미 데이터 비활성화, 화면 데이터는 실제 API 응답만 사용

`false`일 때는 `frontend/src/api.js`의 API 함수들이 실제 백엔드로 요청을 보냅니다. 개발 서버에서는 `VITE_API_BASE_URL=http://localhost:8000`처럼 백엔드 origin을 직접 지정합니다.

## API 연결 기준

프론트에서 미리 준비한 API 연결 지점은 다음과 같습니다.

| 화면 | 함수 | 기본 경로 |
| --- | --- | --- |
| 로그인 | `loginUser` | `POST /auth/login` |
| 회원가입 | `signupUser` | `POST /auth/signup` |
| 로그인 유지 | `refreshSession` | `POST /auth/refresh` |
| Home | `getWorkspace` | `GET /workspace` |
| 프로젝트 목록 | `getProjects` | `GET /projects` |
| 프로젝트 제거 | `removeProject` | `DELETE /projects/:id` |
| 새 분석 시작 | `createAnalysisRun` | `POST /analysis/runs` |
| Git 산출물 업로드 분석 | `uploadAnalysisArtifacts` | `POST /analysis/runs/upload` |
| 분석 진행 | `getAnalysisProgress` | `GET /analysis/runs/:id/progress` |
| 결과 요약 | `getAnalysisSummary` | `GET /analysis/runs/:id/summary` |
| 상세 분석 | `getAnalysisDetail` | `GET /analysis/runs/:id/detail` |
| 커밋 메시지 | `getCommitMessages` | `GET /analysis/runs/:id/commit-messages` |
| 분석 내역 | `getAnalysisHistory` | `GET /analysis/runs` |
| 마이페이지 | `getSettings` | `GET /settings` |
| 알림 설정 | `updateNotificationSettings` | `PATCH /settings/notifications` |

API 응답은 `{ user }`, `{ projects }`, `{ workspace }`처럼 래핑된 형태와 직접 데이터 형태를 모두 받을 수 있게 처리합니다.

## Styling

`global.css`는 reset과 변수만 유지합니다.

- `styles/pages`: 페이지 단위 스타일
- `styles/layout`: 레이아웃/사이드바 스타일
- `styles/components`: Dialog 등 컴포넌트 스타일

페이지에서 필요한 CSS를 직접 import해 스타일 범위를 추적하기 쉽게 관리합니다.

### Page CSS

```text
frontend/src/styles/pages/
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

- `pageCommon.css`: 페이지 헤더, 카드, 배지, 페이지네이션, 공통 안내 패널
- `landing.css`: 로그인 전 랜딩
- `auth.css`: 로그인/회원가입
- `myPage.css`: 마이페이지/설정
- 나머지 파일은 각 페이지 전용 스타일

`appPages.css`는 이전 통합 스타일 파일이며, 현재는 deprecated 안내만 남겨둡니다.

## Layout

- 로그인 후 화면은 `AppLayout`에서 고정 헤더와 접힘 가능한 사이드바를 함께 제공합니다.
- 헤더에는 새 분석 모달, 알림 패널, 사용자 이동, 로그아웃 액션을 둡니다.
- 사이드바는 화면 높이가 낮은 노트북에서도 주요 메뉴와 최근 분석 상태가 보이도록 compact 스타일을 사용합니다.
- 반응형 기준은 1600, 1440, 1280, 1024, 768, 640px를 기본으로 합니다.

## Modal / Notification

- 새 분석 시작은 단계형 모달을 우선 사용합니다.
- 분석 진행 상태는 모달 흐름과 별도 라우트 화면을 모두 유지합니다.
- 알림은 헤더 버튼에서 오른쪽 패널로 열리며, 탭 필터와 개별 삭제를 지원합니다.
- 확인/삭제/경고는 SweetAlert2, 성공/실패 알림은 Sonner, 긴 설정창은 Radix Dialog 방향을 유지합니다.
