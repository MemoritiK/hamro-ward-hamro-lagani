from fastapi import FastAPI
from app.db import init_db
from app.routers import projects, users, verification

app = FastAPI()

@app.on_event("startup")
def on_startup():
    init_db()

# include routers
app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(users.router, prefix="/user", tags=["users"])
app.include_router(verification.router, prefix="/verification", tags=["verification"])
