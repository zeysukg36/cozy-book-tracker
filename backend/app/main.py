from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import ping_database
from app.config import settings
from app.routers import books


app = FastAPI(
    title="Booklib API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],   
)

app.include_router(books.router)

@app.get("/health")

async def health_check():
    db_status = await ping_database()
    return {
        "status": "ok",
        "environment": settings.APP_ENV,
        "database_connected": db_status,
    } 