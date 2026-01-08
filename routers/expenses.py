from db import SessionDep
from fastapi import APIRouter, Depends, HTTPException
from models.projectmodels import Expenditure, ExpenditureBase, Project
from sqlmodel import select

from .users import oauth2_scheme
from .verification import verify_user

router = APIRouter()


@router.post("/{project_id}/expenditures", response_model=Expenditure)
def create_expenditure(
    expenditure: ExpenditureBase,
    project_id: str,
    session: SessionDep,
    token: str = Depends(oauth2_scheme),
):
    user_phone, admin = verify_user(session, token)

    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.contractor != user_phone:
        raise HTTPException(status_code=403, detail="Unauthorized")
    if expenditure.bill_url is None:
        raise HTTPException(status_code=404, detail="URL not found")
    db_expenditure = Expenditure.model_validate(expenditure)
    session.add(db_expenditure)
    session.commit()
    session.refresh(db_expenditure)
    return db_expenditure


@router.get("/projects/{project_id}/expenditures", response_model=list[Expenditure])
def get_project_expenditures(
    project_id: str,
    session: SessionDep,
):
    expenditures = list(
        session.exec(
            select(Expenditure).where(Expenditure.project_id == project_id)
        ).all()
    )
    return expenditures
