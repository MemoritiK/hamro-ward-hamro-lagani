from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime, date
import uuid
from sqlalchemy import Column, JSON

class ProjectBase(SQLModel):
    title: str
    description: Optional[str] = None
    ward_num: int = Field(index=True)
    district: str
    city: str

    total_budget: float = Field(default=0.0, ge=0)
    budget_utilized: float = Field(default=0.0, ge=0)
    time_elapsed_days: Optional[int] = Field(default=None, ge=0)

    status: str = Field(default="pending")

    deadline: Optional[date] = None
    image_urls: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    fundraised: float = Field(default=0.0, ge=0)

class Project(ProjectBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

class ProjectPublic(SQLModel):
    title: str
    ward_num: int
    district: str
    city: str
    budget_utilized: float
    status: str
    deadline: Optional[date]
    image_urls: Optional[List[str]]
    latitude: Optional[float]
    longitude: Optional[float]
