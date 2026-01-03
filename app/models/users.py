from sqlmodel import SQLModel, Field
from typing import  Optional
from sqlalchemy import UniqueConstraint
import uuid

class UserBase(SQLModel):
    name: Optional[str] = None
    password: str
    phone: str = Field(index=True, unique=True)

class UserCitizenship(SQLModel):
    citizenship_num: str | None = Field(index=True, unique=True, default=None)
    district: str | None = None
    city: str | None = None
    ward_num: int | None = None

class User(UserBase, UserCitizenship, table=True):
    __table_args__ = (UniqueConstraint("phone", "citizenship_num"), )
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    admin: bool = Field(default = False)

class UserPublic(SQLModel):
    id: str
    name: str
    phone: str
    district: str
    city: str
    ward_num: int
    citizenship_num: int
    
class CitizenshipBase(SQLModel):
    phone: str = Field(index=True, unique=True)
    path: str
    verified: bool = Field(default=False)

class Citizenship(CitizenshipBase, table=True):
    id: int = Field(primary_key=True)
    
