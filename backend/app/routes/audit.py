import hashlib
import json
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, desc
from pydantic import BaseModel
from typing import List
from ..database import get_session
from ..models import AuditLog, User
from ..auth import require_role

router = APIRouter(prefix="/audit", tags=["audit"])

def write_audit_entry(session: Session, actor_id: int, action: str, target_user_id: int, payload: dict):
    last_log = session.exec(select(AuditLog).order_by(desc(AuditLog.id)).limit(1)).first()
    prev_hash = last_log.hash if last_log else "0" * 64
    
    data_to_hash = {
        "prev_hash": prev_hash,
        "actor_id": actor_id,
        "action": action,
        "target_user_id": target_user_id,
        "payload": payload
    }
    
    json_str = json.dumps(data_to_hash, sort_keys=True)
    computed_hash = hashlib.sha256(json_str.encode("utf-8")).hexdigest()
    
    new_log = AuditLog(
        prev_hash=prev_hash,
        hash=computed_hash,
        actor_id=actor_id,
        action=action,
        target_user_id=target_user_id,
        payload_json=json.dumps(payload)
    )
    session.add(new_log)
    session.commit()
    session.refresh(new_log)
    return new_log

@router.get("/log")
def list_logs(admin_user: User = Depends(require_role("admin")), session: Session = Depends(get_session)):
    logs = session.exec(select(AuditLog).order_by(AuditLog.id)).all()
    return logs

class VerifyLedgerResponse(BaseModel):
    verification_status: bool
    verified_records: int
    invalid_records: List[int]

@router.get("/verify", response_model=VerifyLedgerResponse, summary="Verify Immutable Audit Ledger")
def verify_ledger(admin_user: User = Depends(require_role("admin")), session: Session = Depends(get_session)):
    logs = session.exec(select(AuditLog).order_by(AuditLog.id)).all()
    
    expected_prev_hash = "0" * 64
    verified_records = 0
    invalid_records = []
    
    for log in logs:
        is_valid = True
        if log.prev_hash != expected_prev_hash:
            is_valid = False
            
        data_to_hash = {
            "prev_hash": log.prev_hash,
            "actor_id": log.actor_id,
            "action": log.action,
            "target_user_id": log.target_user_id,
            "payload": json.loads(log.payload_json)
        }
        json_str = json.dumps(data_to_hash, sort_keys=True)
        computed_hash = hashlib.sha256(json_str.encode("utf-8")).hexdigest()
        
        if computed_hash != log.hash:
            is_valid = False
            
        if is_valid:
            verified_records += 1
        else:
            invalid_records.append(log.id)
            
        expected_prev_hash = log.hash
        
    return {
        "verification_status": len(invalid_records) == 0,
        "verified_records": verified_records,
        "invalid_records": invalid_records
    }
