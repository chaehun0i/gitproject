from __future__ import annotations

import json
from typing import Any

from redis.asyncio import Redis

from core.settings import settings


def redis_client() -> Redis:
    return Redis.from_url(settings.redis_url, decode_responses=True)


async def set_session(uuid: str, user: dict[str, Any], ttl_seconds: int) -> None:
    redis = redis_client()
    try:
        await redis.setex(f"session:{uuid}", ttl_seconds, json.dumps(user))
    finally:
        await redis.aclose()


async def get_session(uuid: str) -> dict[str, Any] | None:
    redis = redis_client()
    try:
        value = await redis.get(f"session:{uuid}")
    finally:
        await redis.aclose()

    return json.loads(value) if value else None


async def delete_session(uuid: str) -> None:
    redis = redis_client()
    try:
        await redis.delete(f"session:{uuid}")
    finally:
        await redis.aclose()
