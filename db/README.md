# DB 실행 폴더

이 폴더는 DB 관련 Compose 파일과 초기화 SQL을 관리합니다.

## 실행

이 폴더에서 실행합니다.

```bash
docker compose up -d
```

생성되는 항목은 다음과 같습니다.

- Postgres + pgvector
- MariaDB
- Redis
- 공유 네트워크 `ai-lab-network`
- DB 영속 볼륨

## 확인

```bash
docker compose ps
docker compose logs postgres
docker compose logs mariadb
```

## 초기화 SQL

Postgres 초기화 파일:

```text
postgres/init
```

MariaDB 초기화 파일:

```text
mariadb/init
```

초기화 SQL은 DB 볼륨이 처음 생성될 때만 실행됩니다.

스키마를 처음부터 다시 만들려면 DB 스택을 내리고 볼륨을 삭제한 뒤 다시 실행해야 합니다.

## MVP 테이블

문서 기준은 `docs/db/v1-mvp-schema.md`입니다.

현재 MVP 테이블은 다음 7개입니다.

- `users`
- `projects`
- `analysis_runs`
- `uploaded_files`
- `changed_files`
- `risk_findings`
- `ai_outputs`
