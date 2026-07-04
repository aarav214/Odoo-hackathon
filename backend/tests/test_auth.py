def test_login_success(client, admin_user):
    # Relies on the user created in conftest
    response = client.post("/auth/login", json={"email": "admin@test.com", "password": "password123"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_failure(client, admin_user):
    response = client.post("/auth/login", json={"email": "admin@test.com", "password": "wrongpassword"})
    assert response.status_code == 401

def test_protected_endpoint_rejects_unauthenticated(client):
    response = client.get("/analytics/dashboard")
    assert response.status_code == 401

def test_employee_token_cannot_access_admin(client, employee_token):
    headers = {"Authorization": f"Bearer {employee_token}"}
    response = client.get("/analytics/dashboard", headers=headers)
    assert response.status_code == 403

def test_admin_token_accesses_admin(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.get("/analytics/dashboard", headers=headers)
    assert response.status_code == 200
