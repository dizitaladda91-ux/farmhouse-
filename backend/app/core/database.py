import logging
from typing import AsyncGenerator
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine
)
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

logger = logging.getLogger(__name__)

# Normalize sqlite database URL if needed
db_url = settings.DATABASE_URL
connect_args = {}
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Neon supplies libpq parameters (sslmode/channel_binding), while asyncpg expects
# TLS through its `ssl` connection argument. Preserve all other URL parameters.
if db_url.startswith("postgresql+asyncpg://"):
    parsed_url = make_url(db_url)
    ssl_mode = parsed_url.query.get("sslmode")
    if ssl_mode:
        filtered_query = {
            key: value
            for key, value in parsed_url.query.items()
            if key not in {"sslmode", "channel_binding"}
        }
        db_url = parsed_url.set(query=filtered_query).render_as_string(hide_password=False)
        if ssl_mode.lower() in {"require", "verify-ca", "verify-full"}:
            connect_args["ssl"] = "require"

engine = create_async_engine(
    db_url,
    echo=settings.DEBUG,
    future=True,
    connect_args=connect_args,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    class_=AsyncSession,
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            raise e
        finally:
            await session.close()


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
