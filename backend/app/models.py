from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime, date, timezone

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: str = Field(unique=True, index=True)
    name: str
    email: str = Field(unique=True, index=True)
    password_hash: str
    role: str # "admin" | "employee"
    department: Optional[str] = None
    designation: Optional[str] = None
    status: str = Field(default="active") # "active" | "inactive" | "on_leave"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Document(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    filename: str
    filepath: str
    doc_type: str
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChecklistItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    task: str
    done: bool = Field(default=False)
    order: int

class Attendance(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    date: date
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    status: str # "present"|"absent"|"half_day"|"leave"
    lat: Optional[float] = None
    lng: Optional[float] = None
    synced_offline: bool = Field(default=False)

class CorrectionRequest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    attendance_id: int = Field(foreign_key="attendance.id")
    requested_change: str
    reason: str
    status: str = Field(default="pending") # "pending"|"approved"|"rejected"
    admin_comment: Optional[str] = None

class LeaveRequest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    leave_type: str # "paid"|"sick"|"unpaid"
    start_date: date
    end_date: date
    remarks: Optional[str] = None
    status: str = Field(default="pending") # "pending"|"approved"|"rejected"
    admin_comment: Optional[str] = None

class Payroll(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    base_salary: float
    allowances_json: str
    deductions_json: str
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AuditLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    prev_hash: str
    hash: str
    actor_id: int = Field(foreign_key="user.id")
    action: str
    target_user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    payload_json: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Notification(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    recipient_id: int = Field(foreign_key="user.id")
    title: str
    message: str
    notification_type: str
    reference_type: Optional[str] = None
    reference_id: Optional[int] = None
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
