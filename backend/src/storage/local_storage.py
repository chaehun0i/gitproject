from __future__ import annotations

import hashlib
import re
from pathlib import Path
from typing import Any

from fastapi import UploadFile

UPLOAD_ROOT = Path(__file__).resolve().parents[2] / "uploads"


def _safe_filename(filename: str | None) -> str:
    raw = filename or "upload"
    name = raw.replace("\\", "/").split("/")[-1]
    return re.sub(r"[^A-Za-z0-9._-]+", "_", name).strip("._") or "upload"


async def save_upload_file(file: UploadFile, run_id: int) -> dict[str, Any]:
    content = await file.read()
    run_dir = UPLOAD_ROOT / "analysis_runs" / str(run_id)
    run_dir.mkdir(parents=True, exist_ok=True)

    filename = _safe_filename(file.filename)
    target = run_dir / filename
    if target.exists():
        stem = target.stem
        suffix = target.suffix
        index = 2
        while target.exists():
            target = run_dir / f"{stem}_{index}{suffix}"
            index += 1

    target.write_bytes(content)
    return {
        "original_filename": file.filename or filename,
        "stored_path": str(target),
        "file_type": file.content_type,
        "file_size": len(content),
        "checksum": hashlib.sha256(content).hexdigest(),
        "content": content,
    }

