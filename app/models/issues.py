from typing import Optional, List, Literal
from sqlmodel import SQLModel, Field, Column, JSON
from datetime import datetime, timezone
import uuid

class IssueBase(SQLModel):
    project_id: str = Field(..., description="The project this issue is related to")
    reason: str = Field(..., description="Description of the issue")
    proof_urls: Optional[List[str]] = Field(default=None, sa_column=Column(JSON), description="Optional evidence")
    user_id: Optional[str] = Field(default=None, description="Only stored if user opts in")
    anonymous: bool = False

class Issue(IssueBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc)) 
    status: str = Field(default="pending", description="pending / reviewed / resolved")

class IssueUpdateStatus(SQLModel):
    status: Literal["pending", "reviewed", "resolved"] = Field(..., description="New status of the issue")