from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from ..database import get_session
from ..models import Notification, User
from ..auth import get_current_user
from typing import Optional, List
from pydantic import BaseModel

router = APIRouter(prefix="/notifications", tags=["notifications"])

def create_notification(session: Session, recipient_id: int, title: str, message: str, notification_type: str, reference_type: Optional[str] = None, reference_id: Optional[int] = None):
    notif = Notification(
        recipient_id=recipient_id,
        title=title,
        message=message,
        notification_type=notification_type,
        reference_type=reference_type,
        reference_id=reference_id
    )
    session.add(notif)
    session.commit()
    session.refresh(notif)
    return notif

class UnreadCountResponse(BaseModel):
    unread_count: int

class StatusResponse(BaseModel):
    status: str
    updated: Optional[int] = None

@router.get("/", response_model=List[Notification], summary="Get User Notifications")
def get_notifications(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    notifs = session.exec(select(Notification).where(Notification.recipient_id == current_user.id).order_by(Notification.id.desc())).all()
    return notifs

@router.get("/unread-count", response_model=UnreadCountResponse, summary="Get Unread Notification Count")
def get_unread_count(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    count = session.exec(select(func.count(Notification.id)).where((Notification.recipient_id == current_user.id) & (Notification.is_read == False))).one()
    return {"unread_count": count}

@router.patch("/{id}/read", response_model=StatusResponse, summary="Mark Notification as Read")
def mark_read(id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    notif = session.get(Notification, id)
    if notif and notif.recipient_id == current_user.id:
        notif.is_read = True
        session.add(notif)
        session.commit()
        return {"status": "success"}
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Notification not found")

@router.patch("/read-all", response_model=StatusResponse, summary="Mark All Notifications as Read")
def mark_all_read(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    notifs = session.exec(select(Notification).where((Notification.recipient_id == current_user.id) & (Notification.is_read == False))).all()
    for n in notifs:
        n.is_read = True
        session.add(n)
    session.commit()
    return {"status": "success", "updated": len(notifs)}
