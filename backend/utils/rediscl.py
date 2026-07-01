from __future__ import annotations

from typing import Any

import json
from redis.asyncio import Redis

from core.settings import settings


def redis_client() -> Redis:
    return Redis.from_url(settings.redis_url, decode_responses=True)


def refresh_session_key(jti: str) -> str:
    return f"auth:refresh:{jti}"


async def set_refresh_session(jti: str, session: dict[str, Any], ttl_seconds: int) -> None:
    redis = redis_client()
    try:
        await redis.setex(refresh_session_key(jti), ttl_seconds, json.dumps(session))
    finally:
        await redis.aclose()


async def get_refresh_session(jti: str) -> dict[str, Any] | None:
    redis = redis_client()
    try:
        value = await redis.get(refresh_session_key(jti))
    finally:
        await redis.aclose()

    return json.loads(value) if value else None


async def delete_refresh_session(jti: str) -> None:
    redis = redis_client()
    try:
        await redis.delete(refresh_session_key(jti))
    finally:
        await redis.aclose()
