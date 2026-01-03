from fastapi import FastAPI
from contextlib import asynccontextmanager
from db import create_db_and_tables 
from routers import users, verification, projects, issues, expenses


@asynccontextmanager
async def lifespan(app: FastAPI):
    # create tables before app starts
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(users.router, prefix="/user", tags=["users"])
app.include_router(verification.router, prefix="/verification", tags=["verify"])
app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(issues.router, prefix="/issues", tags=["issues"])
app.include_router(expenses.router, prefix="/expenses", tags=["expenses"])

@app.head("/")
def read_root():
    return {"202": "Working!"}