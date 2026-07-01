from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends

from src.models.settings import NotificationUpdate, PasswordUpdate, ProfileUpdate
from src.services.auth_service import get_authenticated_user
from src.services.setting_service import (
    get_settings as get_settings_service,
    unlink_integration as unlink_integration_service,
    update_notifications as update_notifications_service,
    update_password as update_password_service,
    update_profile as update_profile_service,
)

settings_router = APIRouter(tags=["settings"])


@settings_router.get("")
async def get_settings(user: dict[str, Any] = Depends(get_authenticated_user)) -> dict[str, dict[str, Any]]:
    return get_settings_service(user)


@settings_router.patch("/profile")
async def update_profile(
    payload: ProfileUpdate,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    return update_profile_service(payload, user)


@settings_router.patch("/password")
async def update_password(
    payload: PasswordUpdate,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, bool]:
    return update_password_service(payload, user)


@settings_router.patch("/notifications")
async def update_notifications(
    payload: NotificationUpdate,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, bool]]:
    return update_notifications_service(payload, user)


@settings_router.delete("/integrations/{key}")
async def unlink_integration(key: str, user: dict[str, Any] = Depends(get_authenticated_user)) -> dict[str, bool | str]:
    return unlink_integration_service(key, user)

