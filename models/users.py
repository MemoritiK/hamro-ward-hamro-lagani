from sqlmodel import SQLModel, Field
from typing import  Optional
from sqlalchemy import UniqueConstraint
import uuid

class UserBase(SQLModel):
    name: Optional[str] = None
    password: str
    phone: str = Field(index=True, unique=True)

class UserCitizenship(SQLModel):
    citizenship_num: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    ward_num: Optional[int] = None

class User(UserBase, UserCitizenship, table=True):
    __table_args__ = (UniqueConstraint("phone", "citizenship_num"), )
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    admin: bool = Field(default = False)

class UserPublic(SQLModel):
    id: str
    name: Optional[str] = None
    phone: str
    admin: bool
    citizenship_num: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    ward_num: Optional[int] = None

class CitizenshipBase(SQLModel):
    phone: str = Field(index=True, unique=True)
    path: str
    status:"str" = Field(default="pending")     # "approved", "pending", "rejected"

class Citizenship(CitizenshipBase, table=True):
    id: int|None = Field(primary_key=True, default=None)
