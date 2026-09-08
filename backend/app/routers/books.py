from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime, timezone

from app.database import database
from app.models import BookCreate, BookUpdate, BookResponse

router = APIRouter(prefix="/books", tags=["Books"])
collection = database["books"]


def book_helper(book: dict) -> dict:
    book["id"] = str(book["_id"])
    del book["_id"]
    return book 


def validate_object_id(book_id: str) -> ObjectId:
    try:
        return ObjectId(book_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Geçersiz kitap ID formatı")


@router.post("/", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
async def create_book(book: BookCreate):
    book_dict = book.model_dump()
    book_dict["created_at"] = datetime.now(timezone.utc)
    result = await collection.insert_one(book_dict)
    new_book = await collection.find_one({"_id": result.inserted_id})
    return book_helper(new_book)


@router.get("/", response_model=list[BookResponse])
async def list_books(skip: int = 0, limit: int = 20):
    books = await collection.find().skip(skip).limit(limit).to_list(length=limit)
    return [book_helper(b) for b in books]


@router.get("/{book_id}", response_model=BookResponse)
async def get_book(book_id: str):
    oid = validate_object_id(book_id)
    book = await collection.find_one({"_id": oid})
    if not book:
        raise HTTPException(status_code=404, detail="Kitap bulunamadı")
    return book_helper(book)


@router.patch("/{book_id}", response_model=BookResponse)
async def update_book(book_id: str, book_update: BookUpdate):
    oid = validate_object_id(book_id)
    update_data = {k: v for k, v in book_update.model_dump().items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=400, detail="Güncellenecek alan gönderilmedi")

    result = await collection.update_one({"_id": oid}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Kitap bulunamadı")

    updated_book = await collection.find_one({"_id": oid})
    return book_helper(updated_book)


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(book_id: str):
    oid = validate_object_id(book_id)
    result = await collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail= "Kitap bulunamadı") 