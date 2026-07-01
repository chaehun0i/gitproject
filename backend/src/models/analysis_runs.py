from __future__ import annotations

from pydantic import BaseModel, Field


class AnalysisRunCreate(BaseModel):
    type: str | None = None
    repository: str | None = None
    branch: str | None = "main"
    range: str | None = None
    projectName: str | None = None
    options: list[str] = Field(default_factory=list)
    projectId: int | None = None
    project_id: int | None = None
    title: str | None = None
