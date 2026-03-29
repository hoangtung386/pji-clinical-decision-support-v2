"""Create all tables and seed admin user."""
import asyncio

from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import settings
from app.db.base import Base
from app.models import *  # noqa: F401, F403


async def init_db() -> None:
    engine = create_async_engine(settings.database_url, echo=True)
    async with engine.begin() as conn:
        # Drop all tables and recreate fresh (one-time reset)
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    await engine.dispose()
    print("Database reset and tables created successfully.")


if __name__ == "__main__":
    asyncio.run(init_db())
