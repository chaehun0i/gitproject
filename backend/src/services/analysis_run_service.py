from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from fastapi import HTTPException, UploadFile, status

from src.ai.risk_detector import detect_risks
from src.ai.summary_generator import generate_commit_messages, generate_summary
from src.domains.analysis_status import AI_GENERATING, ANALYZING, COMPLETED, FAILED, PARSING, status_label
from src.models.analysis_runs import AnalysisRunCreate
from src.parsers.diff_parser import parse_unified_diff
from src.parsers.zip_parser import parse_zip_file
from src.repositories import (
    ai_output_repository,
    analysis_log_repository,
    analysis_run_repository,
    changed_file_repository,
    project_repository,
    risk_finding_repository,
    uploaded_file_repository,
)
from src.services.project_service import format_datetime, get_owned_project
from src.services.websocket_service import broadcast_analysis_progress
from src.storage.local_storage import save_upload_file


def _source_type(input_type: str | None) -> str:
    if input_type == "github":
        return "github"
    if input_type == "upload":
        return "diff_upload"
    return input_type or "manual_text"


def _split_repository(repository: str | None, project_name: str | None) -> tuple[str, str, str]:
    if repository and "/" in repository:
        owner, repo = repository.split("/", 1)
        return owner, repo, repo
    name = project_name or repository or "untitled-analysis"
    return "local", name, name


def _ensure_project(payload: AnalysisRunCreate, user_id: int) -> dict[str, Any]:
    target_project_id = payload.projectId or payload.project_id
    if target_project_id:
        return get_owned_project(target_project_id, user_id)

    owner, repo, default_name = _split_repository(payload.repository, payload.projectName)
    name = payload.projectName or default_name
    project = project_repository.find_by_identity(user_id, name, owner, repo)
    if project:
        return project

    project_id = project_repository.create_minimal_project(
        user_id,
        name,
        owner,
        repo,
        "GitHub" if payload.type == "github" else "git_upload",
        payload.branch or "main",
    )
    return get_owned_project(project_id, user_id)


def _run_response(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": row["id"],
        "status": row["status"],
        "repository": row.get("repository"),
        "branch": row.get("branch"),
        "createdAt": format_datetime(row.get("created_at")),
        "projectId": row.get("project_id"),
        "progress": int(row.get("progress") or 0),
    }


def _get_run(run_id: str, user_id: int) -> dict[str, Any]:
    if run_id == "latest":
        run = analysis_run_repository.get_latest_by_user(user_id)
    else:
        run = analysis_run_repository.get_by_id_and_user(int(run_id), user_id)
    if run is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Analysis run not found")
    return run


async def _set_progress(run: dict[str, Any], next_status: str, percent: int, message: str) -> None:
    run_id = int(run["id"])
    user_id = int(run["user_id"])
    analysis_run_repository.update_progress(run_id, user_id, next_status, percent)
    analysis_log_repository.create_log(run_id, message)
    run["status"] = next_status
    run["progress"] = percent
    await broadcast_analysis_progress(
        run_id,
        {
            "type": "analysis.progress",
            "runId": run_id,
            "status": next_status,
            "percent": percent,
            "currentStep": message,
        },
    )


def create_run(payload: AnalysisRunCreate, user: dict[str, Any]) -> dict[str, Any]:
    project = _ensure_project(payload, int(user["id"]))
    repository = payload.repository or f"{project.get('owner')}/{project.get('repo')}"
    run_id = analysis_run_repository.create_run(
        int(project["id"]),
        int(user["id"]),
        _source_type(payload.type),
        payload.title or payload.projectName or project["name"],
        repository,
        payload.branch or project.get("branch") or "main",
        payload.range,
        json.dumps(payload.options, ensure_ascii=False),
    )
    analysis_log_repository.create_log(run_id, "Analysis run created.")
    return _get_run(str(run_id), int(user["id"]))


