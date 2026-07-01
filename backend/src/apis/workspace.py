from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends

from src.apis.auth import get_authenticated_user
from src.apis.projects import project_response
from utils.db import find_all, find_one

workspace_router = APIRouter(tags=["workspace"])


def _count(sql: str, params: tuple[Any, ...]) -> int:
    row = find_one(sql, params)
    return int((row or {}).get("count") or 0)


@workspace_router.get("")
async def get_workspace(user: dict[str, Any] = Depends(get_authenticated_user)) -> dict[str, dict[str, Any]]:
    user_id = int(user["id"])
    project_count = _count("SELECT COUNT(*) AS count FROM projects WHERE user_id = %s", (user_id,))
    run_count = _count("SELECT COUNT(*) AS count FROM analysis_runs WHERE user_id = %s", (user_id,))
    file_count = _count(
        """
        SELECT COUNT(*) AS count
        FROM changed_files cf
        INNER JOIN analysis_runs ar ON ar.id = cf.analysis_run_id
        WHERE ar.user_id = %s
        """,
        (user_id,),
    )
    risk_count = _count(
        """
        SELECT COUNT(*) AS count
        FROM risk_findings rf
        INNER JOIN analysis_runs ar ON ar.id = rf.analysis_run_id
        WHERE ar.user_id = %s
        """,
        (user_id,),
    )
    projects = find_all(
        "SELECT * FROM projects WHERE user_id = %s ORDER BY updated_at DESC, id DESC LIMIT 4",
        (user_id,),
    )
    recent_projects = []
    for project in projects:
        item = project_response(project)
        recent_projects.append(
            [
                item["name"],
                item["source"],
                item["branch"],
                item["status"],
                item["updated"],
                item["progress"],
            ]
        )

    workspace = {
        "kpis": [
            ["Projects", str(project_count), "connected repositories and uploads"],
            ["Analysis runs", str(run_count), "all saved runs"],
            ["Changed files", str(file_count), "from stored analysis data"],
            ["Risk findings", str(risk_count), "review candidates"],
        ],
        "recentProjects": recent_projects,
        "insights": [
            ["Review focus", f"{risk_count} risk finding(s) are stored for review."],
            ["Analysis coverage", f"{file_count} changed file(s) are available in detail views."],
            ["Next step", "Run analysis generation to populate AI summaries and commit messages."],
        ],
        "chartValues": [project_count, run_count, file_count, risk_count],
    }
    return {"workspace": workspace}
