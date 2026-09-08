# 📚 Booklib

A minimal, warm, and cozy personal library app for tracking your books.

![Python](https://img.shields.io/badge/Python-3.12-A78BC7?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square)

> "A room without books is like a body without a soul." — Cicero

---

## ✨ Features

- 📖 Full CRUD: add, edit, and delete books
- 📌 Status tracking: To Read / Reading / Finished
- 🐾 5-paw rating system for finished books
- 🔍 Instant, debounced search by title/author
- ⇅ Sorting: Newest / Title (A-Z) / Rating
- 📊 Live stat counters (total, finished, reading)
- 🎨 Automatic pastel color-coding by genre
- 🖋️ Deterministic colored initial-letter avatars instead of cover images
- 🌸 Pinterest-style masonry grid, pastel lilac theme

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML / CSS / JavaScript (ES Modules) |
| Backend | Python 3.12, FastAPI, Motor (async MongoDB driver) |
| Database | MongoDB 7 |
| Frontend Serving | Nginx (Alpine) |
| Orchestration | Docker & Docker Compose |

## 📂 Project Structure

```text
cozy-book-tracker/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
├── backend/
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py # Application entry point
│       ├── config.py # Environment variables management
│       ├── database.py # MongoDB connection
│       ├── models.py # Pydantic schemas
│       └── routers/
│           └── books.py # CRUD endpoints
└── frontend/
    ├── Dockerfile
    ├── index.html
    ├── assets/favicon.svg
    ├── css/
    │   ├── variables.css # Design tokens
    │   ├── base.css # Reset & typography
    │   ├── components.css # Component styles
    │   └── style.css # Page layout
    └── js/
        ├── config.js # API configuration
        ├── api.js # Backend communication
        ├── render.js # DOM rendering
        ├── sort.js # Sorting logic
        ├── utils.js # Debounce & helpers
        ├── toast.js # Toast notifications
        └── main.js # Application orchestration