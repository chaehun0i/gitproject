from __future__ import annotations

from datetime import datetime
from typing import Any

from utils.db import add_key, find_one, save


def create_session(user_id: int, jti: str, token_hash: str, expires_at: datetime) -> int:
    return add_key(
        """
        INSERT INTO refresh_sessions (user_id, jti, refresh_token_hash, expires_at)
        VALUES (%s, %s, %s, %s)
        """,
        (user_id, jti, token_hash, expires_at),
    )


def find_by_jti(jti: str) -> dict[str, Any] | None:
    return find_one(
        """
        SELECT rs.id AS refresh_session_id,
               rs.user_id,
               rs.jti,
               rs.refresh_token_hash,
               rs.expires_at,
               rs.revoked_at,
               u.id,
               u.email,
               u.name,
               u.created_at
        FROM refresh_sessions rs
        INNER JOIN users u ON u.id = rs.user_id
        WHERE rs.jti = %s
        """,
        (jti,),
    )


def revoke_by_jti(jti: str) -> None:
    save(
        "UPDATE refresh_sessions SET revoked_at = UTC_TIMESTAMP() WHERE jti = %s AND revoked_at IS NULL",
        (jti,),
    )

