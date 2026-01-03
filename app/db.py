from sqlmodel import SQLModel, Session, create_engine
from typing import Annotated
from fastapi import Depends

DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

def init_db():
    SQLModel.metadata.create_all(engine)
