# AI Commit Analyzer Frontend

Vite + React 기반 프론트엔드입니다.

## 기준

- import 경로는 `vite.config.js`의 alias를 사용합니다.
- 브라우저 기본 `alert()` 대신 앱 내부 커스텀 알럿을 사용합니다.
- 컴포넌트와 핸들러는 `const` 기반 화살표 함수로 작성합니다.
- 처음부터 파일을 과하게 나누지 않고, 파일이 커지거나 재사용 지점이 생길 때 분리합니다.

## 현재 구조

```text
src/
  assets/
  components/
    common/
  styles/
    global.css
  App.jsx
  main.jsx
```

기능이 커지면 `components/project`, `components/commit`, `components/analysis`, `pages`, `services`, `stores`, `utils` 순서로 확장합니다.
