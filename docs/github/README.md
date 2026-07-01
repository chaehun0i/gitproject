# GitHub 연결 문서

이 프로젝트는 GitHub 저장소에 올려 이력 관리와 GitHub Actions를 사용할 예정입니다.

- [GitHub 작업 규칙](./workflow.md)

## 저장소 생성 예시

```bash
gh repo create ai-dev-history-assistant --private --source=. --remote=origin --push
```

공개 저장소로 만들려면 `--private` 대신 `--public`을 사용합니다.

## 확인 명령

```bash
git remote -v
git branch --show-current
```

## Git 분석 산출물 저장 가이드

### A. 현재 커밋하지 않은 작업 저장

아직 커밋하지 않은 작업트리 변경과 staged 변경을 파일로 남깁니다.

```bash
git status --short > changed-files.txt
git diff > working-changes.diff
git diff --staged > staged-changes.diff
```

### B. 브랜치에 이미 커밋된 변경 저장

현재 브랜치에 커밋된 이력과 base 브랜치 이후의 변경을 저장합니다.

```bash
git fetch origin
git log --reverse --stat --patch origin/main..HEAD > commit-history.patch
git diff origin/main...HEAD > branch-changes.diff
git diff --name-status origin/main...HEAD > branch-changed-files.txt
```

`git diff origin/main...HEAD`는 base 브랜치 이후 현재 브랜치에 커밋된 변경을 확인할 때 사용합니다.

### C. 커밋된 변경과 커밋하지 않은 변경을 함께 저장

현재 브랜치의 커밋 이력과 작업트리 변경까지 한 번에 저장합니다.

```bash
git fetch origin
git log --reverse --stat --patch origin/main..HEAD > commit-history.patch
git diff origin/main > all-current-changes.diff
git diff --name-status origin/main > all-current-changed-files.txt
git status --short > working-status.txt
```

`git diff origin/main`은 현재 작업트리 변경까지 포함해서 base 브랜치와 비교합니다.

### D. base 브랜치가 main이 아닌 경우

`origin/main`을 실제 base 브랜치로 바꿔 실행합니다.

```bash
git diff origin/base-branch > all-current-changes.diff
```

### E. 출력 파일이 비어 있는 경우

브랜치 위치, 작업트리 상태, 최근 커밋을 먼저 확인합니다.

```bash
git branch --show-current
git status --short
git log --oneline --decorate -5
```
