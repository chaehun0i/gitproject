from __future__ import annotations

from typing import Any

from fastapi import HTTPException, status

from core.security import hash_password, verify_password
from src.models.settings import NotificationUpdate, PasswordUpdate, ProfileUpdate
from src.repositories import setting_repository, user_repository


def profile(user: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": "developer",
        "joinedAt": str(user.get("created_at") or ""),
        "lastLoginAt": None,
    }


def notification_row(user_id: int) -> dict[str, bool]:
    row = setting_repository.get_notifications(user_id)
    if not row:
        setting_repository.ensure_notifications(user_id)
        row = {
            "analysis_done": True,
            "issue_detected": True,
            "product_news": True,
            "weekly_report": False,
        }
    return {
        "analysisDone": bool(row["analysis_done"]),
        "issueDetected": bool(row["issue_detected"]),
        "productNews": bool(row["product_news"]),
        "weeklyReport": bool(row["weekly_report"]),
    }


def get_settings(user: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {
        "settings": {
            "profile": profile(user),
            "integrations": [
                {"key": "github", "title": "GitHub", "value": "not connected", "status": "available"},
                {"key": "upload", "title": "Git upload", "value": "enabled", "status": "available"},
                {"key": "notice", "title": "Notifications", "value": "enabled", "status": "active"},
            ],
            "notifications": notification_row(int(user["id"])),
        }
    }


def update_profile(payload: ProfileUpdate, user: dict[str, Any]) -> dict[str, dict[str, Any]]:
    next_name = payload.name or user["name"]
    next_email = payload.email or user["email"]
    if next_email != user["email"] and user_repository.email_exists_for_other_user(next_email, int(user["id"])):
        raise HTTPException(status.HTTP_409_CONFLICT, detail="Email already exists")
    user_repository.update_profile(int(user["id"]), next_name, next_email)
    updated = user_repository.find_by_id(int(user["id"])) or user
    return {"user": profile(updated)}


def update_password(payload: PasswordUpdate, user: dict[str, Any]) -> dict[str, bool]:
    current_password = payload.currentPassword or payload.current_password
    new_password = payload.newPassword or payload.new_password or payload.password
    if not current_password or not new_password:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Current and new password are required")
    password_hash = user_repository.get_password_hash(int(user["id"]))
    if password_hash is None or not verify_password(current_password, password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid current password")
    user_repository.update_password_hash(int(user["id"]), hash_password(new_password))
    return {"ok": True}


def update_notifications(payload: NotificationUpdate, user: dict[str, Any]) -> dict[str, dict[str, bool]]:
    setting_repository.update_notifications(
        int(user["id"]),
        payload.analysisDone,
        payload.issueDetected,
        payload.productNews,
        payload.weeklyReport,
    )
    return {"notifications": notification_row(int(user["id"]))}


def unlink_integration(key: str, user: dict[str, Any]) -> dict[str, bool | str]:
    return {"ok": True, "key": key}

