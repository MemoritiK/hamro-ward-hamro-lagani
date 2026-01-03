from fastapi import APIRouter, HTTPException, status, Depends, UploadFile
from sqlmodel import select
from typing import Annotated
from db import SessionDep
from models.users import User, UserCitizenship, CitizenshipBase, Citizenship
from .users import get_current_user, oauth2_scheme
from pathlib import Path
import base64

router = APIRouter()


MAX_SIZE = 1 * 1024 * 1024  # 1 MB
UPLOAD_DIR = Path("Citizenship_dir")
ALLOWED_MIME = {"image/jpeg", "image/png"}

def verify_user(session, token: Annotated[str, Depends(oauth2_scheme)]):
    current_user, admin = get_current_user(session, token)
    return current_user.phone, admin

@router.post("/citizenship/{phone}")
async def upload_file(
    file: UploadFile,
    phone: str,
    session: SessionDep,
    token: Annotated[str, Depends(oauth2_scheme)]
):
    user_phone, _ = verify_user(session, token)
    if phone != user_phone:
        raise HTTPException(status_code=401, detail="Invalid User")

    if not file.filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    if file.content_type not in ALLOWED_MIME:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only JPG and PNG files are allowed"
        )

    bytes_data = await file.read()
    if len(bytes_data) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="Payload too large (max 1 MB)")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    file_path = UPLOAD_DIR / file.filename
    file_path.write_bytes(bytes_data)

    citizen = CitizenshipBase(phone=phone, path=str(file_path))
    db_user = Citizenship.model_validate(citizen)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return {"filename": file.filename, "saved_to": str(file_path)}

@router.get("/citizenship")
async def get_file(
    session: SessionDep,
    token: str = Depends(oauth2_scheme),
):
    user_phone, admin = verify_user(session, token)
    if not admin:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    u = session.exec(select(Citizenship).where(Citizenship.verified == False)).first()
    if u is None:
        raise HTTPException(status_code=404, detail="No user found.")

    path = Path(u.path)
    data = base64.b64encode(path.read_bytes()).decode()
    results = {
        "id": u.id,
        "phone": u.phone,
        "image_data": data
    }
    return results

@router.put("/citizenship/{phone}")
async def verify_identity(
    phone: str,
    user: UserCitizenship,
    session: SessionDep,
    token: str = Depends(oauth2_scheme)
):
    user_phone, admin = verify_user(session, token)
    if not admin:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    user_exist = session.exec(select(User).where(User.phone == phone)).first()
    if not user_exist:
        raise HTTPException(status_code=404, detail="User not found")

    user_dict = user.model_dump(exclude_unset=True)
    user_exist.sqlmodel_update(user_dict)
    session.add(user_exist)

    citizen_exist = session.exec(select(Citizenship).where(Citizenship.phone == phone)).first()
    if not citizen_exist:
        raise HTTPException(status_code=404, detail="User not found")
    citizen_exist.verified = True
    session.add(citizen_exist)

    session.commit()
    session.refresh(user_exist)
    return user_exist
