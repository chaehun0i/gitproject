from __future__ import annotations

import os


def get_service_config() -> dict[str, str]:
    return {
        "postgres": os.getenv("DATABASE_URL", "postgresql://app:***@postgres:5432/app"),
        "mariadb": os.getenv("MARIADB_URL", "mysql+pymysql://app:***@mariadb:3306/app"),
        "redis": os.getenv("REDIS_URL", "redis://redis:6379/0"),
        "kafka": os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092"),
        "ollama": os.getenv("OLLAMA_BASE_URL", "http://ollama:11434"),
    }
