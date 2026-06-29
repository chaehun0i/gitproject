# Frontend

CommitLens 프론트엔드는 Vite + React + React Router + Redux Toolkit 기반입니다.

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
- `false`: 더미 데이터 비활성화, 빈 상태 화면 표시

## Styling

`global.css`는 reset과 변수만 유지합니다.

- `styles/pages`: 페이지 단위 스타일
- `styles/layout`: 레이아웃/사이드바 스타일
- `styles/components`: Dialog 등 컴포넌트 스타일

페이지에서 필요한 CSS를 직접 import해 스타일 범위를 추적하기 쉽게 관리합니다.
