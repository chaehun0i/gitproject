from __future__ import annotations

from typing import Any

from utils.db import find_one


def count_row(sql: str, params: tuple[Any, ...]) -> int:
    row = find_one(sql, params)
    return int((row or {}).get("count") or 0)


def project_count(user_id: int) -> int:
    return count_row("SELECT COUNT(*) AS count FROM projects WHERE user_id = %s", (user_id,))


def run_count(user_id: int) -> int:
    return count_row("SELECT COUNT(*) AS count FROM analysis_runs WHERE user_id = %s", (user_id,))


def changed_file_count(user_id: int) -> int:
    return count_row(
        """
        SELECT COUNT(*) AS count
        FROM changed_files cf
        INNER JOIN analysis_runs ar ON ar.id = cf.analysis_run_id
        WHERE ar.user_id = %s
        """,
        (user_id,),
    )


def risk_count(user_id: int) -> int:
    return count_row(
        """
        SELECT COUNT(*) AS count
        FROM risk_findings rf
        INNER JOIN analysis_runs ar ON ar.id = rf.analysis_run_id
        WHERE ar.user_id = %s
        """,
        (user_id,),
    )

