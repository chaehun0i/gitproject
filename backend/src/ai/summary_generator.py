from __future__ import annotations

from collections import Counter
from typing import Any


def generate_summary(files: list[dict[str, Any]], risks: list[dict[str, Any]]) -> str:
    if not files:
        return "분석할 변경 파일이 아직 저장되지 않았습니다."
    languages = Counter((item.get("language") or "Unknown") for item in files)
    top_language = languages.most_common(1)[0][0]
    return (
        f"이번 변경은 {len(files)}개 파일을 대상으로 하며, 주요 언어는 {top_language}입니다. "
        f"룰 기반 검사에서 {len(risks)}개의 검토 후보를 찾았습니다."
    )


def generate_commit_messages(files: list[dict[str, Any]], risks: list[dict[str, Any]]) -> list[dict[str, str]]:
    scope = "analysis"
    if files:
        first_path = files[0].get("file_path") or "analysis"
        scope = first_path.split("/", 1)[0].replace("_", "-") or "analysis"
    message_type = "fix" if risks else "chore"
    return [
        {
            "text": f"{message_type}({scope}): update analyzed changes",
            "type": message_type,
            "scope": scope,
            "reason": "Generated from parsed files and rule-based risk findings.",
        },
        {
            "text": "chore(analysis): refresh commit analysis output",
            "type": "chore",
            "scope": "analysis",
            "reason": "Fallback message for analysis result bookkeeping.",
        },
    ]

