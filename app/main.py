from contextlib import asynccontextmanager

from db import create_db_and_tables
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import expenses, issues, projects, users, verification


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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.head("/")
def read_root():
    return {"202": "Working!"}
