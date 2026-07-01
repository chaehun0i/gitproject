from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class AuthRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=4)
    name: str | None = None


class RefreshRequest(BaseModel):
    refreshToken: str


class LogoutRequest(BaseModel):
    refreshToken: str | None = None


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: str = "developer"
    joinedAt: str | None = None
    lastLoginAt: str | None = None


class AuthResponse(BaseModel):
    user: UserResponse
    accessToken: str
    refreshToken: str
