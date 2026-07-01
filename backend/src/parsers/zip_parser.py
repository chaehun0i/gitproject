from __future__ import annotations

import zipfile
from pathlib import Path
from typing import Any

from src.parsers.diff_parser import detect_language


def parse_zip_file(path: str) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with zipfile.ZipFile(path) as archive:
        for info in archive.infolist():
            if info.is_dir():
                continue
            rows.append(
                {
                    "file_path": info.filename,
                    "old_path": info.filename,
                    "change_type": "modified",
                    "language": detect_language(info.filename),
                    "additions": 0,
                    "deletions": 0,
                    "patch_text": f"Uploaded from archive: {Path(path).name}",
                }
            )
    return rows

