from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

AnalysisSourceType = Literal["diff_upload", "zip_upload", "log_upload", "manual_text"]
AnalysisStatus = Literal["pending", "parsing", "analyzing", "ai_generating", "completed", "failed"]


class AnalysisRunCreate(BaseModel):
    project_id: int = Field(gt=0)
    user_id: int = Field(gt=0)
    source_type: AnalysisSourceType
    title: str | None = Field(default=None, max_length=255)


class AnalysisRunSummary(BaseModel):
    id: int
    project_id: int
    user_id: int
    source_type: AnalysisSourceType
    status: AnalysisStatus = "pending"
    progress: int = Field(default=0, ge=0, le=100)
    title: str | None = None
