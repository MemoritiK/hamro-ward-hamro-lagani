from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import select, SQLModel, Field
from typing import Annotated, Optional
from db import SessionDep
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
from datetime import datetime, timedelta, timezone
import uuid
import os
import string
from sqlalchemy import UniqueConstraint


# Start
router = APIRouter()
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

#citizenship, address from citizenship
class UserBase(SQLModel):
    name: Optional[str] = None 
    password: str
    phone: str = Field(index = True, unique=True)

class UserCitizenship(SQLModel):
    citizenship_num: str | None = Field(index = True, unique=True, default = None)
    district: str | None = None
    city: str | None = None
    ward_num: int | None = None
    admin: bool = Field(default = False)
        
class User(UserBase, UserCitizenship, table=True):
    __table_args__ = (UniqueConstraint("phone", "citizenship_num"), )
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    
class UserPublic(SQLModel):
    name: str
    phone: str
    district: str
    city: str
    ward_num: int
    citizenship_num: int

SECRET_KEY = os.environ["JWT_KEY"]
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# to_encode = {"sub": "980000000","admin": "false", "exp": "days"}
def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt  
        
def get_current_user(session: SessionDep, token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        phone = payload.get("sub")
        admin = payload.get("admin")
        if phone is None:
            raise credentials_exception
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user =  session.exec(select(User).where(User.phone == phone)).first()
    if user is None:
        raise credentials_exception
    return user, admin

def count_char(password: str):
    special_chars = string.punctuation
    
    count = 0
    for char in password:
        if char in special_chars:
            count += 1
    return count
    
@router.post("/register/", response_model=UserPublic)
async def create_user(user: UserBase, session: SessionDep):
    if len(user.password)<5 or count_char(user.password)<2:
        raise HTTPException(status_code=400, detail="Invalid Password")

    user.password=pwd_context.hash(user.password)
    db_user = User.model_validate(user)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@router.post("/login/")
async def read_user(user: UserBase, session: SessionDep):
    user_exist = session.exec(select(User).where(User.phone == user.phone)).first()
    if not user_exist or not pwd_context.verify(user.password, user_exist.password):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    
    # create token    
    expiry = datetime.now(timezone.utc) + timedelta(days=60)
    expiry_timestamp = int(expiry.timestamp())  # returns total seconds
    token = create_access_token({"sub":user_exist.phone, "admin": user_exist.admin, "exp":expiry_timestamp})
    return {"access_token": token, "token_type": "bearer"}
        
@router.get("/verify",response_model=UserPublic)
async def verify_user(session: SessionDep, token: Annotated[str, Depends(oauth2_scheme)]):
    user, _ = get_current_user(session, token)
    return user