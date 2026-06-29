from __future__ import annotations

import asyncpg

from app.core.config import get_service_config
from app.core.security import hash_password


async def connect_db() -> asyncpg.Connection:
    config = get_service_config()
    return await asyncpg.connect(config["postgres"])


async def find_user_by_email(connection: asyncpg.Connection, email: str) -> asyncpg.Record | None:
    return await connection.fetchrow(
        "SELECT id, email, name, password_hash FROM users WHERE email = $1",
        email,
    )


async def create_user(
    connection: asyncpg.Connection,
    email: str,
    password: str,
    name: str | None,
) -> asyncpg.Record:
    return await connection.fetchrow(
        """
        INSERT INTO users (email, password_hash, name)
        VALUES ($1, $2, $3)
        RETURNING id, email, name, password_hash
        """,
        email,
        hash_password(password),
        name or email.split("@")[0],
    )
