from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, status

from src.models.projects import ProjectPayload
from src.services.auth_service import get_authenticated_user
from src.services.project_service import (
    create_project_for_user,
    delete_project_for_user,
    get_project_for_user,
    list_projects_for_user,
    update_project_for_user,
)

projects_router = APIRouter(tags=["projects"])


@projects_router.get("")
async def list_projects(user: dict[str, Any] = Depends(get_authenticated_user)) -> dict[str, list[dict[str, Any]]]:
    return list_projects_for_user(user)


@projects_router.post("", status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: ProjectPayload,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    return create_project_for_user(payload, user)


@projects_router.get("/{project_id}")
async def get_project(
    project_id: int,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    return get_project_for_user(project_id, user)


@projects_router.patch("/{project_id}")
async def update_project(
    project_id: int,
    payload: ProjectPayload,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    return update_project_for_user(project_id, payload, user)


@projects_router.delete("/{project_id}")
async def delete_project(project_id: int, user: dict[str, Any] = Depends(get_authenticated_user)) -> dict[str, bool]:
    return delete_project_for_user(project_id, user)

