from __future__ import annotations

from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from src.apis.auth import get_authenticated_user
from utils.db import add_key, find_all, find_one, save

projects_router = APIRouter(tags=["projects"])

STATUS_DONE = "\ubd84\uc11d \uc644\ub8cc"
STATUS_RUNNING = "\ubd84\uc11d \uc911"
STATUS_WAITING = "\ubd84\uc11d \ub300\uae30"
STATUS_FAILED = "\ubd84\uc11d \uc2e4\ud328"


class ProjectPayload(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = None
    owner: str | None = None
    repo: str | None = None
    source: str | None = None
    visibility: str | None = "private"
    branch: str | None = "main"
    language: str | None = None
    starred: bool = False


def _format_datetime(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.isoformat()
    return str(value)


def _relative_time(value: Any) -> str:
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


def _status_label(status_value: str | None) -> str:
    status_name = (status_value or "PENDING").upper()
    if status_name == "COMPLETED":
        return STATUS_DONE
    if status_name in {"RUNNING", "PARSING", "ANALYZING", "AI_GENERATING"}:
        return STATUS_RUNNING
    if status_name == "FAILED":
        return STATUS_FAILED
    return STATUS_WAITING


def _project_stats(project_id: int) -> dict[str, Any]:
    latest_run = find_one(
        """
        SELECT id, status, progress, created_at
        FROM analysis_runs
        WHERE project_id = %s
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (project_id,),
    )
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
        "latestRun": latest_run,
        "files": int((file_count or {}).get("count") or 0),
        "risks": int((risk_count or {}).get("count") or 0),
        "runs": int((run_count or {}).get("count") or 0),
    }


def project_response(project: dict[str, Any]) -> dict[str, Any]:
    stats = _project_stats(int(project["id"]))
    latest_run = stats["latestRun"]
    status_label = _status_label(latest_run.get("status") if latest_run else None)
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
        "createdAt": _format_datetime(project.get("created_at")),
        "updatedAt": _format_datetime(project.get("updated_at")),
        "updated": _relative_time(updated_at),
        "status": status_label,
        "commits": "-",
        "files": str(stats["files"]) if stats["files"] else "-",
        "insights": str(stats["risks"]) if stats["risks"] else "-",
        "progress": progress,
        "analysis_count": stats["runs"],
    }


def _get_owned_project(project_id: int, user_id: int) -> dict[str, Any]:
    project = find_one(
        "SELECT * FROM projects WHERE id = %s AND user_id = %s",
        (project_id, user_id),
    )
    if project is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


@projects_router.get("")
async def list_projects(user: dict[str, Any] = Depends(get_authenticated_user)) -> dict[str, list[dict[str, Any]]]:
    rows = find_all(
        "SELECT * FROM projects WHERE user_id = %s ORDER BY updated_at DESC, id DESC",
        (user["id"],),
    )
    return {"projects": [project_response(row) for row in rows]}


@projects_router.post("", status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: ProjectPayload,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    owner = payload.owner or "local"
    repo = payload.repo or payload.name
    project_id = add_key(
        """
        INSERT INTO projects
            (user_id, name, description, owner, repo, source, visibility, branch, language, starred)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            user["id"],
            payload.name,
            payload.description,
            owner,
            repo,
            payload.source or "git_upload",
            payload.visibility or "private",
            payload.branch or "main",
            payload.language,
            payload.starred,
        ),
    )
    return {"project": project_response(_get_owned_project(project_id, int(user["id"])))}


@projects_router.get("/{project_id}")
async def get_project(
    project_id: int,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    return {"project": project_response(_get_owned_project(project_id, int(user["id"])))}


@projects_router.patch("/{project_id}")
async def update_project(
    project_id: int,
    payload: ProjectPayload,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    _get_owned_project(project_id, int(user["id"]))
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
        (
            payload.name,
            payload.description,
            payload.owner or "local",
            payload.repo or payload.name,
            payload.source or "git_upload",
            payload.visibility or "private",
            payload.branch or "main",
            payload.language,
            payload.starred,
            project_id,
            user["id"],
        ),
    )
    return {"project": project_response(_get_owned_project(project_id, int(user["id"])))}


@projects_router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, bool]:
    _get_owned_project(project_id, int(user["id"]))
    save("DELETE FROM projects WHERE id = %s AND user_id = %s", (project_id, user["id"]))
    return {"ok": True}
