from contextlib import asynccontextmanager

from db import create_db_and_tables
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import expenses, issues, projects, users, verification
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

@asynccontextmanager
async def lifespan(app: FastAPI):
    # create tables before app starts
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(users.router, prefix="/user", tags=["users"])
app.include_router(verification.router, prefix="/verification", tags=["verify"])
app.include_router(projects.router, prefix="/project", tags=["projects"])
app.include_router(issues.router, prefix="/issues", tags=["issues"])
app.include_router(expenses.router, prefix="/expenses", tags=["expenses"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="frontend"), name="static")

@app.head("/")
def read_root():
    return {"202": "Working!"}

@app.get("/")
async def serve_frontend():
    return FileResponse("frontend/index.html")

@app.get("/{path:path}")
async def serve_static(path: str):
    static_file = f"frontend/{path}"
    if path.endswith(".html") or "." not in path:
        return FileResponse(static_file)
    return FileResponse(static_file)
