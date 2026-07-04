from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from ..database import get_session
from ..models import User, Attendance, LeaveRequest, CorrectionRequest
from ..auth import require_role
from datetime import date, timedelta, datetime
from pydantic import BaseModel
from typing import Dict, List, Any

router = APIRouter(prefix="/analytics", tags=["analytics"])

class MonthlyAttendanceTrend(BaseModel):
    date: str
    present: int

class DashboardResponse(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int
    employees_on_leave: int
    attendance_percentage: float
    pending_leave_requests: int
    pending_attendance_corrections: int
    department_distribution: Dict[str, int]
    leave_distribution: Dict[str, int]
    monthly_attendance_trend: List[MonthlyAttendanceTrend]

@router.get("/dashboard", response_model=DashboardResponse, summary="Get HR Analytics Dashboard")
def get_dashboard(admin_user: User = Depends(require_role("admin")), session: Session = Depends(get_session)):
    today = date.today()
    
    total_employees = session.exec(select(func.count(User.id)).where(User.role == "employee")).one()
    
    present_today = session.exec(select(func.count(Attendance.id)).where((Attendance.date == today) & (Attendance.status.startswith("present")))).one()
    
    on_leave_today = session.exec(select(func.count(LeaveRequest.id)).where(
        (LeaveRequest.status == "approved") & 
        (LeaveRequest.start_date <= today) & 
        (LeaveRequest.end_date >= today)
    )).one()
    
    absent_today = max(0, total_employees - present_today - on_leave_today)
    
    attendance_percentage = (present_today / total_employees * 100) if total_employees > 0 else 0
    
    pending_leaves = session.exec(select(func.count(LeaveRequest.id)).where(LeaveRequest.status == "pending")).one()
    pending_corrections = session.exec(select(func.count(CorrectionRequest.id)).where(CorrectionRequest.status == "pending")).one()
    
    # Department distribution
    depts = session.exec(select(User.department, func.count(User.id)).where(User.role == "employee").group_by(User.department)).all()
    department_distribution = {d[0] or "Unassigned": d[1] for d in depts}
    
    # Leave distribution
    leaves = session.exec(select(LeaveRequest.leave_type, func.count(LeaveRequest.id)).group_by(LeaveRequest.leave_type)).all()
    leave_distribution = {l[0]: l[1] for l in leaves}
    
    # Monthly attendance trend (last 30 days)
    thirty_days_ago = today - timedelta(days=30)
    trends = session.exec(select(Attendance.date, func.count(Attendance.id)).where((Attendance.date >= thirty_days_ago) & (Attendance.status.startswith("present"))).group_by(Attendance.date)).all()
    monthly_attendance_trend = [{"date": t[0].isoformat(), "present": t[1]} for t in trends]

    return {
        "total_employees": total_employees,
        "present_today": present_today,
        "absent_today": absent_today,
        "employees_on_leave": on_leave_today,
        "attendance_percentage": round(attendance_percentage, 2),
        "pending_leave_requests": pending_leaves,
        "pending_attendance_corrections": pending_corrections,
        "department_distribution": department_distribution,
        "leave_distribution": leave_distribution,
        "monthly_attendance_trend": monthly_attendance_trend
    }

class ForecastDay(BaseModel):
    date: str
    expected_present: int
    expected_absent: int

class ForecastResponse(BaseModel):
    generated_timestamp: str
    forecast: List[ForecastDay]
    predicted_absentee_count_avg: int
    staffing_recommendation: str

@router.get("/forecast", response_model=ForecastResponse, summary="Get Predictive Staffing Forecast")
def get_forecast(admin_user: User = Depends(require_role("admin")), session: Session = Depends(get_session)):
    today = date.today()
    # Simple moving average based on past 14 days
    fourteen_days_ago = today - timedelta(days=14)
    
    past_records = session.exec(select(Attendance.date, func.count(Attendance.id)).where((Attendance.date >= fourteen_days_ago) & (Attendance.status.startswith("present"))).group_by(Attendance.date)).all()
    
    total_employees = session.exec(select(func.count(User.id)).where(User.role == "employee")).one()
    
    if len(past_records) == 0:
        avg_present = 0
    else:
        avg_present = sum([r[1] for r in past_records]) / len(past_records)
        
    avg_absent = max(0, total_employees - avg_present)
    
    forecast = []
    for i in range(1, 8):
        forecast_date = today + timedelta(days=i)
        # simplistic: just use average for next 7 days, could add slight variations or weekday checks
        forecast.append({
            "date": forecast_date.isoformat(),
            "expected_present": int(avg_present),
            "expected_absent": int(avg_absent)
        })
        
    staffing_recommendation = "Optimal"
    if avg_absent > (total_employees * 0.15):
        staffing_recommendation = "High absenteeism predicted. Consider hiring temps or restricting leaves."
        
    return {
        "generated_timestamp": datetime.now().isoformat(),
        "forecast": forecast,
        "predicted_absentee_count_avg": int(avg_absent),
        "staffing_recommendation": staffing_recommendation
    }
