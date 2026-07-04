import json
from datetime import date
from sqlmodel import Session, select
from app.database import engine, create_db_and_tables
from app.models import User, Attendance, LeaveRequest, Payroll, ChecklistItem
from app.auth import get_password_hash

def seed_data():
    create_db_and_tables()
    with Session(engine) as session:
        if session.exec(select(User)).first():
            print("Database already seeded")
            return
            
        admin = User(
            employee_id="ADM001",
            name="Admin User",
            email="admin@example.com",
            password_hash=get_password_hash("admin123"),
            role="admin"
        )
        session.add(admin)
        
        employees = []
        for i in range(1, 5):
            emp = User(
                employee_id=f"EMP00{i}",
                name=f"Employee {i}",
                email=f"emp{i}@example.com",
                password_hash=get_password_hash("emp123"),
                role="employee"
            )
            session.add(emp)
            employees.append(emp)
            
        session.commit()
        
        emp1 = employees[0]
        
        payroll = Payroll(
            user_id=emp1.id,
            base_salary=50000.0,
            allowances_json=json.dumps({"housing": 5000, "transport": 2000}),
            deductions_json=json.dumps({"tax": 4000})
        )
        session.add(payroll)
        
        items = [
            ChecklistItem(user_id=emp1.id, task="Sign contract", done=True, order=1),
            ChecklistItem(user_id=emp1.id, task="Submit ID", done=False, order=2)
        ]
        session.add_all(items)
        
        leave = LeaveRequest(
            user_id=emp1.id,
            leave_type="paid",
            start_date=date(2023, 10, 1),
            end_date=date(2023, 10, 5),
            status="approved",
            admin_comment="Enjoy your vacation!"
        )
        session.add(leave)
        
        session.commit()
        print("Database seeded successfully")

if __name__ == "__main__":
    seed_data()
