# HRMS Backend (FastAPI MVP)

A lightweight, robust Human Resource Management System (HRMS) backend built for a Hackathon MVP. It uses **FastAPI**, **SQLModel** (for ORM), **SQLite** (for easy local setup), and **JWT** for secure, stateless authentication.

## ✨ Key Features
- **Role-Based Access Control (RBAC):** Distinct roles for `admin` and `employee`.
- **Immutable Audit Ledger:** A standout feature where sensitive actions (like payroll updates and admin impersonations) generate hashed, linked audit log entries. The chain can be verified computationally to detect tampering.
- **Admin Impersonation:** Admins can temporarily log in as other users to debug issues, with the action logged securely in the audit trail.
- **Offline Sync Capabilities:** Supports syncing offline attendance check-ins/outs with the server.
- **Payroll, Leave & Attendance:** Full suites for logging daily attendance, requesting leaves, managing payroll, and handling corrections.

## 🚀 Getting Started

### 1. Requirements
Ensure you have Python 3.9+ installed.

### 2. Installation
Navigate to the `backend` directory, set up your virtual environment, and install dependencies:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Running the Development Server
You can start the FastAPI server via Uvicorn:

```bash
uvicorn app.main:app --reload
```
The API will be available at `http://127.0.0.1:8000`. You can also view the auto-generated interactive Swagger UI at `http://127.0.0.1:8000/docs`.

---

## 🧪 Dummy Data (Seed)

The database is automatically seeded on startup if it's empty (via `seed.py`). The following users and data are available out-of-the-box for testing:

### Admin Account
- **Employee ID:** `ADM001`
- **Name:** Admin User
- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Role:** `admin`

### Employee Accounts
There are 4 seeded employees (`EMP001` to `EMP004`). All share the same default password.
- **Employee IDs:** `EMP001`, `EMP002`, `EMP003`, `EMP004`
- **Emails:** `emp1@example.com`, `emp2@example.com`, `emp3@example.com`, `emp4@example.com`
- **Password:** `emp123`
- **Role:** `employee`

### Seeded Records (For Employee 1 - EMP001)
To help you immediately test the application, `EMP001` has the following pre-populated data:
- **Payroll:** Base salary of `50,000` with JSON allowances (`housing: 5000`, `transport: 2000`) and deductions (`tax: 4000`).
- **Onboarding Checklist:** 
  - *Sign contract* (Done)
  - *Submit ID* (Pending)
- **Leave Request:** Paid leave from `2023-10-01` to `2023-10-05` (Approved, with an admin comment).

---

## 📂 Project Structure

```
backend/
├── app/
│   ├── routes/          # API Route controllers
│   │   ├── attendance.py
│   │   ├── audit.py     # Contains Immutable Ledger logic
│   │   ├── corrections.py
│   │   ├── documents.py
│   │   ├── leave.py
│   │   ├── onboarding.py
│   │   ├── payroll.py
│   │   └── profile.py
│   ├── auth.py          # JWT, Security, Passwords & RBAC dependencies
│   ├── database.py      # SQLite engine & Session factory
│   ├── main.py          # FastAPI application entrypoint & routing logic
│   └── models.py        # SQLModel (Pydantic + SQLAlchemy) definitions
├── requirements.txt     # Python dependencies
├── seed.py              # Script to populate dummy data
└── database.db          # Auto-generated SQLite Database file
```

For comprehensive details on all the available routes, refer to the [API Documentation](API_DOCS.md) or the Swagger UI (`/docs`).
