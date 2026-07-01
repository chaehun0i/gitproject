from __future__ import annotations

from typing import Any


def detect_risks(files: list[dict[str, Any]]) -> list[dict[str, Any]]:
    risks: list[dict[str, Any]] = []
    for item in files:
        path = (item.get("file_path") or "").lower()
        patch = (item.get("patch_text") or "").lower()
        additions = int(item.get("additions") or 0)
        deletions = int(item.get("deletions") or 0)

        if any(token in path for token in ("auth", "login", "jwt", "session")):
            risks.append(
                {
                    "severity": "high",
                    "category": "auth",
                    "title": "Authentication-sensitive file changed",
                    "description": f"{item.get('file_path')} touches authentication or session flow.",
                    "recommendation": "Review token lifetime, revocation, and password verification paths.",
                }
            )
        if any(token in patch for token in ("password", "secret", "api_key", "private_key", "token=")):
            risks.append(
                {
                    "severity": "critical",
                    "category": "secret",
                    "title": "Possible secret or credential in diff",
                    "description": f"{item.get('file_path')} includes credential-like text.",
                    "recommendation": "Confirm no raw secret is committed and rotate exposed credentials if needed.",
                }
            )
        if path.endswith(".sql") or "migration" in path or "schema" in path:
            risks.append(
                {
                    "severity": "medium",
                    "category": "database",
                    "title": "Database structure changed",
                    "description": f"{item.get('file_path')} may affect persisted data or migrations.",
                    "recommendation": "Check backward compatibility and migration rollback behavior.",
                }
            )
        if deletions > 80 and deletions > additions * 2:
            risks.append(
                {
                    "severity": "medium",
                    "category": "regression",
                    "title": "Large deletion detected",
                    "description": f"{item.get('file_path')} removes {deletions} lines.",
                    "recommendation": "Verify removed behavior is covered by tests or intentionally obsolete.",
                }
            )
    return risks

