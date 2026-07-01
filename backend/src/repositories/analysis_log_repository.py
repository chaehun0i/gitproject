from __future__ import annotations

from typing import Any

from utils.db import find_all, save


def create_log(run_id: int, message: str) -> None:
    save(
        "INSERT INTO analysis_logs (analysis_run_id, message) VALUES (%s, %s)",
        (run_id, message),
    )


def list_messages(run_id: int) -> list[str]:
    rows = find_all(
        """
        SELECT message
        FROM analysis_logs
        WHERE analysis_run_id = %s
        ORDER BY created_at ASC, id ASC
        """,
        (run_id,),
    )
    return [row["message"] for row in rows]

