from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends

from src.services.auth_service import get_authenticated_user
from src.services.workspace_service import get_workspace as get_workspace_service

workspace_router = APIRouter(tags=["workspace"])


@workspace_router.get("")
async def get_workspace(user: dict[str, Any] = Depends(get_authenticated_user)) -> dict[str, dict[str, Any]]:
    return get_workspace_service(user)

