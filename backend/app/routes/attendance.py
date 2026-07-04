from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

from ..database import get_session
from ..models import Attendance, User
from ..auth import get_current_user, require_role

router = APIRouter(prefix="/attendance", tags=["attendance"])

class LocationPayload(BaseModel):
    lat: Optional[float] = None
    lng: Optional[float] = None

class OfflineSyncPayload(BaseModel):
    timestamp: datetime
    type: str # "check-in" | "check-out"
    lat: Optional[float] = None
    lng: Optional[float] = None

@router.post("/check-in")
def check_in(payload: LocationPayload, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    today = date.today()
    att = session.exec(select(Attendance).where((Attendance.user_id == current_user.id) & (Attendance.date == today))).first()
    
    if att:
        if att.check_in_time:
            raise HTTPException(status_code=422, detail="Already checked in today")
        att.check_in_time = datetime.utcnow()
        att.lat = payload.lat
        att.lng = payload.lng
        att.status = "present"
    else:
        att = Attendance(
            user_id=current_user.id,
            date=today,
            check_in_time=datetime.utcnow(),
            status="present",
            lat=payload.lat,
            lng=payload.lng
        )
    session.add(att)
    session.commit()
    session.refresh(att)
    return att

@router.post("/check-out")
def check_out(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    today = date.today()
    att = session.exec(select(Attendance).where((Attendance.user_id == current_user.id) & (Attendance.date == today))).first()
    
    if not att or not att.check_in_time:
        raise HTTPException(status_code=422, detail="Not checked in today")
        
    if att.check_out_time:
        raise HTTPException(status_code=422, detail="Already checked out today")
        
    att.check_out_time = datetime.utcnow()
    session.add(att)
    session.commit()
    session.refresh(att)
    return att

@router.get("/me")
def get_my_attendance(range: str = "daily", current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    records = session.exec(select(Attendance).where(Attendance.user_id == current_user.id).order_by(Attendance.date)).all()
    return records

@router.get("/all")
def get_all_attendance(admin_user: User = Depends(require_role("admin")), session: Session = Depends(get_session)):
    records = session.exec(select(Attendance).order_by(Attendance.date)).all()
    return records

@router.post("/sync-offline")
def sync_offline(payloads: List[OfflineSyncPayload], current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    processed = []
    for payload in payloads:
        rec_date = payload.timestamp.date()
        att = session.exec(select(Attendance).where((Attendance.user_id == current_user.id) & (Attendance.date == rec_date))).first()
        
        if not att:
            att = Attendance(
                user_id=current_user.id,
                date=rec_date,
                status="present",
                synced_offline=True
            )
            session.add(att)
            
        if payload.type == "check-in" and not att.check_in_time:
            att.check_in_time = payload.timestamp
            att.lat = payload.lat
            att.lng = payload.lng
        elif payload.type == "check-out" and not att.check_out_time:
            att.check_out_time = payload.timestamp
            
        att.synced_offline = True
        session.commit()
        session.refresh(att)
        processed.append(att)
        
    return {"synced": len(processed)}
