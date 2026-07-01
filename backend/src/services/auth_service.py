from __future__ import annotations

import hmac
import time
from datetime import UTC, datetime, timedelta
from typing import Annotated, Any

from fastapi import Header, HTTPException, status

from core.security import create_session_id, decrypt_session, encrypt_session, hash_password, hash_token, verify_password
from core.settings import settings
from src.models.auth import AuthRequest, AuthResponse, LogoutRequest, RefreshRequest, UserResponse
from src.repositories import refresh_session_repository, user_repository
from utils.rediscl import delete_refresh_session, get_refresh_session, set_refresh_session


def utc_now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def _expires_after(seconds: int) -> datetime:
    return utc_now() + timedelta(seconds=seconds)


def _timestamp(value: datetime) -> int:
    return int(value.replace(tzinfo=UTC).timestamp())


def format_datetime(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.isoformat()
    return str(value)


def user_response(user: dict[str, Any]) -> UserResponse:
    return UserResponse(
        id=int(user["id"]),
        email=user["email"],
        name=user["name"],
        joinedAt=format_datetime(user.get("created_at")),
        lastLoginAt=format_datetime(user.get("last_login_at")),
    )


def _create_token(token_type: str, user_id: int, jti: str, expires_at: datetime, refresh_jti: str | None = None) -> str:
    payload: dict[str, Any] = {
        "typ": token_type,
        "sub": str(user_id),
        "jti": jti,
        "iat": int(time.time()),
        "exp": _timestamp(expires_at),
    }
    if refresh_jti:
        payload["rjti"] = refresh_jti
    return encrypt_session(payload, settings.jwe_secret)


def read_token(token: str, expected_type: str | None = None) -> dict[str, Any]:
    try:
        payload = decrypt_session(token, settings.jwe_secret)
    except Exception as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc
    if expected_type and payload.get("typ") != expected_type:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    if int(payload.get("exp", 0)) < int(time.time()):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    return payload


def bearer_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None
    return token


def load_user(user_id: int) -> dict[str, Any]:
    user = user_repository.find_by_id(user_id)
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


async def get_authenticated_user(authorization: Annotated[str | None, Header()] = None) -> dict[str, Any]:
    token = bearer_token(authorization)
    if token is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Missing access token")
    payload = read_token(token, "access")
    return load_user(int(payload["sub"]))


async def _issue_token_pair(user: dict[str, Any]) -> AuthResponse:
    user_id = int(user["id"])
    refresh_jti = create_session_id()
    access_jti = create_session_id()
    access_expires_at = _expires_after(settings.access_token_ttl_seconds)
    refresh_expires_at = _expires_after(settings.refresh_token_ttl_seconds)

    access_token = _create_token("access", user_id, access_jti, access_expires_at, refresh_jti)
    refresh_token = _create_token("refresh", user_id, refresh_jti, refresh_expires_at)

    refresh_session_repository.create_session(user_id, refresh_jti, hash_token(refresh_token), refresh_expires_at)
    await set_refresh_session(refresh_jti, {"user_id": user_id}, settings.refresh_token_ttl_seconds)

    return AuthResponse(user=user_response(user), accessToken=access_token, refreshToken=refresh_token)


async def revoke_refresh_session(jti: str) -> None:
    refresh_session_repository.revoke_by_jti(jti)
    await delete_refresh_session(jti)


async def signup_user(payload: AuthRequest) -> AuthResponse:
    if user_repository.find_by_email(payload.email):
        raise HTTPException(status.HTTP_409_CONFLICT, detail="Email already exists")
    user_id = user_repository.create_user(
        payload.email,
        hash_password(payload.password),
        payload.name or payload.email.split("@")[0],
    )
    return await _issue_token_pair(load_user(user_id))


async def login_user(payload: AuthRequest) -> AuthResponse:
    user = user_repository.find_by_email(payload.email)
    if user is None or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return await _issue_token_pair(user)


async def refresh_token_pair(payload: RefreshRequest) -> AuthResponse:
    token_payload = read_token(payload.refreshToken, "refresh")
    refresh_jti = token_payload["jti"]
    token_hash = hash_token(payload.refreshToken)

    redis_session = await get_refresh_session(refresh_jti)
    if redis_session is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Refresh session expired")

    row = refresh_session_repository.find_by_jti(refresh_jti)
    if row is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Refresh session not found")
    if row["revoked_at"] is not None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Refresh session revoked")
    if row["expires_at"] < utc_now():
        await revoke_refresh_session(refresh_jti)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Refresh session expired")
    if not hmac.compare_digest(row["refresh_token_hash"], token_hash):
        await revoke_refresh_session(refresh_jti)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Refresh token mismatch")

    await revoke_refresh_session(refresh_jti)
    return await _issue_token_pair(row)


async def logout_user(payload: LogoutRequest | None, authorization: str | None) -> dict[str, bool]:
    refresh_jti: str | None = None
    if payload and payload.refreshToken:
        try:
            refresh_jti = read_token(payload.refreshToken, "refresh")["jti"]
        except HTTPException:
            refresh_jti = None
    if refresh_jti is None:
        access_token = bearer_token(authorization)
        if access_token:
            try:
                refresh_jti = read_token(access_token, "access").get("rjti")
            except HTTPException:
                refresh_jti = None
    if refresh_jti:
        await revoke_refresh_session(refresh_jti)
    return {"ok": True}

