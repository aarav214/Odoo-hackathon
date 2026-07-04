# HRMS Backend API Documentation

All routes require a valid `Bearer Token` passed in the `Authorization` header unless otherwise specified (like `/auth/login`, `/auth/signup`, and `/health`).

**Base URL**: `http://127.0.0.1:8000`

---

## Health
### `GET /health`
Returns a simple health check status.
- **Response**: `{"status": "ok"}`

---

## Authentication (`/auth`)

### `POST /auth/signup`
Creates a new user.
- **Body**: `employee_id`, `name`, `email`, `password`, `role` ("admin" | "employee")
- **Response**: JWT `access_token` and `token_type`

### `POST /auth/login`
Authenticates a user.
- **Body**: `email`, `password`
- **Response**: JWT `access_token` and `token_type`

---

## Admin (`/admin`)

### `GET /admin/dashboard/summary`
Fetches a high-level statistical summary for the admin dashboard (total employees, attendance counts, pending leaves/corrections).
- **Role Required**: `admin`

### `GET /admin/dashboard/activity`
Fetches a chronological feed of recent company activities (e.g., employee creations, leaves, corrections, payroll updates).
- **Role Required**: `admin`

### `GET /admin/employees`
Lists all employees with support for search, filtering, pagination, and sorting.
- **Role Required**: `admin`
- **Query Parameters**: `search`, `department`, `designation`, `status`, `skip`, `limit`, `sort_by`

### `GET /admin/employees/{employee_id}/overview`
Fetches a comprehensive overview for a specific employee, including their profile, attendance summary, leave summary, payroll, and documents.
- **Role Required**: `admin`

### `POST /admin/impersonate/{user_id}`
Allows an Admin to impersonate an employee. Automatically writes to the **Audit Ledger**.
- **Role Required**: `admin`
- **Response**: Short-lived JWT `access_token` scoped as the target user.

---

## Profile (`/profile`)

### `GET /profile/me`
Fetches the currently authenticated user's profile.

### `PATCH /profile/me`
Updates the current user's profile.
- **Body**: `name` (optional), `email` (optional)

### `GET /profile/{user_id}`
Fetches any user's profile.
- **Role Required**: `admin`

### `PATCH /profile/{user_id}`
Updates any user's profile (including role, employee_id, and details).
- **Role Required**: `admin`
- **Body**: `name`, `email`, `role`, `employee_id`, `department`, `designation`, `status` (all optional)

---

## Documents (`/documents`)

### `POST /documents/upload`
Uploads a document for the current user.
- **Form Data**: `doc_type` (string), `file` (UploadFile)

### `GET /documents/{user_id}`
Fetches all uploaded documents for a specific user.
- **Access**: The target `user_id` themselves, or an `admin`.

### `GET /documents/{doc_id}/download`
Downloads a specific uploaded document.
- **Access**: The target document's owner, or an `admin`.
- **Response**: File stream.

---

## Onboarding (`/onboarding`)

### `GET /onboarding/{user_id}`
Fetches the checklist items for a user, ordered sequentially.
- **Access**: The target `user_id` themselves, or an `admin`.

### `PATCH /onboarding/{item_id}`
Toggles the `done` status of a specific checklist item.
- **Access**: The owner of the checklist item, or an `admin`.

---

## Attendance (`/attendance`)

### `POST /attendance/check-in`
Logs a check-in for the current day.
- **Body**: `lat` (optional float), `lng` (optional float)
- **Response**: 422 Error if already checked in today.

### `POST /attendance/check-out`
Logs a check-out for the current day.
- **Response**: 422 Error if not checked in, or already checked out today.

### `GET /attendance/me`
Fetches the attendance records for the current user.

### `GET /attendance/all`
Fetches all attendance records across the company.
- **Role Required**: `admin`
- **Query Parameters**: `user_id` (optional, to filter records for a specific employee)

### `POST /attendance/sync-offline`
Synchronizes an array of offline check-ins/check-outs.
- **Body**: Array of `{"timestamp": str, "type": "check-in" | "check-out", "lat": float, "lng": float}`
- **Response**: Number of synced records.

---

## Corrections (`/corrections`)

### `POST /corrections/`
Submits a correction request for an attendance record.
- **Body**: `attendance_id`, `requested_change`, `reason`

### `GET /corrections/`
Fetches correction requests.
- **Access**: If `admin`, returns ALL requests (can be filtered by `user_id` query param). If `employee`, returns only their own.
- **Query Parameters**: `user_id` (optional, admin only)

### `PATCH /corrections/{id}/decide`
Approves or rejects a correction request.
- **Role Required**: `admin`
- **Body**: `status` ("approved" | "rejected"), `comment`

---

## Leave (`/leave`)

### `POST /leave/`
Submits a new leave request.
- **Body**: `leave_type` ("paid"|"sick"|"unpaid"), `start_date`, `end_date`, `remarks`

### `GET /leave/`
Fetches leave requests.
- **Access**: If `admin`, returns ALL requests (can be filtered by `user_id` query param). If `employee`, returns only their own.
- **Query Parameters**: `user_id` (optional, admin only)

### `PATCH /leave/{id}/decide`
Approves or rejects a leave request.
- **Role Required**: `admin`
- **Body**: `status` ("approved" | "rejected"), `comment`

---

## Payroll (`/payroll`)

### `GET /payroll/me`
Fetches the current user's payroll data.

### `GET /payroll/{user_id}`
Fetches payroll data for a specific user.
- **Role Required**: `admin`

### `PATCH /payroll/{user_id}`
Creates or updates a user's payroll data. Automatically writes to the **Audit Ledger**.
- **Role Required**: `admin`
- **Body**: `base_salary`, `allowances_json`, `deductions_json`

---

## Audit Ledger (`/audit`)

### `GET /audit/log`
Returns the raw list of all audit entries.
- **Role Required**: `admin`

### `GET /audit/verify`
Walks the entire audit ledger sequentially, recomputes the SHA256 hashes computationally, and verifies that the database has not been tampered with.
- **Role Required**: `admin`
- **Response**: `{"valid": bool, "first_broken_id": int | null}`
