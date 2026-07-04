from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel

from ..database import get_session
from ..models import CorrectionRequest, Attendance, User
from ..auth import get_current_user, require_role

router = APIRouter(prefix="/corrections", tags=["corrections"])

class CreateCorrectionReq(BaseModel):
    attendance_id: int
    requested_change: str
    reason: str

class DecideCorrectionReq(BaseModel):
    status: str # "approved" | "rejected"
    comment: str

@router.post("/")
def create_correction(req: CreateCorrectionReq, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    att = session.get(Attendance, req.attendance_id)
    if not att or att.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Attendance record not found or not yours")
        
    correction = CorrectionRequest(
        user_id=current_user.id,
        attendance_id=req.attendance_id,
        requested_change=req.requested_change,
        reason=req.reason
    )
    session.add(correction)
    session.commit()
    session.refresh(correction)
    return correction

@router.get("/")
def get_corrections(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role == "admin":
        return session.exec(select(CorrectionRequest)).all()
    else:
        return session.exec(select(CorrectionRequest).where(CorrectionRequest.user_id == current_user.id)).all()

@router.patch("/{id}/decide")
def decide_correction(id: int, req: DecideCorrectionReq, admin_user: User = Depends(require_role("admin")), session: Session = Depends(get_session)):
    correction = session.get(CorrectionRequest, id)
    if not correction:
        raise HTTPException(status_code=404, detail="Correction request not found")
        
    if req.status not in ["approved", "rejected"]:
        raise HTTPException(status_code=422, detail="Status must be approved or rejected")
        
    correction.status = req.status
    correction.admin_comment = req.comment
    session.add(correction)
    
    if req.status == "approved":
        att = session.get(Attendance, correction.attendance_id)
        if att:
            att.status = "present (corrected)"
            session.add(att)
            
    session.commit()
    session.refresh(correction)
    return correction
