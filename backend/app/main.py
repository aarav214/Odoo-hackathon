from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from datetime import timedelta

from .database import create_db_and_tables, get_session
from .auth import router as auth_router, get_current_user, require_role, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from .models import User
from .routes.audit import write_audit_entry

from .routes.profile import router as profile_router
from .routes.documents import router as documents_router
from .routes.onboarding import router as onboarding_router
from .routes.attendance import router as attendance_router
from .routes.corrections import router as corrections_router
from .routes.leave import router as leave_router
from .routes.payroll import router as payroll_router
from .routes.audit import router as audit_router
from .routes.admin import router as admin_router
from .routes.analytics import router as analytics_router
from .routes.notifications import router as notifications_router
from .routes.salary import router as salary_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="HRMS MVP", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(documents_router)
app.include_router(onboarding_router)
app.include_router(attendance_router)
app.include_router(corrections_router)
app.include_router(leave_router)
app.include_router(payroll_router)
app.include_router(audit_router)
app.include_router(admin_router)
app.include_router(analytics_router)
app.include_router(notifications_router)
app.include_router(salary_router)

@app.post("/admin/impersonate/{user_id}", tags=["admin"])
def impersonate(user_id: int, admin_user: User = Depends(require_role("admin")), session: Session = Depends(get_session)):
    target_user = session.get(User, user_id)
    if not target_user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")
        
    write_audit_entry(
        session=session,
        actor_id=admin_user.id or 0,
        action="impersonation_start",
        target_user_id=user_id,
        payload={"reason": "Admin impersonation"}
    )
    
    access_token = create_access_token(
        data={"sub": str(target_user.id), "role": target_user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
