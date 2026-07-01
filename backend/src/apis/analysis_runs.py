from __future__ import annotations

import hashlib
import json
from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from src.apis.auth import get_authenticated_user
from src.models.analysis_runs import AnalysisRunCreate
from utils.db import add_key, find_all, find_one, save

analysis_runs_router = APIRouter(tags=["analysis"])

STATUS_DONE = "\ubd84\uc11d \uc644\ub8cc"
STATUS_RUNNING = "\ubd84\uc11d \uc911"
STATUS_WAITING = "\ubd84\uc11d \ub300\uae30"
STATUS_FAILED = "\ubd84\uc11d \uc2e4\ud328"


def _format_datetime(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.isoformat()
    return str(value)


def _status_label(status_value: str | None) -> str:
    status_name = (status_value or "PENDING").upper()
    if status_name == "COMPLETED":
        return STATUS_DONE
    if status_name in {"RUNNING", "PARSING", "ANALYZING", "AI_GENERATING"}:
        return STATUS_RUNNING
    if status_name == "FAILED":
        return STATUS_FAILED
    return STATUS_WAITING


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


def _owned_project(project_id: int, user_id: int) -> dict[str, Any]:
    project = find_one(
        "SELECT * FROM projects WHERE id = %s AND user_id = %s",
        (project_id, user_id),
    )
    if project is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


def _ensure_project(payload: AnalysisRunCreate, user_id: int) -> dict[str, Any]:
    target_project_id = payload.projectId or payload.project_id
    if target_project_id:
        return _owned_project(target_project_id, user_id)

    owner, repo, default_name = _split_repository(payload.repository, payload.projectName)
    name = payload.projectName or default_name
    project = find_one(
        """
        SELECT *
        FROM projects
        WHERE user_id = %s AND name = %s AND owner = %s AND repo = %s
        """,
        (user_id, name, owner, repo),
    )
    if project:
        return project

    project_id = add_key(
        """
        INSERT INTO projects (user_id, name, owner, repo, source, branch)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (
            user_id,
            name,
            owner,
            repo,
            "GitHub" if payload.type == "github" else "git_upload",
            payload.branch or "main",
        ),
    )
    return _owned_project(project_id, user_id)


def _run_response(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": row["id"],
        "status": row["status"],
        "repository": row.get("repository"),
        "branch": row.get("branch"),
        "createdAt": _format_datetime(row.get("created_at")),
        "projectId": row.get("project_id"),
        "progress": int(row.get("progress") or 0),
    }


def _get_run(run_id: str, user_id: int) -> dict[str, Any]:
    if run_id == "latest":
        run = find_one(
            """
            SELECT *
            FROM analysis_runs
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT 1
            """,
            (user_id,),
        )
    else:
        run = find_one(
            "SELECT * FROM analysis_runs WHERE id = %s AND user_id = %s",
            (int(run_id), user_id),
        )
    if run is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Analysis run not found")
    return run


def _create_run(payload: AnalysisRunCreate, user: dict[str, Any]) -> dict[str, Any]:
    project = _ensure_project(payload, int(user["id"]))
    repository = payload.repository or f"{project.get('owner')}/{project.get('repo')}"
    run_id = add_key(
        """
        INSERT INTO analysis_runs
            (project_id, user_id, source_type, status, progress, title,
             repository, branch, range_label, options)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            project["id"],
            user["id"],
            _source_type(payload.type),
            "PENDING",
            0,
            payload.title or payload.projectName or project["name"],
            repository,
            payload.branch or project.get("branch") or "main",
            payload.range,
            json.dumps(payload.options),
        ),
    )
    save(
        "INSERT INTO analysis_logs (analysis_run_id, message) VALUES (%s, %s)",
        (run_id, "Analysis run created."),
    )
    return _get_run(str(run_id), int(user["id"]))


