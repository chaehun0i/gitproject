from __future__ import annotations

from pathlib import Path
from typing import Any

LANGUAGE_BY_EXTENSION = {
    ".py": "Python",
    ".js": "JavaScript",
    ".jsx": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".java": "Java",
    ".go": "Go",
    ".sql": "SQL",
    ".md": "Markdown",
    ".json": "JSON",
    ".yml": "YAML",
    ".yaml": "YAML",
}


def detect_language(file_path: str | None) -> str:
    suffix = Path(file_path or "").suffix.lower()
    return LANGUAGE_BY_EXTENSION.get(suffix, "Unknown")


def _normalize_path(path: str) -> str:
    value = path.strip()
    if value.startswith("a/") or value.startswith("b/"):
        return value[2:]
    return value


def _change_type(old_path: str | None, new_path: str | None) -> str:
    if old_path == "/dev/null":
        return "added"
    if new_path == "/dev/null":
        return "deleted"
    if old_path and new_path and old_path != new_path:
        return "renamed"
    return "modified"


def parse_unified_diff(content: bytes, fallback_name: str) -> list[dict[str, Any]]:
    text = content.decode("utf-8", errors="replace")
    files: list[dict[str, Any]] = []
    current: dict[str, Any] | None = None
    patch_lines: list[str] = []

    def flush() -> None:
        nonlocal current, patch_lines
        if current is None:
            return
        current["patch_text"] = "\n".join(patch_lines)
        current["language"] = detect_language(current.get("file_path"))
        files.append(current)
        current = None
        patch_lines = []

    for line in text.splitlines():
        if line.startswith("diff --git "):
            flush()
            parts = line.split()
            old_path = _normalize_path(parts[2]) if len(parts) > 2 else fallback_name
            new_path = _normalize_path(parts[3]) if len(parts) > 3 else old_path
            current = {
                "file_path": new_path,
                "old_path": old_path,
                "change_type": _change_type(old_path, new_path),
                "additions": 0,
                "deletions": 0,
            }
            patch_lines = [line]
            continue
        if current is None and (line.startswith("--- ") or line.startswith("+++ ")):
            current = {
                "file_path": fallback_name,
                "old_path": fallback_name,
                "change_type": "modified",
                "additions": 0,
                "deletions": 0,
            }
        if current is None:
            continue
        patch_lines.append(line)
        if line.startswith("--- "):
            current["old_path"] = _normalize_path(line[4:])
            current["change_type"] = _change_type(current.get("old_path"), current.get("file_path"))
        elif line.startswith("+++ "):
            current["file_path"] = _normalize_path(line[4:])
            current["change_type"] = _change_type(current.get("old_path"), current.get("file_path"))
        elif line.startswith("+") and not line.startswith("+++"):
            current["additions"] += 1
        elif line.startswith("-") and not line.startswith("---"):
            current["deletions"] += 1

    flush()
    if files:
        return files
    return [
        {
            "file_path": fallback_name,
            "old_path": fallback_name,
            "change_type": "modified",
            "language": detect_language(fallback_name),
            "additions": sum(1 for line in text.splitlines() if line.startswith("+") and not line.startswith("+++")),
            "deletions": sum(1 for line in text.splitlines() if line.startswith("-") and not line.startswith("---")),
            "patch_text": text[:20000],
        }
    ]

