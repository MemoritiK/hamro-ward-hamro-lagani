from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime, date, timezone
import uuid
from sqlalchemy import Column, JSON

class ProjectBase(SQLModel):
    title: str
    type: str # Gov-funded or Community-funded
    description: Optional[str] = None
    ward_num: int = Field(index=True)
    district: str
    city: str
    contractor: str  # phone of contractor
    total_budget: float = Field(default=0.0, ge=0)
    budget_utilized: float = Field(default=0.0, ge=0)
    deadline: Optional[date] = None
    fundraised: float = Field(default=0.0, ge=0)
    status: str # soon, ongoing, completed, delayed

class Project(ProjectBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc)) 

class ProjectUpdate(SQLModel):
    contractor: str  # phone of contractor
    budget_utilized: Optional[float]
    status: Optional[str]
    deadline: Optional[date]
    fundraised: Optional[float]

class MilestoneBase(SQLModel):
    project_id: Optional[str] = Field(index=True, default = None)
    description: Optional[str] = None
    due_date: Optional[date] = None
    completed: bool = False
    completed_at: Optional[datetime] = None
    photo_urls: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))

class MilestoneUpdate(SQLModel):
    completed: bool = False
    completed_at: Optional[datetime] = None
    photo_urls: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    
class Milestone(MilestoneBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)

class ExpenditureBase(SQLModel):
    project_id: str = Field(index=True)
    description: Optional[str] = None

    amount: float = Field(ge=0)
    spent_on: date

    bill_url: Optional[str] = None

class Expenditure(ExpenditureBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc)) 
