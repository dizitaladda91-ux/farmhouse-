import os

# Tests must never inherit a deployment database URL from the shell or host.
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///./test_farmhouse.db"
os.environ["ENVIRONMENT"] = "test"
os.environ["DEBUG"] = "false"

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import init_db


@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_properties_list():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/properties")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] >= 0


@pytest.mark.asyncio
async def test_smart_search_parser():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/search/smart?q=Farmhouse+near+Delhi+under+3+crore+with+swimming+pool")
    assert response.status_code == 200
    parsed = response.json()["parsed"]
    assert parsed["property_type"] == "Farmhouse"
    assert parsed["max_price"] == 30000000.0
    assert parsed["location_keyword"] == "delhi"
