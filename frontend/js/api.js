import { API_BASE_URL } from "./config.js";

async function handleResponse(response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || `İstek başarısız: ${response.status}`);
    }
  return response.status === 204 ? null : response.json();
    } 

export async function getBooks() {
  const response = await fetch(`${API_BASE_URL}/books/`);
  return handleResponse(response);   
}

export async function createBook(bookData) {
  const response = await fetch (`${API_BASE_URL}/books/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
    });
   return handleResponse(response);
} 

export async function updateBook(id, bookData) {
  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  });
  return handleResponse(response);
}

export async function deleteBook(id) {
  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
} 