from __future__ import annotations

from collections.abc import Iterable

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.settings import settings
from routes import analysis_runs, auth, health, projects, services


def route_set() -> Iterable[APIRouter]:
    return (
        health.router,
        auth.router,
        services.router,
        projects.router,
        analysis_runs.router,
    )


def register_routers(app: FastAPI) -> None:
    api_router = APIRouter(prefix="/api")

    for router in route_set():
        api_router.include_router(router)

    app.include_router(api_router)


def run() -> FastAPI:
    app = FastAPI(title="CommitLens API", version="0.1.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_origin, settings.host_ip],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    register_routers(app)
    return app
