import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from app.main import app
from app.database import get_session
from app.models import User
from app.auth import get_password_hash

from sqlalchemy.pool import StaticPool

sqlite_url = "sqlite:///:memory:"
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False}, poolclass=StaticPool)

@pytest.fixture(name="session")
def session_fixture():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

@pytest.fixture(name="admin_user")
def admin_user_fixture(session: Session):
    user = User(
        employee_id="ADM001",
        name="Admin User",
        email="admin@test.com",
        password_hash=get_password_hash("password123"),
        role="admin"
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@pytest.fixture(name="employee_user")
def employee_user_fixture(session: Session):
    user = User(
        employee_id="EMP001",
        name="Employee User",
        email="employee@test.com",
        password_hash=get_password_hash("password123"),
        role="employee"
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@pytest.fixture(name="admin_token")
def admin_token_fixture(client: TestClient, admin_user: User):
    response = client.post("/auth/login", json={"email": "admin@test.com", "password": "password123"})
    return response.json()["access_token"]

@pytest.fixture(name="employee_token")
def employee_token_fixture(client: TestClient, employee_user: User):
    response = client.post("/auth/login", json={"email": "employee@test.com", "password": "password123"})
    return response.json()["access_token"]
