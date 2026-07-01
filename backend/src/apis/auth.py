from __future__ import annotations

from typing import Annotated, Any

from fastapi import APIRouter, Depends, Header

from src.models.auth import AuthRequest, AuthResponse, LogoutRequest, RefreshRequest, UserResponse
from src.services.auth_service import (
    get_authenticated_user,
    login_user,
    logout_user,
    refresh_token_pair,
    signup_user,
    user_response,
)

auth_router = APIRouter(tags=["auth"])


@auth_router.post("/signup", response_model=AuthResponse)
async def signup(payload: AuthRequest) -> AuthResponse:
    return await signup_user(payload)


@auth_router.post("/login", response_model=AuthResponse)
async def login(payload: AuthRequest) -> AuthResponse:
    return await login_user(payload)


@auth_router.get("/me")
async def me(user: dict[str, Any] = Depends(get_authenticated_user)) -> dict[str, UserResponse]:
    return {"user": user_response(user)}


@auth_router.post("/refresh", response_model=AuthResponse)
async def refresh(payload: RefreshRequest) -> AuthResponse:
    return await refresh_token_pair(payload)


@auth_router.post("/logout")
async def logout(
    payload: LogoutRequest | None = None,
    authorization: Annotated[str | None, Header()] = None,
) -> dict[str, bool]:
    return await logout_user(payload, authorization)

