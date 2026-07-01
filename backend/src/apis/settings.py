from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from core.security import hash_password, verify_password
from src.apis.auth import get_authenticated_user
from utils.db import find_one, save

settings_router = APIRouter(tags=["settings"])


class ProfileUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    email: EmailStr | None = None


class PasswordUpdate(BaseModel):
    currentPassword: str | None = None
    current_password: str | None = None
    newPassword: str | None = None
    new_password: str | None = None
    password: str | None = None


class NotificationUpdate(BaseModel):
    analysisDone: bool = True
    issueDetected: bool = True
    productNews: bool = True
    weeklyReport: bool = False


def _profile(user: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": "developer",
        "joinedAt": str(user.get("created_at") or ""),
        "lastLoginAt": None,
    }


def _notification_row(user_id: int) -> dict[str, bool]:
    row = find_one(
        """
        SELECT analysis_done, issue_detected, product_news, weekly_report
        FROM user_notification_settings
        WHERE user_id = %s
        """,
        (user_id,),
    )
    if not row:
        save(
            "INSERT IGNORE INTO user_notification_settings (user_id) VALUES (%s)",
            (user_id,),
        )
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


@settings_router.get("")
async def get_settings(user: dict[str, Any] = Depends(get_authenticated_user)) -> dict[str, dict[str, Any]]:
    settings = {
        "profile": _profile(user),
        "integrations": [
            {"key": "github", "title": "GitHub", "value": "not connected", "status": "available"},
            {"key": "upload", "title": "Git upload", "value": "enabled", "status": "available"},
            {"key": "notice", "title": "Notifications", "value": "enabled", "status": "active"},
        ],
        "notifications": _notification_row(int(user["id"])),
    }
    return {"settings": settings}


@settings_router.patch("/profile")
async def update_profile(
    payload: ProfileUpdate,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    next_name = payload.name or user["name"]
    next_email = payload.email or user["email"]
    if next_email != user["email"]:
        existing = find_one(
            "SELECT id FROM users WHERE email = %s AND id <> %s",
            (next_email, user["id"]),
        )
        if existing:
            raise HTTPException(status.HTTP_409_CONFLICT, detail="Email already exists")
    save(
        "UPDATE users SET name = %s, email = %s WHERE id = %s",
        (next_name, next_email, user["id"]),
    )
    updated = find_one(
        "SELECT id, email, name, created_at FROM users WHERE id = %s",
        (user["id"],),
    )
    return {"user": _profile(updated or user)}


@settings_router.patch("/password")
async def update_password(
    payload: PasswordUpdate,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, bool]:
    current_password = payload.currentPassword or payload.current_password
    new_password = payload.newPassword or payload.new_password or payload.password
    if not current_password or not new_password:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Current and new password are required")
    row = find_one("SELECT password_hash FROM users WHERE id = %s", (user["id"],))
    if row is None or not verify_password(current_password, row["password_hash"]):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid current password")
    save(
        "UPDATE users SET password_hash = %s WHERE id = %s",
        (hash_password(new_password), user["id"]),
    )
    return {"ok": True}


@settings_router.patch("/notifications")
async def update_notifications(
    payload: NotificationUpdate,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, bool]]:
    save(
        """
        INSERT INTO user_notification_settings
            (user_id, analysis_done, issue_detected, product_news, weekly_report)
        VALUES (%s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            analysis_done = VALUES(analysis_done),
            issue_detected = VALUES(issue_detected),
            product_news = VALUES(product_news),
            weekly_report = VALUES(weekly_report)
        """,
        (
            user["id"],
            payload.analysisDone,
            payload.issueDetected,
            payload.productNews,
            payload.weeklyReport,
        ),
    )
    return {"notifications": _notification_row(int(user["id"]))}


@settings_router.delete("/integrations/{key}")
async def unlink_integration(
    key: str,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, bool | str]:
    return {"ok": True, "key": key}
