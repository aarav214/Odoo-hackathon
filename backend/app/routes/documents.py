from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlmodel import Session, select
import os
import shutil

from ..database import get_session
from ..models import Document, User
from ..auth import get_current_user, require_role

router = APIRouter(prefix="/documents", tags=["documents"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
def upload_document(
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    filepath = os.path.join(UPLOAD_DIR, f"{current_user.id}_{file.filename}")
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    doc = Document(
        user_id=current_user.id or 0,
        filename=file.filename or "",
        filepath=filepath,
        doc_type=doc_type
    )
    session.add(doc)
    session.commit()
    session.refresh(doc)
    return doc

@router.get("/{user_id}")
def get_documents(user_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view these documents")
        
    docs = session.exec(select(Document).where(Document.user_id == user_id)).all()
    return docs

@router.get("/{doc_id}/download")
def download_document(doc_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    doc = session.get(Document, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    if current_user.role != "admin" and current_user.id != doc.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    if not os.path.exists(doc.filepath):
        raise HTTPException(status_code=404, detail="File missing on disk")
        
    from fastapi.responses import FileResponse
    return FileResponse(doc.filepath, filename=doc.filename)
