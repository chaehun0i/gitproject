from __future__ import annotations

from datetime import datetime
from typing import Any

from fastapi import HTTPException, status

from src.domains.analysis_status import status_label
from src.models.projects import ProjectPayload
from src.repositories import project_repository


def format_datetime(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.isoformat()
    return str(value)


def relative_time(value: Any) -> str:
    if not isinstance(value, datetime):
        return "unknown"
    delta = datetime.now() - value
    if delta.days >= 1:
        return f"{delta.days}d ago"
    hours = delta.seconds // 3600
    if hours >= 1:
        return f"{hours}h ago"
    minutes = max(1, delta.seconds // 60)
    return f"{minutes}m ago"


def project_response(project: dict[str, Any]) -> dict[str, Any]:
    stats = project_repository.stats_for_project(int(project["id"]))
    latest_run = project_repository.latest_run_for_project(int(project["id"]))
    progress = int(latest_run.get("progress") or 0) if latest_run else 0
    updated_at = latest_run.get("created_at") if latest_run else project.get("updated_at")
    repo = project.get("repo") or project["name"]
    owner = project.get("owner") or "local"
    return {
        "id": project["id"],
        "name": project["name"],
        "description": project.get("description"),
        "owner": owner,
        "repo": repo,
        "source": project.get("source") or "git_upload",
        "visibility": project.get("visibility") or "private",
        "branch": project.get("branch") or "main",
        "language": project.get("language") or "Unknown",
        "starred": bool(project.get("starred")),
        "createdAt": format_datetime(project.get("created_at")),
        "updatedAt": format_datetime(project.get("updated_at")),
        "updated": relative_time(updated_at),
        "status": status_label(latest_run.get("status") if latest_run else None),
        "commits": "-",
        "files": str(stats["files"]) if stats["files"] else "-",
        "insights": str(stats["risks"]) if stats["risks"] else "-",
        "progress": progress,
        "analysis_count": stats["runs"],
    }


def get_owned_project(project_id: int, user_id: int) -> dict[str, Any]:
    project = project_repository.get_by_id_and_user(project_id, user_id)
    if project is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


def list_projects_for_user(user: dict[str, Any]) -> dict[str, list[dict[str, Any]]]:
    rows = project_repository.list_by_user(int(user["id"]))
    return {"projects": [project_response(row) for row in rows]}


def create_project_for_user(payload: ProjectPayload, user: dict[str, Any]) -> dict[str, dict[str, Any]]:
    owner = payload.owner or "local"
    repo = payload.repo or payload.name
    project_id = project_repository.create_project(
        int(user["id"]),
        payload.name,
        payload.description,
        owner,
        repo,
        payload.source or "git_upload",
        payload.visibility or "private",
        payload.branch or "main",
        payload.language,
        payload.starred,
    )
    return {"project": project_response(get_owned_project(project_id, int(user["id"])))}


def get_project_for_user(project_id: int, user: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {"project": project_response(get_owned_project(project_id, int(user["id"])))}


def update_project_for_user(project_id: int, payload: ProjectPayload, user: dict[str, Any]) -> dict[str, dict[str, Any]]:
    get_owned_project(project_id, int(user["id"]))
    project_repository.update_project(
        project_id,
        int(user["id"]),
        payload.name,
        payload.description,
        payload.owner or "local",
        payload.repo or payload.name,
        payload.source or "git_upload",
        payload.visibility or "private",
        payload.branch or "main",
        payload.language,
        payload.starred,
    )
    return {"project": project_response(get_owned_project(project_id, int(user["id"])))}


def delete_project_for_user(project_id: int, user: dict[str, Any]) -> dict[str, bool]:
    get_owned_project(project_id, int(user["id"]))
    project_repository.delete_project(project_id, int(user["id"]))
    return {"ok": True}

