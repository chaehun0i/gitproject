# GitHub 작업 규칙

이 문서는 이 프로젝트에서 이슈, 브랜치, 커밋, PR을 어떻게 관리할지 정리한 규칙입니다.

## 기본 흐름

```text
이슈 생성
  -> 브랜치 생성
  -> 작업
  -> 커밋
  -> 원격 브랜치 푸시
  -> PR 생성
  -> 리뷰 또는 확인
  -> main 머지
```

## 1. 이슈 규칙

작업을 시작하기 전에 이슈를 먼저 만듭니다.

이슈 제목은 짧고 명확하게 작성합니다.

예시:

```text
프로젝트 초기 구조 및 Docker 환경 구성
FastAPI 라우터 기본 구조 추가
DB MVP 스키마 작성
프론트 Nginx 프록시 설정
```

이슈 본문에는 다음 내용을 적습니다.

```md
## 작업 목적
- 왜 이 작업을 하는지 작성

## 작업 내용
- 해야 할 일 목록 작성

## 완료 기준
- 어떤 상태가 되면 완료인지 작성
```

## 2. 브랜치 규칙

브랜치는 이슈 번호와 작업 종류를 포함합니다.

```text
종류/이슈번호-작업이름
```

예시:

```text
chore/1-init-project
feat/2-analysis-api
fix/3-nginx-proxy
docs/4-github-workflow
ci/5-github-actions
```

## 3. 브랜치 종류

| 종류 | 의미 |
| --- | --- |
| `feat` | 새 기능 추가 |
| `fix` | 버그 수정 |
| `chore` | 설정, 구조, 환경 작업 |
| `docs` | 문서 작업 |
| `refactor` | 동작 변경 없는 코드 개선 |
| `test` | 테스트 추가 또는 수정 |
| `ci` | GitHub Actions 등 CI 설정 |

## 4. 커밋 규칙

커밋 메시지는 한글로 짧고 명확하게 작성합니다.

형식:

```text
작업 내용을 한 문장으로 작성
```

예시:

```text
프로젝트 기본 구조와 Docker Compose 설정 추가
FastAPI 라우터 등록 구조 추가
DB 초기 스키마 작성
프론트 Nginx 프록시 설정 추가
GitHub 작업 규칙 문서 추가
```

## 5. PR 규칙

PR 제목은 이슈 제목과 비슷하게 작성합니다.

예시:

```text
프로젝트 초기 구조 및 Docker 환경 구성
```

PR 본문 형식:

```md
## 작업 내용
- 변경한 내용을 작성

## 확인
- 확인한 내용을 작성

Closes #이슈번호
```

예시:

```md
## 작업 내용
- FastAPI 백엔드 기본 구조 추가
- Nginx 프론트 기본 구조 추가
- DB Compose 설정 추가
- GitHub Actions 기본 워크플로우 추가

## 확인
- Docker Compose 설정 확인
- 환경 변수 예시 파일 확인

Closes #1
```

## 6. 이번 초기 세팅 작업 예시

이슈 제목:

```text
프로젝트 초기 구조 및 Docker 환경 구성
```

브랜치명:

```text
chore/1-init-project
```

커밋 메시지:

```text
프로젝트 기본 구조와 Docker Compose 설정 추가
```

PR 제목:

```text
프로젝트 초기 구조 및 Docker 환경 구성
```
