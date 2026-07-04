def test_get_notifications(client, employee_token):
    response = client.get("/notifications/", headers={"Authorization": f"Bearer {employee_token}"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_unread_count(client, employee_token):
    response = client.get("/notifications/unread-count", headers={"Authorization": f"Bearer {employee_token}"})
    assert response.status_code == 200
    assert "unread_count" in response.json()

def test_mark_all_read(client, employee_token):
    response = client.patch("/notifications/read-all", headers={"Authorization": f"Bearer {employee_token}"})
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_mark_specific_read_not_found(client, employee_token):
    response = client.patch("/notifications/9999/read", headers={"Authorization": f"Bearer {employee_token}"})
    assert response.status_code == 404
