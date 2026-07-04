from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from datetime import datetime, timezone

from ..database import get_session
from ..models import Payroll, User
from ..auth import get_current_user, require_role
from .audit import write_audit_entry

router = APIRouter(prefix="/payroll", tags=["payroll"])

class UpdatePayrollReq(BaseModel):
    base_salary: float
    allowances_json: str
    deductions_json: str

@router.get("/me")
def get_my_payroll(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    payroll = session.exec(select(Payroll).where(Payroll.user_id == current_user.id)).first()
    if not payroll:
        raise HTTPException(status_code=404, detail="Payroll not found")
    return payroll

@router.get("/{user_id}")
def get_user_payroll(user_id: int, admin_user: User = Depends(require_role("admin")), session: Session = Depends(get_session)):
    payroll = session.exec(select(Payroll).where(Payroll.user_id == user_id)).first()
    if not payroll:
        raise HTTPException(status_code=404, detail="Payroll not found")
    return payroll

@router.patch("/{user_id}")
def update_payroll(user_id: int, req: UpdatePayrollReq, admin_user: User = Depends(require_role("admin")), session: Session = Depends(get_session)):
    payroll = session.exec(select(Payroll).where(Payroll.user_id == user_id)).first()
    if not payroll:
        payroll = Payroll(
            user_id=user_id,
            base_salary=req.base_salary,
            allowances_json=req.allowances_json,
            deductions_json=req.deductions_json
        )
    else:
        payroll.base_salary = req.base_salary
        payroll.allowances_json = req.allowances_json
        payroll.deductions_json = req.deductions_json
        payroll.updated_at = datetime.now(timezone.utc)
        
    session.add(payroll)
    
    write_audit_entry(
        session=session,
        actor_id=admin_user.id,
        action="payroll_update",
        target_user_id=user_id,
        payload={"base_salary": req.base_salary, "allowances": req.allowances_json, "deductions": req.deductions_json}
    )
    
    session.commit()
    session.refresh(payroll)
    return payroll
