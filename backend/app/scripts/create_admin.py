"""Create the first production administrator from environment variables.

Run once from the backend service shell; this command never ships a password in code.
"""
import asyncio
import os

from sqlalchemy import select

from app.core.database import AsyncSessionLocal, init_db
from app.core.security import get_password_hash
from app.models.user import User, UserRole


async def create_admin() -> None:
    email = os.getenv("ADMIN_EMAIL", "").strip().lower()
    password = os.getenv("ADMIN_PASSWORD", "")
    full_name = os.getenv("ADMIN_FULL_NAME", "Platform Administrator").strip()

    if not email or not password:
        raise RuntimeError("Set ADMIN_EMAIL and ADMIN_PASSWORD before running this command.")
    if len(password) < 12:
        raise RuntimeError("ADMIN_PASSWORD must be at least 12 characters long.")

    await init_db()
    async with AsyncSessionLocal() as session:
        existing = (await session.execute(select(User).where(User.email == email))).scalars().first()
        if existing:
            raise RuntimeError("An account with ADMIN_EMAIL already exists; no changes were made.")

        session.add(User(
            email=email,
            hashed_password=get_password_hash(password),
            full_name=full_name,
            role=UserRole.ADMIN,
            is_verified=True,
            is_active=True,
        ))
        await session.commit()


if __name__ == "__main__":
    asyncio.run(create_admin())