async def create_analysis_run(payload: AnalysisRunCreate, user: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {"analysisRun": _run_response(create_run(payload, user))}


def _parse_uploaded_artifact(stored: dict[str, Any]) -> list[dict[str, Any]]:
    filename = stored["original_filename"]
    stored_path = stored["stored_path"]
    suffix = Path(filename).suffix.lower()
    if suffix == ".zip":
        return parse_zip_file(stored_path)
    content = Path(stored_path).read_bytes()
    return parse_unified_diff(content, filename)


async def create_pending_upload_run(
    type: str | None,
    repository: str | None,
    branch: str | None,
    range: str | None,
    project_name: str | None,
    options: str | None,
    files: list[UploadFile] | None,
    user: dict[str, Any],
) -> dict[str, dict[str, Any]]:
    try:
        parsed_options = json.loads(options or "[]")
    except json.JSONDecodeError:
        parsed_options = []
    payload = AnalysisRunCreate(
        type=type,
        repository=repository,
        branch=branch,
        range=range,
        projectName=project_name,
        options=parsed_options if isinstance(parsed_options, list) else [],
    )
    run = create_run(payload, user)
    run_id = int(run["id"])
    uploaded_files = files or []

    for file in uploaded_files:
        stored = await save_upload_file(file, run_id)
        uploaded_file_repository.create_uploaded_file(
            run_id,
            stored["original_filename"],
            stored["stored_path"],
            stored["file_type"],
            stored["file_size"],
            stored["checksum"],
        )

    analysis_log_repository.create_log(run_id, f"{len(uploaded_files)} artifact file(s) uploaded.")
    return {"analysisRun": _run_response(run)}


async def upload_analysis_artifacts(
    type: str | None,
    repository: str | None,
    branch: str | None,
    range: str | None,
    project_name: str | None,
    options: str | None,
    files: list[UploadFile] | None,
    user: dict[str, Any],
) -> dict[str, dict[str, Any]]:
    response = await create_pending_upload_run(type, repository, branch, range, project_name, options, files, user)
    run_id = int(response["analysisRun"]["id"])
    await run_analysis_pipeline_background(run_id, int(user["id"]))
    return {"analysisRun": _run_response(_get_run(str(run_id), int(user["id"])))}


async def run_analysis_pipeline_background(run_id: int, user_id: int) -> None:
    run: dict[str, Any] = {"id": run_id, "user_id": user_id, "progress": 0}
    try:
        run = _get_run(str(run_id), user_id)
        uploaded_files = uploaded_file_repository.list_by_run(run_id)

        await _set_progress(run, PARSING, 20, "업로드 파일 파싱 중")
        parsed_files: list[dict[str, Any]] = []
        for stored in uploaded_files:
            parsed_files.extend(_parse_uploaded_artifact(stored))
        if parsed_files:
            changed_file_repository.insert_many(run_id, parsed_files)

        await _set_progress(run, ANALYZING, 50, "변경 파일 위험 요소 분석 중")
        risks = detect_risks(parsed_files)
        if risks:
            risk_finding_repository.insert_many(run_id, risks)

        await _set_progress(run, AI_GENERATING, 80, "AI 요약 및 커밋 메시지 생성 중")
        summary = generate_summary(parsed_files, risks)
        ai_output_repository.create_output(run_id, "change_summary", summary)
        for message in generate_commit_messages(parsed_files, risks):
            ai_output_repository.create_output(
                run_id,
                "commit_message",
                message["text"],
                json.dumps(
                    {"type": message["type"], "scope": message["scope"], "reason": message["reason"]},
                    ensure_ascii=False,
                ),
            )

        analysis_run_repository.mark_completed(run_id, user_id)
        analysis_log_repository.create_log(run_id, "분석 완료")
        run["status"] = COMPLETED
        run["progress"] = 100
        await broadcast_analysis_progress(
            run_id,
            {
                "type": "analysis.progress",
                "runId": run_id,
                "status": COMPLETED,
                "percent": 100,
                "currentStep": "분석 완료",
            },
        )
    except Exception as error:
        analysis_run_repository.mark_failed(run_id, user_id, str(error))
        analysis_log_repository.create_log(run_id, f"분석 실패: {error}")
        await broadcast_analysis_progress(
            run_id,
            {
                "type": "analysis.progress",
                "runId": run_id,
                "status": FAILED,
                "percent": int(run.get("progress") or 0),
                "currentStep": "분석 실패",
            },
        )


def _counter_rows(run_id: int) -> dict[str, int]:
    return {
        "commits": 0,
        "files": changed_file_repository.count_by_run(run_id),
        "risks": risk_finding_repository.count_by_run(run_id),
        "messages": len(ai_output_repository.list_commit_messages(run_id)),
    }


def _history_item(row: dict[str, Any]) -> dict[str, Any]:
    counters = _counter_rows(int(row["id"]))
    return {
        "id": row["id"],
        "project": row.get("project_name") or row.get("title") or row.get("repository") or "analysis",
        "branch": row.get("branch") or "main",
        "source": "GitHub" if row.get("source_type") == "github" else "git_upload",
        "status": status_label(row.get("status")),
        "commits": str(counters["commits"]) if counters["commits"] else "-",
        "files": str(counters["files"]) if counters["files"] else "-",
        "runtime": "-",
        "createdAt": format_datetime(row.get("created_at")),
    }


def list_analysis_runs(user: dict[str, Any]) -> dict[str, list[dict[str, Any]]]:
    history = [_history_item(row) for row in analysis_run_repository.list_by_user(int(user["id"]))]
    return {"history": history, "runs": history}


def get_analysis_progress(run_id: str, user: dict[str, Any]) -> dict[str, dict[str, Any]]:
    run = _get_run(run_id, int(user["id"]))
    percent = int(run.get("progress") or 0)
    current_step = "Queued" if percent == 0 else "Analyzing changes"
    return {
        "progress": {
            "id": run["id"],
            "status": run["status"],
            "progress": percent,
            "percent": percent,
            "activeStep": current_step,
            "currentStep": current_step,
            "logs": analysis_log_repository.list_messages(int(run["id"])),
            "counters": _counter_rows(int(run["id"])),
        }
    }


def get_analysis_summary(run_id: str, user: dict[str, Any]) -> dict[str, dict[str, Any]]:
    run = _get_run(run_id, int(user["id"]))
    counters = _counter_rows(int(run["id"]))
    lines = changed_file_repository.line_totals(int(run["id"]))
    change_types = changed_file_repository.change_type_counts(int(run["id"]))
    summary_text = ai_output_repository.latest_content(int(run["id"]), "change_summary")
    return {
        "summary": {
            "runId": run["id"],
            "status": run["status"],
            "totalFiles": counters["files"],
            "changedFiles": counters["files"],
            "riskCount": counters["risks"],
            "summaryText": summary_text or "Analysis results are being prepared.",
            "metrics": [
                ["Analysis files", str(counters["files"]), "changed_files"],
                ["Risk findings", str(counters["risks"]), "risk_findings"],
                ["Added lines", f"+{lines['additions']}", "additions"],
                ["Deleted lines", f"-{lines['deletions']}", "deletions"],
            ],
            "changeTypes": [{"name": row["name"], "value": int(row["value"])} for row in change_types],
            "activityValues": [counters["files"], counters["risks"], lines["additions"]],
            "reviewPoints": risk_finding_repository.top_review_points(int(run["id"])),
        }
    }


def get_analysis_detail(run_id: str, user: dict[str, Any]) -> dict[str, dict[str, Any]]:
    run = _get_run(run_id, int(user["id"]))
    files = changed_file_repository.list_by_run(int(run["id"]))
    risks = risk_finding_repository.list_by_run(int(run["id"]))
    outputs = ai_output_repository.list_by_run(int(run["id"]))
    first_patch = next((row.get("patch_text") for row in files if row.get("patch_text")), "")
    return {
        "detail": {
            "runId": run["id"],
            "files": [
                [
                    row["file_path"],
                    row.get("language") or "Unknown",
                    row.get("change_type") or "modified",
                    f"+{int(row.get('additions') or 0)}",
                    f"-{int(row.get('deletions') or 0)}",
                    "high" if risks else "low",
                ]
                for row in files
            ],
            "diffLines": [["ctx", line] for line in first_patch.splitlines()[:200]],
            "risks": risks,
            "aiOutputs": outputs,
        }
    }


def get_commit_messages(run_id: str, user: dict[str, Any]) -> dict[str, dict[str, Any]]:
    run = _get_run(run_id, int(user["id"]))
    rows = ai_output_repository.list_commit_messages(int(run["id"]))
    messages = []
    for row in rows:
        try:
            metadata = json.loads(row.get("metadata") or "{}")
        except json.JSONDecodeError:
            metadata = {}
        messages.append(
            {
                "text": row["content"],
                "type": metadata.get("type") or "chore",
                "scope": metadata.get("scope") or "analysis",
                "reason": metadata.get("reason") or "Generated from analysis output.",
            }
        )
    if not messages:
        messages = [
            {
                "text": "chore(analysis): prepare commit analysis run",
                "type": "chore",
                "scope": "analysis",
                "reason": "No AI commit message has been generated yet.",
            }
        ]
    stats: dict[str, int] = {}
    for item in messages:
        stats[item["type"]] = stats.get(item["type"], 0) + 1
    return {
        "commitMessages": {
            "messages": messages,
            "stats": [{"name": name, "value": value * 16} for name, value in stats.items()],
        }
    }

