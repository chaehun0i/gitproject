from __future__ import annotations

from pydantic import BaseModel, Field


class ProjectPayload(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = None
    owner: str | None = None
    repo: str | None = None
    source: str | None = None
    visibility: str | None = "private"
    branch: str | None = "main"
    language: str | None = None
    starred: bool = False
