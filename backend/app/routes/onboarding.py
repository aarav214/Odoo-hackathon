from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..database import get_session
from ..models import ChecklistItem, User
from ..auth import get_current_user

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
    return item
