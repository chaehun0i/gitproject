# GitHub 연결 문서

이 프로젝트는 GitHub 저장소에 올려서 이력 관리와 GitHub Actions를 사용할 예정입니다.

- [GitHub 작업 규칙](./workflow.md)

## 현재 상태

로컬 프로젝트를 먼저 Git 저장소로 초기화합니다.

그 다음 GitHub 원격 저장소를 생성하고 `origin`으로 연결합니다.

## 권장 저장소 이름

```text
ai-dev-history-assistant
```

## 저장소 생성 명령 예시

GitHub CLI 로그인이 되어 있다면 다음 명령으로 원격 저장소를 만들 수 있습니다.

```bash
gh repo create ai-dev-history-assistant --private --source=. --remote=origin --push
```

공개 저장소로 만들려면 `--private` 대신 `--public`을 사용합니다.

## 확인 명령

```bash
git remote -v
git branch --show-current
```

## 주의

GitHub 원격 저장소 생성은 GitHub 계정과 공개 여부가 필요한 외부 작업입니다.

저장소 이름과 공개 여부를 확정한 뒤 실행합니다.
