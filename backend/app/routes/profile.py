from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from pydantic import BaseModel
from typing import Optional

from ..database import get_session
from ..models import User
from ..auth import get_current_user, require_role

router = APIRouter(prefix="/profile", tags=["profile"])

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

class AdminProfileUpdate(ProfileUpdate):
    role: Optional[str] = None
    employee_id: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    status: Optional[str] = None

@router.get("/me")
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me")
def update_my_profile(update_data: ProfileUpdate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if update_data.name:
        current_user.name = update_data.name
    if update_data.email:
        current_user.email = update_data.email
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user

@router.get("/{user_id}")
def get_profile(user_id: int, admin_user: User = Depends(require_role("admin")), session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/{user_id}")
def update_profile(user_id: int, update_data: AdminProfileUpdate, admin_user: User = Depends(require_role("admin")), session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(user, key, value)
        
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
