from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import select
from typing import Annotated
from db import SessionDep
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
import jwt, os, string
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
from datetime import datetime, timedelta, timezone
from models.users import User, UserBase, UserPublic

router = APIRouter()
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


SECRET_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# to_encode = {"sub": "9810000000","admin": "true", "exp": "1000000000"}
def create_access_token(data: dict):
    return jwt.encode(data.copy(), SECRET_KEY, algorithm=ALGORITHM)

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
    user = session.exec(select(User).where(User.phone == phone)).first()
    if user is None:
        raise credentials_exception
    return user, admin

def count_char(password: str):
    return sum(1 for char in password if char in string.punctuation)

@router.post("/register/", response_model=UserPublic)
async def create_user(user: UserBase, session: SessionDep):
    if len(user.password) < 5 or count_char(user.password) < 2:
        raise HTTPException(status_code=400, detail="Invalid Password")
    user.password = pwd_context.hash(user.password)
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
    expiry = datetime.now(timezone.utc) + timedelta(days=60)
    expiry_timestamp = int(expiry.timestamp())
    token = create_access_token({"sub": user_exist.phone, "admin": user_exist.admin, "exp": expiry_timestamp})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/verify", response_model=UserPublic)
async def verify_user(session: SessionDep, token: Annotated[str, Depends(oauth2_scheme)]):
    user, _ = get_current_user(session, token)
    return user

@router.put("/admin", response_model=UserPublic)
async def set_admin(session: SessionDep, token: Annotated[str, Depends(oauth2_scheme)], phone: str): # phone of whom to make admin
    current_user, admin = get_current_user(session, token)
    if admin is False:
        raise HTTPException(status_code=403, detail="Unauthorized Access") 
    user_exist = session.exec(select(User).where(User.phone == phone)).first()
    if user_exist is None:
        raise HTTPException(status_code=404, detail="User not found") 
    user_exist.admin = True
    session.add(user_exist)
    session.commit()
    session.refresh(user_exist)
    return user_exist

@router.get("/all", response_model=list[UserPublic])
def list_users(session: SessionDep, token: str = Depends(oauth2_scheme)):
    current_user, admin = get_current_user(session, token)
    if not admin:
        raise HTTPException(status_code=403, detail="Unauthorized")
    return list(session.exec(select(User)).all())
