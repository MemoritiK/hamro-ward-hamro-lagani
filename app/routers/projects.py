from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from models.projectmodels import Project, ProjectBase, ProjectUpdate, MilestoneBase, Milestone, MilestoneUpdate
from models.users import User
from db import SessionDep
from .users import oauth2_scheme
from .verification import verify_user
from typing import List

router = APIRouter()

@router.post("/", response_model=Project)
def create_project(project: ProjectBase, milestones: List[MilestoneBase], session: SessionDep, token: str = Depends(oauth2_scheme)):
    user_phone, admin = verify_user(session, token)
    if not admin:
        raise HTTPException(status_code=403, detail="Unauthorized access")
    
    contractor = session.exec(select(User).where(User.phone == project.contractor)).first()
    if not contractor:
        raise HTTPException(status_code=404, detail="Contarctor not registered")
    
    if contractor.citizenship_num is None:
        raise HTTPException(status_code=404, detail="Contarctor not verified")
        
    db_project = Project.model_validate(project)
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    
    for milestone in milestones:
        milestone.project_id = db_project.id
        db_milestone = Milestone.model_validate(milestone)
        session.add(db_milestone)
    session.commit()
    return db_project

@router.get("/", response_model=list[Project])
def list_projects(session: SessionDep):
    return list(session.exec(select(Project)).all())

@router.get("/{project_id}", response_model=Project)
def get_project(project_id: str, session: SessionDep):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{project_id}", response_model=Project)
def update_project(project_id: str, project_data: ProjectUpdate, session: SessionDep, token: str = Depends(oauth2_scheme)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    user_phone, admin = verify_user(session, token)
    if not admin:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    if project_data.contractor is not None:
        contractor = session.exec(select(User).where(User.phone == project_data.contractor)).first()
        if not contractor:
            raise HTTPException(status_code=404, detail="Contarctor not registered")
            
        if contractor.citizenship_num is None:
            raise HTTPException(status_code=404, detail="Contarctor not verified")
        
    dict = project_data.model_dump(exclude_unset=True)
    project.sqlmodel_update(dict)
    session.add(project)
    session.commit()
    session.refresh(project)
    return project

@router.delete("/{project_id}")
def delete_project(project_id: str, session: SessionDep, token: str = Depends(oauth2_scheme)):
    project = session.get(Project, project_id)
    user_phone, admin = verify_user(session, token)
    if not admin:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    session.delete(project)
    session.commit()
    return {"detail": "Project deleted successfully"}

@router.get("/{project_id}/milestones", response_model=list[Milestone])
def list_milestones(session: SessionDep, project_id: str):
    return list(session.exec(select(Milestone).where(Milestone.project_id == project_id)).all())
    
@router.put("/{project_id}/{milestone_id}", response_model=Project)
def update_milestone(project_id: str, milestone_id: str, milestone_data: MilestoneUpdate, session: SessionDep, token: str = Depends(oauth2_scheme)):
    milestone = session.get(Milestone, milestone_id)
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    user_phone, admin = verify_user(session, token)
    
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if project.contractor != user_phone:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    dict = milestone_data.model_dump(exclude_unset=True) 
    milestone.sqlmodel_update(dict)
    session.add(milestone)
    session.commit()
    session.refresh(milestone)
    return milestone