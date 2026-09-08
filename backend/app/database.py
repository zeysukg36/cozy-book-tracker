from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.MONGO_URI)
database = client[settings.DB_NAME]

async def ping_database() -> bool:
    try:
        await client.admin.command("ping")
        return True
    except Exception:
        return False 