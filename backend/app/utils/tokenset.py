from __future__ import annotations

import time
from typing import Any

from app.core.config import get_auth_config
from app.core.security import decrypt_session, encrypt_session, session_payload


def create_login_token(uuid: str, user_id: int) -> str:
    auth_config = get_auth_config()
    payload = session_payload(uuid, user_id, int(auth_config["session_ttl_seconds"]))
    return encrypt_session(payload, str(auth_config["jwe_secret"]))


def read_login_token(token: str) -> dict[str, Any]:
    auth_config = get_auth_config()
    payload = decrypt_session(token, str(auth_config["jwe_secret"]))

    if int(payload.get("exp", 0)) < int(time.time()):
        raise ValueError("Session expired")

    return payload
