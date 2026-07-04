import io

def test_ocr_valid_upload(client, employee_token):
    headers = {"Authorization": f"Bearer {employee_token}"}
    
    # Create a dummy file
    file_content = b"fake pdf content"
    file = io.BytesIO(file_content)
    file.name = "document.pdf"
    
    response = client.post(
        "/onboarding/ocr", 
        headers=headers,
        files={"file": ("document.pdf", file, "application/pdf")}
    )
    assert response.status_code == 200
    data = response.json()
    assert "extracted_fields" in data
    assert "confidence" in data
    assert "verification_status" in data
    assert data["verification_status"] == "verified"
    
def test_ocr_invalid_upload(client, employee_token):
    headers = {"Authorization": f"Bearer {employee_token}"}
    # Send post without file
    response = client.post("/onboarding/ocr", headers=headers)
    assert response.status_code == 422 # Validation error
