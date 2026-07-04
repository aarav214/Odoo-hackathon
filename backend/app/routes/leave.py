from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from datetime import date
from typing import Optional

from ..database import get_session
from ..models import LeaveRequest, User
from ..auth import get_current_user, require_role
from .notifications import create_notification

router = APIRouter(prefix="/leave", tags=["leave"])

class CreateLeaveReq(BaseModel):
    leave_type: str
    start_date: date
    end_date: date
    remarks: Optional[str] = None

class DecideLeaveReq(BaseModel):
    status: str
    comment: str

@router.post("/")
def create_leave(req: CreateLeaveReq, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    leave = LeaveRequest(
        user_id=current_user.id or 0,
        leave_type=req.leave_type,
        start_date=req.start_date,
        end_date=req.end_date,
        remarks=req.remarks
    )
    session.add(leave)
    session.commit()
    session.refresh(leave)
    
    create_notification(
        session=session,
        recipient_id=current_user.id or 0,
        title="Leave Request Submitted",
        message=f"Your {req.leave_type} leave request from {req.start_date} to {req.end_date} has been submitted.",
        notification_type="leave",
        reference_type="leave_request",
        reference_id=leave.id
    )
    
    return leave

@router.get("/")
def get_leaves(user_id: Optional[int] = None, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    query = select(LeaveRequest)
    if current_user.role == "admin":
        if user_id:
            query = query.where(LeaveRequest.user_id == user_id)
        return session.exec(query).all()
    else:
        return session.exec(query.where(LeaveRequest.user_id == current_user.id)).all()

@router.patch("/{id}/decide")
def decide_leave(id: int, req: DecideLeaveReq, admin_user: User = Depends(require_role("admin")), session: Session = Depends(get_session)):
    leave = session.get(LeaveRequest, id)
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
        
    if req.status not in ["approved", "rejected"]:
        raise HTTPException(status_code=422, detail="Status must be approved or rejected")
        
    leave.status = req.status
    leave.admin_comment = req.comment
    session.add(leave)
    session.commit()
    session.refresh(leave)
    
    create_notification(
        session=session,
        recipient_id=leave.user_id,
        title=f"Leave Request {req.status.capitalize()}",
        message=f"Your leave request has been {req.status}.",
        notification_type="leave",
        reference_type="leave_request",
        reference_id=leave.id
    )
    
    return leave
