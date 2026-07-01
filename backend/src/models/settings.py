from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


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
