from __future__ import annotations

from typing import Any

import asyncpg
from fastapi import HTTPException, Response, status

from core.security import create_session_id, verify_password
from core.settings import settings
from utils.db import create_user, find_user_by_email
from utils.rediscl import delete_session, get_session, set_session
from utils.tokenset import create_login_token, read_login_token


def user_payload(user: asyncpg.Record) -> dict[str, Any]:
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
    }


async def authenticate_or_create_user(
    connection: asyncpg.Connection,
    email: str,
    password: str,
    name: str | None,
) -> asyncpg.Record:
    user = await find_user_by_email(connection, email)
    if user is None:
        return await create_user(connection, email, password, name)

    if not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return user


async def register_user(
    connection: asyncpg.Connection,
    email: str,
    password: str,
    name: str | None,
) -> asyncpg.Record:
    user = await find_user_by_email(connection, email)
    if user is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

    return await create_user(connection, email, password, name)


async def issue_login_cookie(response: Response, user: asyncpg.Record) -> None:
    ttl_seconds = settings.session_ttl_seconds
    uuid = create_session_id()
    token = create_login_token(uuid, user["id"])

    await set_session(uuid, user_payload(user), ttl_seconds)

    response.set_cookie(
        key=settings.auth_cookie_name,
        value=token,
        max_age=ttl_seconds,
        httponly=True,
        secure=settings.secure_cookie,
        samesite="lax",
        path="/",
    )


async def get_current_user(token: str | None) -> dict[str, Any]:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        payload = read_login_token(token)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session") from exc

    user = await get_session(payload["sid"])
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")

    return user


async def clear_login_cookie(response: Response, token: str | None) -> None:
    if token:
        try:
            payload = read_login_token(token)
            await delete_session(payload["sid"])
        except Exception:
            pass

    response.delete_cookie(key=settings.auth_cookie_name, path="/")
