from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import Session, select, func, desc, col
from typing import Optional
from datetime import date, datetime

from ..database import get_session
from ..models import User, Attendance, LeaveRequest, Payroll, Document, CorrectionRequest, AuditLog
from ..auth import require_role

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/dashboard/summary")
def get_dashboard_summary(admin_user: User = Depends(require_role("admin")), session: Session = Depends(get_session)):
    today = date.today()
    
    total_employees = session.exec(select(func.count(col(User.id))).where(User.role == "employee")).one()
    
    attendances_today = session.exec(select(Attendance).where(Attendance.date == today)).all()
    present_today = sum(1 for a in attendances_today if a.status.startswith("present"))
    absent_today = sum(1 for a in attendances_today if a.status == "absent")
    
    leaves_today = session.exec(
        select(func.count(col(LeaveRequest.id)))
        .where((LeaveRequest.start_date <= today) & (LeaveRequest.end_date >= today) & (LeaveRequest.status == "approved"))
    ).one()
    
    pending_leaves = session.exec(select(func.count(col(LeaveRequest.id))).where(LeaveRequest.status == "pending")).one()
    pending_corrections = session.exec(select(func.count(col(CorrectionRequest.id))).where(CorrectionRequest.status == "pending")).one()
    payroll_records = session.exec(select(func.count(col(Payroll.id)))).one()
    
    recent_joins = session.exec(select(User).order_by(desc(User.created_at)).limit(5)).all()
    
    return {
        "total_employees": total_employees,
        "present_today": present_today,
        "absent_today": absent_today,
        "on_leave_today": leaves_today,
        "pending_leave_requests": pending_leaves,
        "pending_attendance_corrections": pending_corrections,
        "payroll_records": payroll_records,
        "recent_joins": recent_joins
    }

@router.get("/dashboard/activity")
def get_recent_activity(admin_user: User = Depends(require_role("admin")), session: Session = Depends(get_session)):
    activities = []
    
    users = session.exec(select(User).order_by(desc(User.id)).limit(10)).all()
    for u in users:
        activities.append({
            "type": "employee_created",
            "timestamp": u.created_at,
            "description": f"Employee {u.name} joined.",
            "user_id": u.id
        })
        
    leaves = session.exec(select(LeaveRequest).order_by(desc(LeaveRequest.id)).limit(10)).all()
    for l in leaves:
        user = session.get(User, l.user_id)
        name = user.name if user else "Unknown"
        activities.append({
            "type": f"leave_{l.status}",
            "timestamp": user.created_at if user else l.start_date,
            "description": f"{name} leave request is {l.status}.",
            "user_id": l.user_id
        })
        
    corrections = session.exec(select(CorrectionRequest).order_by(desc(CorrectionRequest.id)).limit(10)).all()
    for c in corrections:
        user = session.get(User, c.user_id)
        name = user.name if user else "Unknown"
        activities.append({
            "type": f"attendance_correction_{c.status}",
            "timestamp": user.created_at if user else datetime.min,
            "description": f"{name} attendance correction is {c.status}.",
            "user_id": c.user_id
        })
        
    payrolls = session.exec(select(Payroll).order_by(desc(Payroll.updated_at)).limit(10)).all()
    for p in payrolls:
        user = session.get(User, p.user_id)
        name = user.name if user else "Unknown"
        activities.append({
            "type": "salary_updated",
            "timestamp": p.updated_at,
            "description": f"{name}'s payroll updated.",
            "user_id": p.user_id
        })
        
    def get_time(a):
        ts = a["timestamp"]
        if isinstance(ts, datetime): return ts
        if isinstance(ts, date): return datetime.combine(ts, datetime.min.time())
        return datetime.min

    activities.sort(key=get_time, reverse=True)
    return activities[:20]

@router.get("/employees")
def list_employees(
    search: Optional[str] = None,
    department: Optional[str] = None,
    designation: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    sort_by: str = "name",
    admin_user: User = Depends(require_role("admin")), 
    session: Session = Depends(get_session)
):
    query = select(User)
    
    if search:
        query = query.where((col(User.name).contains(search)) | (col(User.employee_id).contains(search)))
    if department:
        query = query.where(User.department == department)
    if designation:
        query = query.where(User.designation == designation)
    if status:
        query = query.where(User.status == status)
        
    if sort_by == "name":
        query = query.order_by(User.name)
    elif sort_by == "created_at":
        query = query.order_by(desc(User.created_at))
        
    total = session.exec(select(func.count(col())).select_from(query.subquery())).one()
    employees = session.exec(query.offset(skip).limit(limit)).all()
    
    return {
        "total": total,
        "items": employees
    }

@router.get("/employees/{employee_id}/overview")
def get_employee_overview(employee_id: int, admin_user: User = Depends(require_role("admin")), session: Session = Depends(get_session)):
    user = session.get(User, employee_id)
    if not user:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    attendances = session.exec(select(Attendance).where(Attendance.user_id == employee_id)).all()
    present_days = sum(1 for a in attendances if a.status.startswith("present"))
    absent_days = sum(1 for a in attendances if a.status == "absent")
    
    leaves = session.exec(select(LeaveRequest).where(LeaveRequest.user_id == employee_id)).all()
    approved_leaves = sum(1 for l in leaves if l.status == "approved")
    pending_leaves = sum(1 for l in leaves if l.status == "pending")
    
    payroll = session.exec(select(Payroll).where(Payroll.user_id == employee_id)).first()
    documents = session.exec(select(Document).where(Document.user_id == employee_id)).all()
    
    return {
        "profile": user,
        "attendance_summary": {
            "total_present": present_days,
            "total_absent": absent_days
        },
        "leave_summary": {
            "approved": approved_leaves,
            "pending": pending_leaves
        },
        "payroll_summary": payroll,
        "documents": documents,
        "current_status": user.status
    }