def _counter_rows(run_id: int) -> dict[str, int]:
    files = find_one("SELECT COUNT(*) AS count FROM changed_files WHERE analysis_run_id = %s", (run_id,))
    risks = find_one("SELECT COUNT(*) AS count FROM risk_findings WHERE analysis_run_id = %s", (run_id,))
    messages = find_one(
        """
        SELECT COUNT(*) AS count
        FROM ai_outputs
        WHERE analysis_run_id = %s AND output_type = 'commit_message'
        """,
        (run_id,),
    )
    return {
        "commits": 0,
        "files": int((files or {}).get("count") or 0),
        "risks": int((risks or {}).get("count") or 0),
        "messages": int((messages or {}).get("count") or 0),
    }


def _history_item(row: dict[str, Any]) -> dict[str, Any]:
    counters = _counter_rows(int(row["id"]))
    return {
        "id": row["id"],
        "project": row.get("project_name") or row.get("title") or row.get("repository") or "analysis",
        "branch": row.get("branch") or "main",
        "source": "GitHub" if row.get("source_type") == "github" else "git_upload",
        "status": _status_label(row.get("status")),
        "commits": str(counters["commits"]) if counters["commits"] else "-",
        "files": str(counters["files"]) if counters["files"] else "-",
        "runtime": "-",
        "createdAt": _format_datetime(row.get("created_at")),
    }


