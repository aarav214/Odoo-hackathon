from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import Session, select
from typing import Optional, Dict
from pydantic import BaseModel

from ..database import get_session
from ..models import ChecklistItem, User
from ..auth import get_current_user
from .notifications import create_notification

router = APIRouter(prefix="/onboarding", tags=["onboarding"])

@router.get("/{user_id}")
def get_checklist(user_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    items = session.exec(select(ChecklistItem).where(ChecklistItem.user_id == user_id).order_by(ChecklistItem.order)).all()
    return items

@router.patch("/{item_id}")
def toggle_done(item_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    item = session.get(ChecklistItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    if current_user.role != "admin" and item.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    item.done = not item.done
    session.add(item)
    session.commit()
    session.refresh(item)
    
    # Check if all items are done to trigger notification
    all_items = session.exec(select(ChecklistItem).where(ChecklistItem.user_id == item.user_id)).all()
    if all(i.done for i in all_items):
        create_notification(
            session=session,
            recipient_id=item.user_id,
            title="Onboarding Completed",
            message="You have successfully completed all your onboarding tasks.",
            notification_type="onboarding",
            reference_type="user",
            reference_id=item.user_id
        )
        
    return item

class OCRExtractedFields(BaseModel):
    name: str
    document_id: str
    dob: str

class OCRResponse(BaseModel):
    extracted_fields: OCRExtractedFields
    confidence: float
    document_type: str
    verification_status: str

@router.post("/ocr", response_model=OCRResponse, summary="Process Document via OCR")
async def process_ocr(file: UploadFile = File(...), current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Read file bytes to simulate processing
    content = await file.read()
    
    # Mock OCR processing for demo purposes
    # Fallback deterministic parser
    extracted_fields = {
        "name": current_user.name,
        "document_id": "ABC123456",
        "dob": "1990-01-01"
    }
    confidence = 0.95
    document_type = "ID Card"
    verification_status = "verified"
    
    create_notification(
        session=session,
        recipient_id=current_user.id or 0,
        title="OCR Verification Finished",
        message=f"Your {document_type} has been successfully verified.",
        notification_type="onboarding",
        reference_type="document",
        reference_id=0
    )
    
    return {
        "extracted_fields": extracted_fields,
        "confidence": confidence,
        "document_type": document_type,
        "verification_status": verification_status
    }
