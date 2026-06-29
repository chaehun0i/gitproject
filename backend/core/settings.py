from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = "postgresql://app:app_password@localhost:5432/app"
    redis_url: str = "redis://localhost:6379/0"
    mariadb_url: str = "mysql+pymysql://app:app_password@localhost:3306/app"
    kafka_bootstrap_servers: str = "localhost:9094"
    ollama_base_url: str = "http://localhost:11434"
    frontend_origin: str = "http://localhost:5173"

    auth_cookie_name: str = "commitlens_session"
    jwe_secret: str = "dev-only-change-me-commitlens-jwe-secret"
    session_ttl_seconds: int = 86400
    secure_cookie: bool = False


settings = Settings()
