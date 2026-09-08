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
- 🔖 Status tracking: To Read / Reading / Finished
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



## 🚀 Getting Started

### Requirements
- [Docker](https://www.docker.com/) & Docker Compose

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd cozy-book-tracker

# 2. Copy the environment variable templates
cp .env.example .env
cp backend/.env.example backend/.env

# 3. Open the .env files and replace
#    MONGO_INITDB_ROOT_USERNAME/PASSWORD with your own credentials
#    (make sure backend/.env's MONGO_URI matches the same credentials)

# 4. Spin up the stack
docker compose up --build
```

### Access Points

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |

## 🔧 Environment Variables

**Root `.env`** (for Docker Compose)

| Variable | Description |
|---|---|
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB admin username |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB admin password |
| `MONGO_PORT` | MongoDB host port (default: 27017) |
| `BACKEND_PORT` | Backend host port (default: 8000) |
| `FRONTEND_PORT` | Frontend host port (default: 5173) |

**`backend/.env`** (application runtime)

| Variable | Description |
|---|---|
| `MONGO_URI` | Full MongoDB connection string |
| `DB_NAME` | Database name to use |
| `APP_ENV` | `development` / `production` |

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | API and DB connection status |
| `POST` | `/books/` | Create a new book |
| `GET` | `/books/` | List books (supports `skip`, `limit`) |
| `GET` | `/books/{id}` | Get a single book |
| `PATCH` | `/books/{id}` | Partial update |
| `DELETE` | `/books/{id}` | Delete a book |

Example request:
```bash
curl -X POST http://localhost:8000/books/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Dune","author":"Frank Herbert","genre":"Sci-Fi","status":"reading"}'
```

For interactive testing of all endpoints, use the Swagger UI at `/docs`.

## 💻 Development Notes

- The `volumes: ./backend/app:/app/app` mount in `docker-compose.yml` reflects backend code changes instantly without rebuilding the container.
- To run the backend locally without Docker: `cd backend && source venv/bin/activate && uvicorn app.main:app --reload`
- The frontend is fully static and requires no build step.

## 🗺️ Roadmap (v2.0)

- [ ] Real book cover image upload (file storage integration)
- [ ] Page/percentage progress bar for books in "Reading" status

## 📄 License

This project was developed for personal/portfolio purposes.

---

## 👩‍💻 Author

**Zeynep Karagöz**
Management Information Systems (MIS) Student

- LinkedIn: [linkedin.com/in/zeynepkaragozz](https://www.linkedin.com/in/zeynepkaragozz)
- Email: [zeynepkaragoz3637@gmail.com](mailto:zeynepkaragoz3637@gmail.com)
- GitHub: [github.com/zeysukg36](https://github.com/zeysukg36) 