from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
import json
from pydantic import BaseModel
from typing import List, Optional

from ..database import get_session
from ..models import AuditLog, User
from ..auth import require_role

router = APIRouter(prefix="/salary", tags=["salary"])

class SalaryHistoryRecord(BaseModel):
    previous_salary: Optional[float]
    updated_salary: float
    changed_by: int
    timestamp: str
    ledger_hash: str

@router.get("/history/{employee_id}", response_model=List[SalaryHistoryRecord], summary="Get Employee Salary History")
def get_salary_history(employee_id: int, admin_user: User = Depends(require_role("admin")), session: Session = Depends(get_session)):
    logs = session.exec(select(AuditLog).where(
        (AuditLog.target_user_id == employee_id) & 
        (AuditLog.action == "payroll_update")
    ).order_by(AuditLog.timestamp)).all()
    
    history = []
    previous_salary = None
    
    for log in logs:
        payload = json.loads(log.payload_json)
        updated_salary = payload.get("base_salary")
        
        history.append({
            "previous_salary": previous_salary,
            "updated_salary": updated_salary,
            "changed_by": log.actor_id,
            "timestamp": log.timestamp.isoformat(),
            "ledger_hash": log.hash
        })
        previous_salary = updated_salary
        
    return history
