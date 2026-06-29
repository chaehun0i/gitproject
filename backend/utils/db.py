from __future__ import annotations

import asyncpg

from core.security import hash_password
from core.settings import settings


async def connect_db() -> asyncpg.Connection:
    return await asyncpg.connect(settings.database_url)


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
