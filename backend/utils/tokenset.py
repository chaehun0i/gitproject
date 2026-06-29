from __future__ import annotations

import time
from typing import Any

from core.security import decrypt_session, encrypt_session, session_payload
from core.settings import settings


def create_login_token(uuid: str, user_id: int) -> str:
    payload = session_payload(uuid, user_id, settings.session_ttl_seconds)
    return encrypt_session(payload, settings.jwe_secret)


def read_login_token(token: str) -> dict[str, Any]:
    payload = decrypt_session(token, settings.jwe_secret)

    if int(payload.get("exp", 0)) < int(time.time()):
        raise ValueError("Session expired")

    return payload
