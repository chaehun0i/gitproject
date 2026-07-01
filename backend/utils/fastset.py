from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.settings import settings
from routes import health, services
from src.apis.analysis_runs import analysis_runs_router
from src.apis.auth import auth_router
from src.apis.projects import projects_router
from src.apis.settings import settings_router
from src.apis.workspace import workspace_router
from utils.schema import ensure_schema


def register_routers(app: FastAPI) -> None:
    app.include_router(health.router)
    app.include_router(services.router)
    app.include_router(auth_router, prefix="/auth")
    app.include_router(projects_router, prefix="/projects")
    app.include_router(analysis_runs_router, prefix="/analysis/runs")
    app.include_router(workspace_router, prefix="/workspace")
    app.include_router(settings_router, prefix="/settings")


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

    @app.on_event("startup")
    def ensure_database_schema() -> None:
        ensure_schema()

    return app
