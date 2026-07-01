from __future__ import annotations

from typing import Any

from utils.db import add_key, find_one, save

def find_by_id(user_id: int) -> dict[str, Any] | None:
    return find_one(
        "SELECT id, email, name, created_at FROM users WHERE id = %s",
        (user_id,),
    )


def find_by_email(email: str) -> dict[str, Any] | None:
    return find_one(
        "SELECT id, email, name, password_hash, created_at FROM users WHERE email = %s",
        (email,),
    )


def email_exists_for_other_user(email: str, user_id: int) -> bool:
    row = find_one(
        "SELECT id FROM users WHERE email = %s AND id <> %s",
        (email, user_id),
    )
    return row is not None


def create_user(email: str, password_hash: str, name: str) -> int:
    return add_key(
        """
        INSERT INTO users (email, password_hash, name)
        VALUES (%s, %s, %s)
        """,
        (email, password_hash, name),
    )


def update_profile(user_id: int, name: str, email: str) -> None:
    save(
        "UPDATE users SET name = %s, email = %s WHERE id = %s",
        (name, email, user_id),
    )


def get_password_hash(user_id: int) -> str | None:
    row = find_one(
        "SELECT password_hash FROM users WHERE id = %s",
        (user_id,),
    )
    return row.get("password_hash") if row else None


def update_password_hash(user_id: int, password_hash: str) -> None:
    save(
        "UPDATE users SET password_hash = %s WHERE id = %s",
        (password_hash, user_id),
    )
