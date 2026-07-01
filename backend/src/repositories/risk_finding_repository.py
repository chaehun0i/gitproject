from __future__ import annotations

from typing import Any

from utils.db import find_all, find_one, save


def insert_many(run_id: int, risks: list[dict[str, Any]]) -> None:
    for risk in risks:
        save(
            """
            INSERT INTO risk_findings
                (analysis_run_id, severity, category, title, description, recommendation)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                run_id,
                risk.get("severity") or "low",
                risk.get("category") or "general",
                risk.get("title"),
                risk.get("description"),
                risk.get("recommendation"),
            ),
        )


def count_by_run(run_id: int) -> int:
    row = find_one("SELECT COUNT(*) AS count FROM risk_findings WHERE analysis_run_id = %s", (run_id,))
    return int((row or {}).get("count") or 0)


def list_by_run(run_id: int) -> list[dict[str, Any]]:
    return find_all(
        """
        SELECT severity, category, title, description, recommendation
        FROM risk_findings
        WHERE analysis_run_id = %s
        ORDER BY id ASC
        """,
        (run_id,),
    )


def top_review_points(run_id: int, limit: int = 5) -> list[str]:
    rows = find_all(
        """
        SELECT title, recommendation
        FROM risk_findings
        WHERE analysis_run_id = %s
        ORDER BY FIELD(severity, 'critical', 'high', 'medium', 'low'), id
        LIMIT %s
        """,
        (run_id, limit),
    )
    return [
        row.get("recommendation") or row.get("title")
        for row in rows
        if row.get("recommendation") or row.get("title")
    ]

