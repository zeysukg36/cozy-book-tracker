from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class ReadStatus(str, Enum):
    to_read = "to_read"
    reading = "reading"
    finished = "finished"


class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    author: str = Field(..., min_length=1, max_length=100)
    genre: Optional[str] = Field(default=None, max_length=50)
    status: ReadStatus = Field(default=ReadStatus.to_read)
    rating: Optional[int] = Field(default=None, ge=1, le=5)


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    genre: Optional[str] = None
    status: Optional[ReadStatus] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)


class BookResponse(BookBase):
    id: str
    created_at: datetime 