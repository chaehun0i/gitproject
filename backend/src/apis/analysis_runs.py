from __future__ import annotations

from typing import Any

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, UploadFile, status

from src.models.analysis_runs import AnalysisRunCreate
from src.services.analysis_run_service import (
    create_analysis_run as create_analysis_run_service,
    create_pending_upload_run as create_pending_upload_run_service,
    get_analysis_detail as get_analysis_detail_service,
    get_analysis_progress as get_analysis_progress_service,
    get_analysis_summary as get_analysis_summary_service,
    get_commit_messages as get_commit_messages_service,
    list_analysis_runs as list_analysis_runs_service,
    run_analysis_pipeline_background as run_analysis_pipeline_background_service,
)
from src.services.auth_service import get_authenticated_user

analysis_runs_router = APIRouter(tags=["analysis"])


@analysis_runs_router.post("", status_code=status.HTTP_202_ACCEPTED)
async def create_analysis_run(
    payload: AnalysisRunCreate,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    return await create_analysis_run_service(payload, user)


@analysis_runs_router.post("/upload", status_code=status.HTTP_202_ACCEPTED)
async def upload_analysis_artifacts(
    background_tasks: BackgroundTasks,
    type: str | None = Form(default="upload"),
    repository: str | None = Form(default=None),
    branch: str | None = Form(default="main"),
    range: str | None = Form(default=None),
    projectName: str | None = Form(default=None),
    options: str | None = Form(default="[]"),
    files: list[UploadFile] | None = File(default=None),
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    response = await create_pending_upload_run_service(type, repository, branch, range, projectName, options, files, user)
    run_id = response["analysisRun"]["id"]
    background_tasks.add_task(
        run_analysis_pipeline_background_service,
        int(run_id),
        int(user["id"]),
    )
    return response


@analysis_runs_router.get("")
async def list_analysis_runs(user: dict[str, Any] = Depends(get_authenticated_user)) -> dict[str, list[dict[str, Any]]]:
    return list_analysis_runs_service(user)


@analysis_runs_router.get("/{run_id}/progress")
async def get_analysis_progress(
    run_id: str,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    return get_analysis_progress_service(run_id, user)


@analysis_runs_router.get("/{run_id}/summary")
async def get_analysis_summary(
    run_id: str,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    return get_analysis_summary_service(run_id, user)


@analysis_runs_router.get("/{run_id}/detail")
async def get_analysis_detail(
    run_id: str,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    return get_analysis_detail_service(run_id, user)


@analysis_runs_router.get("/{run_id}/commit-messages")
async def get_commit_messages(
    run_id: str,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    return get_commit_messages_service(run_id, user)
