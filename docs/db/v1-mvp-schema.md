# DB v1 MVP 스키마

## 버전 정보

| 항목 | 내용 |
| --- | --- |
| 버전 | v1 |
| 범위 | 파일 업로드 기반 코드 변경 분석 |
| GitHub 연동 | 제외 |
| 중심 키 | `analysis_run_id` |
| 기본 DB | PostgreSQL |

## MVP 목표

v1에서는 GitHub 직접 연동을 제외합니다.

사용자가 업로드하거나 입력한 `git diff`, `git log`, 변경 파일 zip, 직접 입력 텍스트를 분석합니다.

분석 결과로 다음 정보를 제공합니다.

1. 변경 파일 목록
2. 변경 규모
3. 프론트엔드, 백엔드, DB, 인프라 분류
4. 위험 변경 감지
5. 추천 커밋 메시지
6. PR 제목과 본문 초안
7. 리뷰 포인트
8. 테스트 체크리스트

## v1 테이블

| 테이블 | 역할 |
| --- | --- |
| `users` | 사용자 |
| `projects` | 분석 프로젝트 |
| `analysis_runs` | 분석 실행 1회 단위 |
| `uploaded_files` | 업로드된 파일 |
| `changed_files` | 변경 파일 분석 결과 |
| `risk_findings` | 위험 변경 감지 결과 |
| `ai_outputs` | AI 생성 결과 |

## 기준 관계

MVP의 중심 키는 `analysis_run_id`입니다.

```text
project_id = 어떤 프로젝트인지
analysis_run_id = 이번 분석 실행 1회
changed_file_id = 이번 분석에서 발견한 변경 파일 1개
ai_output_id = AI가 생성한 결과 1개
```

같은 프로젝트에서 여러 번 분석할 수 있으므로 `changed_files`, `risk_findings`, `ai_outputs`는 모두 `analysis_run_id`를 기준으로 묶습니다.

```text
Project A
  analysis_run_id = 1 : 로그인 기능 diff 분석
  analysis_run_id = 2 : Docker 설정 변경 분석
  analysis_run_id = 3 : 전체 PR 변경 사항 분석
```

## ERD 흐름

```text
users
  -> projects
       -> analysis_runs
            -> uploaded_files
            -> changed_files
                 -> risk_findings
            -> ai_outputs
```

## source_type

`analysis_runs.source_type`은 분석 입력 종류를 나타냅니다.

```text
diff_upload
zip_upload
log_upload
manual_text
```

## status

`analysis_runs.status`는 분석 진행 상태를 나타냅니다.

```text
pending
parsing
analyzing
ai_generating
completed
failed
```

## module_type

`changed_files.module_type`은 변경 파일의 영역을 나타냅니다.

```text
frontend
backend
database
infra
config
test
docs
unknown
```

## 위험 변경 카테고리

`risk_findings.category`는 위험 변경 종류를 나타냅니다.

```text
auth_change
db_migration
env_change
docker_change
ci_cd_change
large_delete
no_test
dependency_change
security_sensitive
```

## AI 결과 종류

`ai_outputs.output_type`은 AI가 생성한 결과 종류를 나타냅니다.

```text
commit_message
pr_title
pr_body
change_summary
review_points
test_checklist
risk_explanation
```

## v1 제외 범위

v1에서는 다음 기능을 구현하지 않습니다.

```text
GitHub Repository 연결
GitHub OAuth
PR 직접 생성
Issue 연동
Webhook 자동 분석
Commit 영구 저장
```

## 이후 확장 후보

GitHub 연동 단계에서 다음 테이블을 추가할 수 있습니다.

```text
repositories
commits
github_webhook_events
pull_requests
```

## 결론

MVP는 파일 업로드 기반 코드 변경 분석기로 시작합니다.

DB는 7개 테이블로 충분하며, 중심 키는 `analysis_run_id`입니다.
