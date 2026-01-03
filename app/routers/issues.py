from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from typing import List

from models.projectmodels import Project
from models.issues import Issue, IssueBase, IssueUpdateStatus
from db import SessionDep
from .users import oauth2_scheme
from .verification import verify_user

router = APIRouter()

@router.post("/{project_id}/issues", response_model=Issue)
def create_issue(
    project_id: str,
    issue: IssueBase,
    session: SessionDep,
    token: str = Depends(oauth2_scheme)
):
    user_phone, admin = verify_user(session, token)
    
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    user_id = None if issue.anonymous else user_phone 
    
    db_issue = Issue(
        project_id=project_id,
        reason=issue.reason,
        proof_urls=issue.proof_urls,
        anonymous=issue.anonymous,
        user_id=user_id
    )
    
    session.add(db_issue)
    session.commit()
    session.refresh(db_issue)
    
    return db_issue

@router.get("/{project_id}/issues", response_model=List[Issue])
def get_project_issues(
    project_id: str,
    session: SessionDep):    
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    issues = list(session.exec(
        select(Issue).where(Issue.project_id == project_id)
    ).all())
    
    return issues

@router.put("/issues/{issue_id}/status", response_model=Issue)
def update_issue_status(
    issue_id: str,
    status_update: IssueUpdateStatus,
    session: SessionDep,
    token: str = Depends(oauth2_scheme)
):
    user_phone, is_admin = verify_user(session, token)
    
    issue = session.get(Issue, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    project = session.get(Project, issue.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Only admin can update status
    if is_admin is False:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    issue.status = status_update.status
    session.add(issue)
    session.commit()
    session.refresh(issue)
    return issue
