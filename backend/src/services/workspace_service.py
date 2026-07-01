from __future__ import annotations

from typing import Any

from src.repositories import project_repository, workspace_repository
from src.services.project_service import project_response


def get_workspace(user: dict[str, Any]) -> dict[str, dict[str, Any]]:
    user_id = int(user["id"])
    project_count = workspace_repository.project_count(user_id)
    run_count = workspace_repository.run_count(user_id)
    file_count = workspace_repository.changed_file_count(user_id)
    risk_count = workspace_repository.risk_count(user_id)
    recent_projects = []
    for project in project_repository.list_by_user(user_id, limit=4):
        item = project_response(project)
        recent_projects.append(
            [item["name"], item["source"], item["branch"], item["status"], item["updated"], item["progress"]]
        )
    return {
        "workspace": {
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
    }

