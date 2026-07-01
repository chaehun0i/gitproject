from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    host_ip: str
    frontend_origin: str

    maria_db_user: str
    maria_db_password: str
    maria_db_host: str
    maria_db_database: str
    maria_db_port: int = 3306

    pg_db_user: str
    pg_db_password: str
    pg_db_host: str
    pg_db_database: str
    pg_db_port: int = 5432

    redis_url: str
    kafka_bootstrap_servers: str
    ollama_base_url: str

    jwe_secret: str
    access_token_ttl_seconds: int = 900
    refresh_token_ttl_seconds: int = 1209600


settings = Settings()
