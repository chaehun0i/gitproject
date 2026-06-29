from __future__ import annotations

from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = None


class ProjectSummary(BaseModel):
    id: int
    name: str
    description: str | None = None
    analysis_count: int = 0
