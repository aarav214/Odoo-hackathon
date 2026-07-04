<div align="center">

# 💼 Human Resource Management System (HRMS)

### Every Workday, Perfectly Aligned.

A modern, high-performance Human Resource Management System designed to streamline employee management, attendance, leave requests, payroll visibility, and approval workflows. Crafted with an elegant and warm user interface inspired by premium SaaS products.

![Status](https://img.shields.io/badge/Status-Development-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Web-success?style=for-the-badge)

</div>

---

# 📖 Overview

The **Human Resource Management System (HRMS)** is a centralized web application built to simplify day-to-day HR operations. 

It enables organizations to efficiently manage employee information, log attendance (with offline sync), request leaves, view payroll detail, and execute approval workflows. Built with a role-based security model, it empowers employees with personal dashboards while providing administrators with rich monitoring and configuration controls.

---

# 🎨 UI Design & Theme: Professional Cappuccino

The user interface follows a modern Enterprise SaaS design inspired by Apple, Stripe, Linear, BambooHR, and Rippling, featuring a bespoke **Professional Cappuccino** theme:

*   **Warm Neutral Palette:** Uses custom cream backgrounds (`#F5F0E8`), soft border tones (`#E8DFD3`), and warm chocolate accents (`#A0785A`).
*   **Aesthetics:** Integrated glassmorphism, soft shadows, and clean layouts using a blend of **Inter** (sans-serif) and **Fraunces** (serif) typography.
*   **Responsive Motion:** Custom animations (fade-in, scale-in, count-up, SVG draw transitions) that react dynamically to user hover actions and page load.

---

# 🛡️ High-Impact Security & Features

### 🔗 Immutable Audit Ledger
A standout security feature in the backend. Sensitive administrative actions—such as modifying salary structures or impersonating employees—generate a cryptographic chain of ledger entries. Each entry contains a SHA-256 hash of its details, linked with the hash of the preceding entry. The chain can be computationally verified at any time to guarantee that logs have not been tampered with.

### 👥 Admin Impersonation
Administrators can temporarily impersonate any employee account to assist with troubleshooting, viewing their exact dashboard, and verifying credentials. This activity is strictly monitored and automatically creates an entry in the Immutable Audit Ledger.

### 📶 Offline Sync Capabilities
Allows employees to log their daily attendance status even during network outages. The system caches the local timestamps and GPS coordinates (latitude/longitude) and automatically synchronizes them once the connection to the server is re-established.

---

# 🛠️ Tech Stack

### Frontend
*   **Framework & Language:** React.js (v18) with TypeScript
*   **Build Tooling:** Vite (for fast hot-module replacement)
*   **Styling:** Tailwind CSS (utility-first styles) combined with custom CSS theme variables
*   **Icons:** Lucide React

### Backend
*   **Framework:** FastAPI (Python 3.9+)
*   **ORM / Database Access:** SQLModel (unifying SQLAlchemy and Pydantic)
*   **Database:** SQLite (local file-based storage: `database.db`)
*   **Authentication:** JWT (JSON Web Tokens) with Secure Password Hashing

---

# 🏗️ Repository Structure

```text
HRMS /
├── backend/
│   ├── app/
│   │   ├── routes/          # API Route Controllers (attendance, audit, leave, payroll, etc.)
│   │   ├── auth.py          # JWT, Passwords & Role-Based Access Control (RBAC)
│   │   ├── database.py      # SQLite connection & session generator
│   │   ├── main.py          # FastAPI application entrypoint
│   │   └── models.py        # SQLModel Database Schemas & validation models
│   ├── requirements.txt     # Python backend dependencies
│   ├── seed.py              # Automatic database seeder
│   └── database.db          # SQLite Database (generated on startup)
│
├── frontend/
│   ├── HR/Admin/            # HR & Admin Dashboard Portal
│   │   ├── src/
│   │   │   ├── components/  # Admin UI components (AttendanceCard, EmployeeManagementCard, etc.)
│   │   │   ├── App.tsx      # Main admin dashboard layout
│   │   │   ├── index.css    # Cappuccino theme styles
│   │   │   └── main.tsx     # Frontend renderer entrypoint
│   │   ├── package.json     # Node.js dependencies
│   │   └── vite.config.ts   # Vite config
│   │
│   └── employee/            # Employee Portal (Login & Action Portal)
│       ├── src/
│       │   ├── components/  # Employee UI components (LeaveCard, PayrollCard, DocumentsCard, etc.)
│       │   ├── App.tsx      # Main employee portal dashboard layout
│       │   ├── index.css    # Cappuccino theme styles
│       │   └── main.tsx     # Frontend renderer entrypoint
│       ├── package.json     # Node.js dependencies
│       └── vite.config.ts   # Vite config
```

---

# 🚀 Getting Started

Follow these steps to run the HRMS application locally on your machine.

## 1. Backend Setup (FastAPI)

1.  Navigate into the `backend` directory:
    ```bash
    cd backend
    ```
2.  Set up and activate a Python virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate
    ```
3.  Install the required packages:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the development server:
    ```bash
    uvicorn app.main:app --reload
    ```
    *   **API Endpoint:** `http://127.0.0.1:8000`
    *   **Interactive Swagger UI:** `http://127.0.0.1:8000/docs`

> [!NOTE]
> The database will be automatically created and populated with demo accounts on first startup.

## 2. Admin Portal Setup (`frontend/HR/Admin`)

1.  Navigate into the `frontend/HR/Admin` directory:
    ```bash
    cd frontend/HR/Admin
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the local development server:
    ```bash
    npm run dev
    ```
    *   **Admin App Endpoint:** `http://localhost:5173` (or as displayed in your terminal output)

## 3. Employee Portal Setup (`frontend/employee`)

1.  Navigate into the `frontend/employee` directory:
    ```bash
    cd frontend/employee
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the local development server:
    ```bash
    npm run dev -- --port 5174
    ```
    *   **Employee App Endpoint:** `http://localhost:5174` (running on port 5174 to avoid conflict with the admin portal)


---

# 📊 Demo Accounts & Seed Data

The database is seeded automatically with the following accounts for test runs:

### HR / Admin Role
*   **Employee ID:** `ADM001`
*   **Email:** `admin@example.com`
*   **Password:** `admin123`

### Employee Role
Four dummy employees are seeded (`EMP001` to `EMP004`). All of them share the same default password:
*   **Emails:** `emp1@example.com`, `emp2@example.com`, `emp3@example.com`, `emp4@example.com`
*   **Password:** `emp123`

---

# 📸 Dashboards & Previews

> [!TIP]
> Make sure the FastAPI backend is running so the frontend cards can load and query dynamic statistics.

*   **Employee Profile & Dashboard:** Displays checklist progress, basic credentials, and department status.
*   **Attendance Tracking:** Record check-in / check-out actions, track weekly hours, and view historical sessions.
*   **Leave Management:** Request leaves (`Paid`, `Sick`, `Unpaid`) and track status updates from administrators.
*   **Payroll & Salary Overview:** Detailed monthly salary statements, including housing/transport allowances and tax deductions.

---

# 🤝 Contributing

Contributions, bug reports, and suggestions are welcome! Feel free to open a Pull Request or file an issue to help improve the Human Resource Management System.

---

# 📄 License

This project is licensed under the MIT License.

---

<div align="center">

Made with ❤️ to simplify Human Resource Management.

</div>
