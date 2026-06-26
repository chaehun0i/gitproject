from fastapi import APIRouter, status

from app.schemas.projects import ProjectCreate, ProjectSummary

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("")
def list_projects() -> dict[str, list[ProjectSummary]]:
    return {"projects": []}


@router.post("", status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreate) -> dict[str, ProjectSummary]:
    project = ProjectSummary(id=1, name=payload.name, description=payload.description)
    return {"project": project}
