from fastapi import FastAPI
from contextlib import asynccontextmanager
from db import create_db_and_tables
from routes import user, verification
@asynccontextmanager
async def lifespan(app: FastAPI):
    # create tables before app starts
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(user.router, prefix="/user", tags=["users"])
app.include_router(verification.router, prefix="/verification", tags=["verify"])

@app.head("/")
def read_root():
    return {"202": "Working!"}