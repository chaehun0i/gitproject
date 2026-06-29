from fastapi import APIRouter, status

from schemas.analysis_runs import AnalysisRunCreate, AnalysisRunSummary

router = APIRouter(prefix="/analysis-runs", tags=["analysis"])


@router.post("", status_code=status.HTTP_202_ACCEPTED)
def create_analysis_run(payload: AnalysisRunCreate) -> dict[str, AnalysisRunSummary]:
    run = AnalysisRunSummary(
        id=1,
        project_id=payload.project_id,
        user_id=payload.user_id,
        source_type=payload.source_type,
        title=payload.title,
    )
    return {"analysis_run": run}


@router.get("/{analysis_run_id}")
def get_analysis_run(analysis_run_id: int) -> dict[str, AnalysisRunSummary]:
    run = AnalysisRunSummary(
        id=analysis_run_id,
        project_id=1,
        user_id=1,
        source_type="manual_text",
        title="MVP analysis placeholder",
    )
    return {"analysis_run": run}