@analysis_runs_router.post("", status_code=status.HTTP_202_ACCEPTED)
async def create_analysis_run(
    payload: AnalysisRunCreate,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    return {"analysisRun": _run_response(_create_run(payload, user))}


@analysis_runs_router.post("/upload", status_code=status.HTTP_202_ACCEPTED)
async def upload_analysis_artifacts(
    type: str | None = Form(default="upload"),
    repository: str | None = Form(default=None),
    branch: str | None = Form(default="main"),
    range: str | None = Form(default=None),
    projectName: str | None = Form(default=None),
    options: str | None = Form(default="[]"),
    files: list[UploadFile] | None = File(default=None),
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    parsed_options = json.loads(options or "[]")
    payload = AnalysisRunCreate(
        type=type,
        repository=repository,
        branch=branch,
        range=range,
        projectName=projectName,
        options=parsed_options if isinstance(parsed_options, list) else [],
    )
    run = _create_run(payload, user)

    uploaded_files = files or []
    for file in uploaded_files:
        content = await file.read()
        checksum = hashlib.sha256(content).hexdigest()
        save(
            """
            INSERT INTO uploaded_files
                (analysis_run_id, original_filename, stored_path, file_type, file_size, checksum)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                run["id"],
                file.filename or "upload",
                f"uploaded://analysis_runs/{run['id']}/{file.filename or 'upload'}",
                file.content_type,
                len(content),
                checksum,
            ),
        )
    if uploaded_files:
        save(
            "INSERT INTO analysis_logs (analysis_run_id, message) VALUES (%s, %s)",
            (run["id"], f"{len(uploaded_files)} artifact file(s) uploaded."),
        )

    return {"analysisRun": _run_response(run)}


@analysis_runs_router.get("")
async def list_analysis_runs(
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, list[dict[str, Any]]]:
    rows = find_all(
        """
        SELECT ar.*, p.name AS project_name
        FROM analysis_runs ar
        LEFT JOIN projects p ON p.id = ar.project_id
        WHERE ar.user_id = %s
        ORDER BY ar.created_at DESC
        """,
        (user["id"],),
    )
    history = [_history_item(row) for row in rows]
    return {"history": history, "runs": history}


@analysis_runs_router.get("/{run_id}/progress")
async def get_analysis_progress(
    run_id: str,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    run = _get_run(run_id, int(user["id"]))
    logs = find_all(
        """
        SELECT message
        FROM analysis_logs
        WHERE analysis_run_id = %s
        ORDER BY created_at ASC, id ASC
        """,
        (run["id"],),
    )
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
            "logs": [row["message"] for row in logs],
            "counters": _counter_rows(int(run["id"])),
        }
    }


@analysis_runs_router.get("/{run_id}/summary")
async def get_analysis_summary(
    run_id: str,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    run = _get_run(run_id, int(user["id"]))
    counters = _counter_rows(int(run["id"]))
    lines = find_one(
        """
        SELECT COALESCE(SUM(additions), 0) AS additions,
               COALESCE(SUM(deletions), 0) AS deletions
        FROM changed_files
        WHERE analysis_run_id = %s
        """,
        (run["id"],),
    ) or {}
    change_types = find_all(
        """
        SELECT COALESCE(change_type, 'modified') AS name, COUNT(*) AS value
        FROM changed_files
        WHERE analysis_run_id = %s
        GROUP BY COALESCE(change_type, 'modified')
        """,
        (run["id"],),
    )
    ai_summary = find_one(
        """
        SELECT content
        FROM ai_outputs
        WHERE analysis_run_id = %s AND output_type = 'change_summary'
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (run["id"],),
    )
    risks = find_all(
        """
        SELECT title, recommendation
        FROM risk_findings
        WHERE analysis_run_id = %s
        ORDER BY FIELD(severity, 'critical', 'high', 'medium', 'low'), id
        LIMIT 5
        """,
        (run["id"],),
    )
    review_points = [
        row.get("recommendation") or row.get("title")
        for row in risks
        if row.get("recommendation") or row.get("title")
    ]
    summary_text = ai_summary["content"] if ai_summary else "Analysis results are being prepared."
    summary = {
        "runId": run["id"],
        "status": run["status"],
        "totalFiles": counters["files"],
        "changedFiles": counters["files"],
        "riskCount": counters["risks"],
        "summaryText": summary_text,
        "metrics": [
            ["Analysis files", str(counters["files"]), "changed_files"],
            ["Risk findings", str(counters["risks"]), "risk_findings"],
            ["Added lines", f"+{int(lines.get('additions') or 0)}", "additions"],
            ["Deleted lines", f"-{int(lines.get('deletions') or 0)}", "deletions"],
        ],
        "changeTypes": [
            {"name": row["name"], "value": int(row["value"])}
            for row in change_types
        ],
        "activityValues": [counters["files"], counters["risks"], int(lines.get("additions") or 0)],
        "reviewPoints": review_points,
    }
    return {"summary": summary}


@analysis_runs_router.get("/{run_id}/detail")
async def get_analysis_detail(
    run_id: str,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    run = _get_run(run_id, int(user["id"]))
    files = find_all(
        """
        SELECT file_path, language, change_type, additions, deletions, patch_text
        FROM changed_files
        WHERE analysis_run_id = %s
        ORDER BY id ASC
        """,
        (run["id"],),
    )
    risks = find_all(
        """
        SELECT severity, category, title, description, recommendation
        FROM risk_findings
        WHERE analysis_run_id = %s
        ORDER BY id ASC
        """,
        (run["id"],),
    )
    outputs = find_all(
        """
        SELECT output_type, content
        FROM ai_outputs
        WHERE analysis_run_id = %s
        ORDER BY created_at ASC, id ASC
        """,
        (run["id"],),
    )
    first_patch = next((row.get("patch_text") for row in files if row.get("patch_text")), "")
    diff_lines = [["ctx", line] for line in first_patch.splitlines()[:200]]
    detail = {
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
        "diffLines": diff_lines,
        "risks": risks,
        "aiOutputs": outputs,
    }
    return {"detail": detail}


@analysis_runs_router.get("/{run_id}/commit-messages")
async def get_commit_messages(
    run_id: str,
    user: dict[str, Any] = Depends(get_authenticated_user),
) -> dict[str, dict[str, Any]]:
    run = _get_run(run_id, int(user["id"]))
    rows = find_all(
        """
        SELECT content, metadata
        FROM ai_outputs
        WHERE analysis_run_id = %s AND output_type = 'commit_message'
        ORDER BY created_at ASC, id ASC
        """,
        (run["id"],),
    )
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
