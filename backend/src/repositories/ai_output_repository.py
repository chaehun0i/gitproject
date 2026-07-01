from __future__ import annotations

from typing import Any

from utils.db import find_all, find_one, save


def create_output(run_id: int, output_type: str, content: str, metadata: str | None = None) -> None:
    save(
        """
        INSERT INTO ai_outputs (analysis_run_id, output_type, content, metadata)
        VALUES (%s, %s, %s, %s)
        """,
        (run_id, output_type, content, metadata),
    )


def latest_content(run_id: int, output_type: str) -> str | None:
    row = find_one(
        """
        SELECT content
        FROM ai_outputs
        WHERE analysis_run_id = %s AND output_type = %s
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (run_id, output_type),
    )
    return row.get("content") if row else None


def list_by_run(run_id: int) -> list[dict[str, Any]]:
    return find_all(
        """
        SELECT output_type, content
        FROM ai_outputs
        WHERE analysis_run_id = %s
        ORDER BY created_at ASC, id ASC
        """,
        (run_id,),
    )


def list_commit_messages(run_id: int) -> list[dict[str, Any]]:
    return find_all(
        """
        SELECT content, metadata
        FROM ai_outputs
        WHERE analysis_run_id = %s AND output_type = 'commit_message'
        ORDER BY created_at ASC, id ASC
        """,
        (run_id,),
    )

