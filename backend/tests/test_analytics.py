def test_dashboard_admin(client, admin_token):
    response = client.get("/analytics/dashboard", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    data = response.json()
    assert "total_employees" in data
    assert "present_today" in data
    assert "absent_today" in data

def test_dashboard_employee_fails(client, employee_token):
    response = client.get("/analytics/dashboard", headers={"Authorization": f"Bearer {employee_token}"})
    assert response.status_code == 403

def test_forecast_admin(client, admin_token):
    response = client.get("/analytics/forecast", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    data = response.json()
    assert "generated_timestamp" in data
    assert "forecast" in data
    assert len(data["forecast"]) == 7
