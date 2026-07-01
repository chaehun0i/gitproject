from __future__ import annotations

from typing import Any

from utils.db import add_key, find_all, find_one, save

ANALYSIS_RUN_COLUMNS = (
    "id, project_id, user_id, source_type, status, progress, title, "
    "repository, branch, range_label, options, metadata, created_at, updated_at"
)


def create_run(
    project_id: int,
    user_id: int,
    source_type: str,
    title: str,
    repository: str,
    branch: str,
    range_label: str | None,
    options: str,
) -> int:
    return add_key(
        """
        INSERT INTO analysis_runs
            (project_id, user_id, source_type, status, progress, title,
             repository, branch, range_label, options)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (project_id, user_id, source_type, "PENDING", 0, title, repository, branch, range_label, options),
    )


def get_by_id_and_user(run_id: int, user_id: int) -> dict[str, Any] | None:
    return find_one(
        f"SELECT {ANALYSIS_RUN_COLUMNS} FROM analysis_runs WHERE id = %s AND user_id = %s",
        (run_id, user_id),
    )


def get_latest_by_user(user_id: int) -> dict[str, Any] | None:
    return find_one(
        f"""
        SELECT {ANALYSIS_RUN_COLUMNS}
        FROM analysis_runs
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (user_id,),
    )


def list_by_user(user_id: int) -> list[dict[str, Any]]:
    return find_all(
        """
        SELECT ar.id,
               ar.project_id,
               ar.user_id,
               ar.source_type,
               ar.status,
               ar.progress,
               ar.title,
               ar.repository,
               ar.branch,
               ar.created_at,
               p.name AS project_name
        FROM analysis_runs ar
        LEFT JOIN projects p ON p.id = ar.project_id
        WHERE ar.user_id = %s
        ORDER BY ar.created_at DESC
        """,
        (user_id,),
    )


def update_progress(run_id: int, user_id: int, status: str, progress: int) -> None:
    save(
        """
        UPDATE analysis_runs
        SET status = %s, progress = %s
        WHERE id = %s AND user_id = %s
        """,
        (status, progress, run_id, user_id),
    )

