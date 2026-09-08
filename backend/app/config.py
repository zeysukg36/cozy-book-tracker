import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "cozy_books")
    APP_ENV: str = os.getenv("APP_ENV", "development")

settings = Settings() 