from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Cookie, Response
from pydantic import BaseModel, EmailStr, Field

from core.settings import settings
from utils.auth import (
    authenticate_or_create_user,
    clear_login_cookie,
    get_current_user,
    issue_login_cookie,
    register_user,
)
from utils.db import connect_db

router = APIRouter(prefix="/auth", tags=["auth"])


class AuthRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=4)
    name: str | None = None


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str


class AuthResponse(BaseModel):
    user: UserResponse


def to_auth_response(user: dict | object) -> AuthResponse:
    return AuthResponse(
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
        ),
    )


@router.post("/login", response_model=AuthResponse)
async def login(payload: AuthRequest, response: Response) -> AuthResponse:
    connection = await connect_db()
    try:
        user = await authenticate_or_create_user(
            connection,
            payload.email,
            payload.password,
            payload.name,
        )
        await issue_login_cookie(response, user)
        return to_auth_response(user)
    finally:
        await connection.close()


@router.post("/signup", response_model=AuthResponse)
async def signup(payload: AuthRequest, response: Response) -> AuthResponse:
    connection = await connect_db()
    try:
        user = await register_user(connection, payload.email, payload.password, payload.name)
        await issue_login_cookie(response, user)
        return to_auth_response(user)
    finally:
        await connection.close()


@router.get("/me", response_model=AuthResponse)
async def me(
    token: Annotated[str | None, Cookie(alias=settings.auth_cookie_name)] = None,
) -> AuthResponse:
    user = await get_current_user(token)
    return to_auth_response(user)


@router.post("/logout")
async def logout(
    response: Response,
    token: Annotated[str | None, Cookie(alias=settings.auth_cookie_name)] = None,
) -> dict[str, bool]:
    await clear_login_cookie(response, token)
    return {"ok": True}
