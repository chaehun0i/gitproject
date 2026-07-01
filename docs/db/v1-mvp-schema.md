# DB v1 MVP 스키마

## 기준

- 실제 서비스 DB: MariaDB
- 보조 DB: PostgreSQL(pgdb), 향후 벡터 검색과 임베딩 저장 용도
- Redis: JWE 세션 UUID 저장
- 핵심 기준 키: `analysis_run_id`

## MariaDB 테이블

| 테이블 | 역할 |
| --- | --- |
| `users` | 사용자 계정 |
| `projects` | 분석 프로젝트 |
| `analysis_runs` | 분석 실행 단위 |
| `uploaded_files` | 사용자가 올린 Git 산출물 파일 |
| `changed_files` | 변경 파일 분석 결과 |
| `risk_findings` | 위험 변경 감지 결과 |
| `ai_outputs` | AI 생성 결과 |

## 주요 컬럼

### users

- `id`: 사용자 ID
- `email`: 로그인 이메일
- `password_hash`: 비밀번호 해시
- `name`: 사용자 이름
- `created_at`: 생성일

### projects

- `id`: 프로젝트 ID
- `user_id`: 소유 사용자
- `name`: 프로젝트명
- `description`: 설명
- `created_at`, `updated_at`: 생성/수정일

### analysis_runs

- `id`: 분석 실행 ID
- `project_id`: 프로젝트 ID
- `user_id`: 사용자 ID
- `source_type`: `diff_upload`, `zip_upload`, `log_upload`, `manual_text`, `github`
- `status`: `pending`, `parsing`, `analyzing`, `ai_generating`, `completed`, `failed`
- `progress`: 진행률
- `title`: 분석 제목
- `error_message`: 실패 메시지
- `started_at`, `completed_at`: 시작/완료 시간

### uploaded_files

- `analysis_run_id`: 분석 실행 ID
- `original_filename`: 업로드 원본 파일명
- `stored_path`: 저장 경로
- `file_type`: diff, patch, txt, zip 등
- `file_size`: 파일 크기
- `checksum`: 중복/무결성 확인용 체크섬

### changed_files

- `analysis_run_id`: 분석 실행 ID
- `file_path`: 변경 파일 경로
- `old_path`: rename 전 경로
- `change_type`: added, modified, deleted, renamed 등
- `language`: 언어
- `module_type`: frontend, backend, database, infra, config, test, docs, unknown
- `additions`, `deletions`, `total_changes`: 변경량
- `patch_text`: diff 본문
- `is_test_file`, `is_config_file`, `is_sensitive_file`: 파일 성격 플래그

### risk_findings

- `analysis_run_id`: 분석 실행 ID
- `changed_file_id`: 관련 변경 파일
- `severity`: low, medium, high, critical
- `category`: auth_change, db_migration, env_change, docker_change, ci_cd_change, large_delete, no_test, dependency_change, security_sensitive
- `title`, `description`, `recommendation`: 위험 설명과 제안

### ai_outputs

- `analysis_run_id`: 분석 실행 ID
- `output_type`: commit_message, pr_title, pr_body, change_summary, review_points, test_checklist, risk_explanation
- `model_name`: 사용 모델
- `prompt_version`: 프롬프트 버전
- `content`: AI 결과 본문
- `metadata`: 부가 정보

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

## PostgreSQL(pgdb)

`pgdb`는 현재 인증/서비스 로직에서 사용하지 않는다. 향후 코드 조각, 분석 결과, 문서 요약을 벡터화해 검색하는 용도로 둔다.

```text
vector_documents
  id
  source_type
  source_id
  title
  content
  embedding
  metadata
  created_at
```
