from __future__ import annotations

from typing import Any

from utils.db import add_key, find_all, find_one, save

PROJECT_COLUMNS = (
    "id, user_id, name, description, owner, repo, source, visibility, "
    "branch, language, starred, created_at, updated_at"
)


def list_by_user(user_id: int, limit: int | None = None) -> list[dict[str, Any]]:
    sql = f"SELECT {PROJECT_COLUMNS} FROM projects WHERE user_id = %s ORDER BY updated_at DESC, id DESC"
    if limit is not None:
        sql += " LIMIT %s"
        return find_all(sql, (user_id, limit))
    return find_all(sql, (user_id,))


def get_by_id_and_user(project_id: int, user_id: int) -> dict[str, Any] | None:
    return find_one(
        f"SELECT {PROJECT_COLUMNS} FROM projects WHERE id = %s AND user_id = %s",
        (project_id, user_id),
    )


def find_by_identity(user_id: int, name: str, owner: str, repo: str) -> dict[str, Any] | None:
    return find_one(
        f"""
        SELECT {PROJECT_COLUMNS}
        FROM projects
        WHERE user_id = %s AND name = %s AND owner = %s AND repo = %s
        """,
        (user_id, name, owner, repo),
    )


def create_project(
    user_id: int,
    name: str,
    description: str | None,
    owner: str,
    repo: str,
    source: str,
    visibility: str,
    branch: str,
    language: str | None,
    starred: bool,
) -> int:
    return add_key(
        """
        INSERT INTO projects
            (user_id, name, description, owner, repo, source, visibility, branch, language, starred)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (user_id, name, description, owner, repo, source, visibility, branch, language, starred),
    )


def create_minimal_project(
    user_id: int,
    name: str,
    owner: str,
    repo: str,
    source: str,
    branch: str,
) -> int:
    return add_key(
        """
        INSERT INTO projects (user_id, name, owner, repo, source, branch)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (user_id, name, owner, repo, source, branch),
    )


def update_project(
    project_id: int,
    user_id: int,
    name: str,
    description: str | None,
    owner: str,
    repo: str,
    source: str,
    visibility: str,
    branch: str,
    language: str | None,
    starred: bool,
) -> None:
    save(
        """
        UPDATE projects
        SET name = %s,
            description = %s,
            owner = %s,
            repo = %s,
            source = %s,
            visibility = %s,
            branch = %s,
            language = %s,
            starred = %s
        WHERE id = %s AND user_id = %s
        """,
        (name, description, owner, repo, source, visibility, branch, language, starred, project_id, user_id),
    )


def delete_project(project_id: int, user_id: int) -> None:
    save("DELETE FROM projects WHERE id = %s AND user_id = %s", (project_id, user_id))


def latest_run_for_project(project_id: int) -> dict[str, Any] | None:
    return find_one(
        """
        SELECT id, status, progress, created_at
        FROM analysis_runs
        WHERE project_id = %s
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (project_id,),
    )


def stats_for_project(project_id: int) -> dict[str, int]:
    file_count = find_one(
        """
        SELECT COUNT(*) AS count
        FROM changed_files cf
        INNER JOIN analysis_runs ar ON ar.id = cf.analysis_run_id
        WHERE ar.project_id = %s
        """,
        (project_id,),
    )
    risk_count = find_one(
        """
        SELECT COUNT(*) AS count
        FROM risk_findings rf
        INNER JOIN analysis_runs ar ON ar.id = rf.analysis_run_id
        WHERE ar.project_id = %s
        """,
        (project_id,),
    )
    run_count = find_one(
        "SELECT COUNT(*) AS count FROM analysis_runs WHERE project_id = %s",
        (project_id,),
    )
    return {
        "files": int((file_count or {}).get("count") or 0),
        "risks": int((risk_count or {}).get("count") or 0),
        "runs": int((run_count or {}).get("count") or 0),
    }

