from __future__ import annotations

from typing import Any

from utils.db import find_all, find_one, save


def insert_many(run_id: int, files: list[dict[str, Any]]) -> None:
    for item in files:
        save(
            """
            INSERT INTO changed_files
                (analysis_run_id, file_path, old_path, change_type, language,
                 additions, deletions, patch_text)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                run_id,
                item.get("file_path"),
                item.get("old_path"),
                item.get("change_type") or "modified",
                item.get("language"),
                int(item.get("additions") or 0),
                int(item.get("deletions") or 0),
                item.get("patch_text"),
            ),
        )


def list_by_run(run_id: int) -> list[dict[str, Any]]:
    return find_all(
        """
        SELECT file_path, language, change_type, additions, deletions, patch_text
        FROM changed_files
        WHERE analysis_run_id = %s
        ORDER BY id ASC
        """,
        (run_id,),
    )


def count_by_run(run_id: int) -> int:
    row = find_one("SELECT COUNT(*) AS count FROM changed_files WHERE analysis_run_id = %s", (run_id,))
    return int((row or {}).get("count") or 0)


def line_totals(run_id: int) -> dict[str, int]:
    row = find_one(
        """
        SELECT COALESCE(SUM(additions), 0) AS additions,
               COALESCE(SUM(deletions), 0) AS deletions
        FROM changed_files
        WHERE analysis_run_id = %s
        """,
        (run_id,),
    ) or {}
    return {
        "additions": int(row.get("additions") or 0),
        "deletions": int(row.get("deletions") or 0),
    }


def change_type_counts(run_id: int) -> list[dict[str, Any]]:
    return find_all(
        """
        SELECT COALESCE(change_type, 'modified') AS name, COUNT(*) AS value
        FROM changed_files
        WHERE analysis_run_id = %s
        GROUP BY COALESCE(change_type, 'modified')
        """,
        (run_id,),
    )

