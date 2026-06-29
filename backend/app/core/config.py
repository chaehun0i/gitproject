from __future__ import annotations

import os


def get_service_config() -> dict[str, str]:
    return {
        "postgres": os.getenv("DATABASE_URL", "postgresql://app:app_password@localhost:5432/app"),
        "mariadb": os.getenv("MARIADB_URL", "mysql+pymysql://app:***@mariadb:3306/app"),
        "redis": os.getenv("REDIS_URL", "redis://localhost:6379/0"),
        "kafka": os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092"),
        "ollama": os.getenv("OLLAMA_BASE_URL", "http://ollama:11434"),
    }


def get_auth_config() -> dict[str, str | int | bool]:
    return {
        "cookie_name": os.getenv("AUTH_COOKIE_NAME", "commitlens_session"),
        "jwe_secret": os.getenv("JWE_SECRET", "dev-only-change-me-commitlens-jwe-secret"),
        "session_ttl_seconds": int(os.getenv("SESSION_TTL_SECONDS", "86400")),
        "secure_cookie": os.getenv("SECURE_COOKIE", "false").lower() == "true",
    }
