def test_audit_verify_admin(client, admin_token):
    response = client.get("/audit/verify", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    data = response.json()
    assert "verification_status" in data
    assert "verified_records" in data

def test_audit_verify_employee_fails(client, employee_token):
    response = client.get("/audit/verify", headers={"Authorization": f"Bearer {employee_token}"})
    assert response.status_code == 403
