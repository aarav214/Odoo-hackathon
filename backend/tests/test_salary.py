def test_salary_history_admin(client, admin_token):
    response = client.get("/salary/history/1", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_salary_history_employee_fails(client, employee_token):
    response = client.get("/salary/history/1", headers={"Authorization": f"Bearer {employee_token}"})
    assert response.status_code == 403
