from __future__ import annotations

from typing import Any

import mariadb

from core.security import hash_password
from core.settings import settings


def conn_params() -> dict[str, Any]:
    return {
        "user": settings.maria_db_user,
        "password": settings.maria_db_password,
        "host": settings.maria_db_host,
        "database": settings.maria_db_database,
        "port": settings.maria_db_port,
    }


def get_conn() -> mariadb.Connection:
    return mariadb.connect(**conn_params())


def find_one(sql: str, params: tuple[Any, ...] | None = None) -> dict[str, Any] | None:
    conn = get_conn()
    try:
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute(sql, params)
            row = cursor.fetchone()
        conn.commit()
        return row
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def find_all(sql: str, params: tuple[Any, ...] | None = None) -> list[dict[str, Any]]:
    conn = get_conn()
    try:
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute(sql, params)
            rows = cursor.fetchall()
        conn.commit()
        return list(rows)
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def save(sql: str, params: tuple[Any, ...] | None = None) -> bool:
    conn = get_conn()
    try:
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute(sql, params)
        conn.commit()
        return True
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def add_key(sql: str, params: tuple[Any, ...] | None = None) -> int:
    conn = get_conn()
    try:
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute(sql, params)
            cursor.execute("SELECT LAST_INSERT_ID() AS id")
            row = cursor.fetchone()
        conn.commit()
        return int(row["id"])
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def find_user_by_email(email: str) -> dict[str, Any] | None:
    return find_one(
        "SELECT id, email, name, password_hash FROM users WHERE email = %s",
        (email,),
    )


def create_user(email: str, password: str, name: str | None) -> dict[str, Any]:
    user_id = add_key(
        """
        INSERT INTO users (email, password_hash, name)
        VALUES (%s, %s, %s)
        """,
        (email, hash_password(password), name or email.split("@")[0]),
    )
    user = find_one(
        "SELECT id, email, name, password_hash FROM users WHERE id = %s",
        (user_id,),
    )
    if user is None:
        raise RuntimeError("Created user could not be loaded")
    return user


# 참고 프로젝트와 이름을 맞춘 별칭입니다.
getConn = get_conn
findOne = find_one
findAll = find_all
addKey = add_key
