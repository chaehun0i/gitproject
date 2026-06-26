# API 관리 폴더

프론트엔드에서 FastAPI를 호출하는 코드는 나중에 이 폴더에서 관리합니다.

현재 기본 세팅 단계에서는 JavaScript 파일을 만들지 않습니다.

추후 Axios를 다시 추가할 때 예정 구조는 다음과 같습니다.

```text
frontend/src/api/
  client.js          Axios 공통 설정
  health.js          /api/health 호출
  services.js        /api/services 호출
  projects.js        /api/projects 호출
  analysis-runs.js   /api/analysis-runs 호출
```
