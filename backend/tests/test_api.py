from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_reports_mock_provider():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["provider"] == "mock"


def test_google_login_discloses_missing_setup():
    config = client.get("/api/auth/google/config")
    assert config.status_code == 200 and config.json()["enabled"] is False
    response = client.get("/api/auth/google", follow_redirects=False)
    assert response.status_code == 303
    assert "google_error=not_configured" in response.headers["location"]


def test_google_authorization_uses_signed_state_cookie(monkeypatch):
    from urllib.parse import parse_qs, urlparse
    from app import main
    monkeypatch.setattr(main.settings, "google_client_id", "demo-client-id")
    monkeypatch.setattr(main.settings, "google_client_secret", "demo-client-secret")
    response = client.get("/api/auth/google", follow_redirects=False)
    assert response.status_code == 302
    authorization = parse_qs(urlparse(response.headers["location"]).query)
    assert authorization["client_id"] == ["demo-client-id"]
    assert authorization["scope"] == ["openid email profile"]
    cookie = response.headers["set-cookie"].lower()
    assert "httponly" in cookie and "samesite=lax" in cookie
    denied = client.get("/api/auth/google/callback?state=wrong&code=fake", follow_redirects=False)
    assert denied.status_code == 303
    assert "google_error=login_failed" in denied.headers["location"]


def test_google_login_reports_setup_state_without_credentials():
    config = client.get("/api/auth/google/config")
    assert config.status_code == 200
    assert config.json()["enabled"] is False
    response = client.get("/api/auth/google", follow_redirects=False)
    assert response.status_code == 303
    assert "google_error=not_configured" in response.headers["location"]


def test_interviews_require_authentication():
    assert client.get("/api/interviews").status_code == 401


def test_registration_login_and_interview_flow():
    import uuid
    email = f"{uuid.uuid4().hex}@example.com"
    registered = client.post("/api/auth/register", json={"email": email, "password": "a-strong-passphrase"})
    assert registered.status_code == 201
    headers = {"Authorization": f"Bearer {registered.json()['access_token']}"}
    created = client.post("/api/interviews", json={"role": "Python Developer", "difficulty": "beginner"}, headers=headers)
    assert created.status_code == 201
    answered = client.post(f"/api/interviews/{created.json()['id']}/answers", json={"answer": "I built a small service and measured its response time."}, headers=headers)
    assert answered.status_code == 200
    assert 0 <= answered.json()["score"] <= 100
    assert set(answered.json()["rubric"]) == {"technical_correctness", "relevance", "clarity", "examples_and_problem_solving"}
    report = client.get(f"/api/interviews/{created.json()['id']}/report", headers=headers)
    assert report.status_code == 200
    pdf = client.get(f"/api/interviews/{created.json()['id']}/report/pdf", headers=headers)
    assert pdf.status_code == 200 and pdf.headers["content-type"] == "application/pdf"


def test_invalid_credentials_and_owner_isolation():
    import uuid
    first = client.post("/api/auth/register", json={"email": f"{uuid.uuid4().hex}@example.com", "password": "a-strong-passphrase"})
    second = client.post("/api/auth/register", json={"email": f"{uuid.uuid4().hex}@example.com", "password": "another-strong-pass"})
    assert first.status_code == second.status_code == 201
    invalid = client.post("/api/auth/login", data={"username": first.json()["email"], "password": "incorrect-password"})
    assert invalid.status_code == 401
    owner_headers = {"Authorization": f"Bearer {first.json()['access_token']}"}
    other_headers = {"Authorization": f"Bearer {second.json()['access_token']}"}
    created = client.post("/api/interviews", json={"role": "Backend Developer", "difficulty": "intermediate"}, headers=owner_headers)
    assert client.get(f"/api/interviews/{created.json()['id']}", headers=other_headers).status_code == 404


def test_resume_upload_rejects_non_pdf():
    import uuid
    auth = client.post("/api/auth/register", json={"email": f"{uuid.uuid4().hex}@example.com", "password": "a-strong-passphrase"})
    headers = {"Authorization": f"Bearer {auth.json()['access_token']}"}
    response = client.post("/api/resumes/extract", headers=headers, files={"file": ("resume.txt", b"not a PDF", "text/plain")})
    assert response.status_code == 415


def test_resume_pdf_text_extraction():
    import uuid
    import fitz
    auth = client.post("/api/auth/register", json={"email": f"{uuid.uuid4().hex}@example.com", "password": "a-strong-passphrase"})
    headers = {"Authorization": f"Bearer {auth.json()['access_token']}"}
    doc = fitz.open()
    doc.new_page().insert_text((72, 72), "Software engineer with Python API database testing project experience")
    pdf_bytes = doc.tobytes()
    doc.close()
    response = client.post("/api/resumes/extract", headers=headers, files={"file": ("resume.pdf", pdf_bytes, "application/pdf")})
    assert response.status_code == 200
    assert "Python" in response.json()["preview"]
