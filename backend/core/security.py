from __future__ import annotations

import base64
import hashlib
import hmac
import json
import secrets
import uuid
from datetime import UTC, datetime, timedelta
from typing import Any

from jwcrypto import jwk, jwe


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 120_000)
    return f"pbkdf2_sha256${base64.urlsafe_b64encode(salt).decode()}${base64.urlsafe_b64encode(digest).decode()}"


def verify_password(password: str, password_hash: str) -> bool:
    try:
        algorithm, salt_value, digest_value = password_hash.split("$", 2)
        if algorithm != "pbkdf2_sha256":
            return False
        salt = base64.urlsafe_b64decode(salt_value.encode())
        expected = base64.urlsafe_b64decode(digest_value.encode())
        actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 120_000)
        return hmac.compare_digest(actual, expected)
    except ValueError:
        return False


def create_session_id() -> str:
    return str(uuid.uuid4())


def _jwe_key(secret: str) -> jwk.JWK:
    digest = hashlib.sha256(secret.encode()).digest()
    key = base64.urlsafe_b64encode(digest).decode().rstrip("=")
    return jwk.JWK(kty="oct", k=key)


def encrypt_session(payload: dict[str, Any], secret: str) -> str:
    token = jwe.JWE(
        json.dumps(payload).encode(),
        protected={"alg": "dir", "enc": "A256GCM"},
    )
    token.add_recipient(_jwe_key(secret))
    return token.serialize(compact=True)


def decrypt_session(token_value: str, secret: str) -> dict[str, Any]:
    token = jwe.JWE()
    token.deserialize(token_value, key=_jwe_key(secret))
    return json.loads(token.payload.decode())


def session_payload(session_id: str, user_id: int, ttl_seconds: int) -> dict[str, Any]:
    expires_at = datetime.now(UTC) + timedelta(seconds=ttl_seconds)
    return {
        "sid": session_id,
        "sub": str(user_id),
        "exp": int(expires_at.timestamp()),
    }
