import os
import re

def fix_admin():
    with open('app/routes/admin.py', 'r') as f:
        content = f.read()

    # count
    content = re.sub(r'func\.count\((.*?)\)', r'func.count(col(\1))', content)
    # desc
    content = re.sub(r'User\.created_at\.desc\(\)', r'desc(User.created_at)', content)
    content = re.sub(r'User\.id\.desc\(\)', r'desc(User.id)', content)
    content = re.sub(r'LeaveRequest\.id\.desc\(\)', r'desc(LeaveRequest.id)', content)
    content = re.sub(r'CorrectionRequest\.id\.desc\(\)', r'desc(CorrectionRequest.id)', content)
    content = re.sub(r'Payroll\.updated_at\.desc\(\)', r'desc(Payroll.updated_at)', content)
    # contains
    content = re.sub(r'User\.name\.contains', r'col(User.name).contains', content)
    content = re.sub(r'User\.employee_id\.contains', r'col(User.employee_id).contains', content)

    with open('app/routes/admin.py', 'w') as f:
        f.write(content)

def fix_attendance():
    with open('app/routes/attendance.py', 'r') as f:
        content = f.read()
    content = content.replace('from sqlmodel import Session, select', 'from sqlmodel import Session, select, col')
    content = content.replace('Attendance.date', 'col(Attendance.date)')
    content = content.replace('user_id=current_user.id,', 'user_id=current_user.id or 0,')
    content = content.replace('from datetime import datetime, date', 'from datetime import datetime, date, timezone')
    content = content.replace('datetime.utcnow()', 'datetime.now(timezone.utc)')
    with open('app/routes/attendance.py', 'w') as f:
        f.write(content)

def fix_models():
    with open('app/models.py', 'r') as f:
        content = f.read()
    content = content.replace('from datetime import datetime, date', 'from datetime import datetime, date, timezone')
    content = content.replace('datetime.utcnow', 'lambda: datetime.now(timezone.utc)')
    with open('app/models.py', 'w') as f:
        f.write(content)

def fix_main():
    with open('app/main.py', 'r') as f:
        content = f.read()
    
    # fix impersonate actor_id
    content = content.replace('actor_id=admin_user.id,', 'actor_id=admin_user.id or 0,')
    
    # fix lifespan
    if 'lifespan' not in content:
        content = content.replace('from fastapi import FastAPI, Depends', 'from fastapi import FastAPI, Depends\nfrom contextlib import asynccontextmanager')
        lifespan_code = """
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="HRMS MVP", lifespan=lifespan)
"""
        content = re.sub(r'app = FastAPI\(title="HRMS MVP"\)\n\napp\.add_middleware\(', lifespan_code + '\napp.add_middleware(', content)
        content = re.sub(r'@app\.on_event\("startup"\)\ndef on_startup\(\):\n    create_db_and_tables\(\)\n\n', '', content)

    with open('app/main.py', 'w') as f:
        f.write(content)
        
def fix_auth():
    with open('app/auth.py', 'r') as f:
        content = f.read()
    content = content.replace('from datetime import datetime, timedelta', 'from datetime import datetime, timedelta, timezone')
    content = content.replace('datetime.utcnow()', 'datetime.now(timezone.utc)')
    with open('app/auth.py', 'w') as f:
        f.write(content)
        
def fix_others():
    for file in ['app/routes/corrections.py', 'app/routes/leave.py', 'app/routes/documents.py']:
        with open(file, 'r') as f:
            content = f.read()
        content = content.replace('user_id=current_user.id,', 'user_id=current_user.id or 0,')
        if file == 'app/routes/documents.py':
            content = content.replace('filename=file.filename,', 'filename=file.filename or "",')
        with open(file, 'w') as f:
            f.write(content)

    with open('app/routes/profile.py', 'r') as f:
        content = f.read()
    content = content.replace('.dict(', '.model_dump(')
    with open('app/routes/profile.py', 'w') as f:
        f.write(content)

    with open('app/routes/payroll.py', 'r') as f:
        content = f.read()
    content = content.replace('from datetime import datetime', 'from datetime import datetime, timezone')
    content = content.replace('datetime.utcnow()', 'datetime.now(timezone.utc)')
    with open('app/routes/payroll.py', 'w') as f:
        f.write(content)

if __name__ == "__main__":
    fix_admin()
    fix_attendance()
    fix_models()
    fix_main()
    fix_auth()
    fix_others()
    print("Fixes applied.")
