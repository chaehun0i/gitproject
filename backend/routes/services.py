from fastapi import APIRouter

from core.settings import settings

router = APIRouter(tags=["system"])


@router.get("/services")
def services() -> dict[str, dict[str, str]]:
    return {
        "services": {
            "postgres": settings.database_url,
            "mariadb": settings.mariadb_url,
            "redis": settings.redis_url,
            "kafka": settings.kafka_bootstrap_servers,
            "ollama": settings.ollama_base_url,
        },
    }
