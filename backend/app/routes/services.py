from fastapi import APIRouter

from app.core.config import get_service_config

router = APIRouter(tags=["system"])


@router.get("/services")
def services() -> dict[str, dict[str, str]]:
    return {"services": get_service_config()}
