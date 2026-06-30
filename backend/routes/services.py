from fastapi import APIRouter

from core.settings import settings

router = APIRouter(tags=["system"])


@router.get("/services")
def services() -> dict[str, dict[str, str]]:
    return {
        "services": {
            "mariadb": (
                f"{settings.maria_db_user}@{settings.maria_db_host}:"
                f"{settings.maria_db_port}/{settings.maria_db_database}"
            ),
            "redis": settings.redis_url,
            "kafka": settings.kafka_bootstrap_servers,
            "ollama": settings.ollama_base_url,
        },
    }
