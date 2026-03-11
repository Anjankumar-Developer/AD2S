# SENTRY - AI Profiler

AI-powered system for detecting fake social media profiles using machine learning.

## Architecture

```
├── data/              # Dataset files (users.csv, fusers.csv)
├── ml/                # ML pipeline
│   ├── preprocessing.py   # Data loading, merging, feature engineering
│   ├── train_model.py     # Train RF, SVM, MLP; auto-select best
│   └── evaluate_model.py  # Model evaluation with metrics
├── models/            # Saved trained models + metrics JSON
├── backend/           # FastAPI REST API
│   ├── main.py            # App with /health, /predict, /predictions, /model-metrics
│   ├── database.py        # SQLAlchemy engine, session, ORM base
│   ├── models.py          # Prediction ORM model (SQLite)
│   ├── predictor.py       # Model loading + prediction logic
│   ├── schemas.py         # Pydantic request/response models
│   ├── config.py          # Environment-based configuration
│   └── services/
│       ├── history.py     # Prediction history (persisted in SQLite)
│       └── instagram_fetcher.py  # Instagram profile auto-fetch
├── frontend/          # React + Vite + TypeScript UI
│   └── src/
│       ├── pages/         # Landing, Detection, Analytics pages
│       └── components/    # Navbar, ParticleBackground (Three.js)
├── .env.example       # Environment variable template
├── requirements.txt   # Python dependencies
├── Dockerfile         # Multi-stage Docker build
├── docker-compose.yml # Container orchestration
└── Procfile           # For Render / Railway / Heroku
```

## Quick Start (Local Development)

### 1. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 2. Train the ML model
```bash
python -m ml.train_model
```

### 3. Start the backend API
```bash
python -m uvicorn backend.main:app --port 8000 --reload
```

### 4. Install and start the frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Open browser
Navigate to `http://localhost:5173`

---

## Deployment

### Option A: Docker (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up --build -d

# The app is at http://localhost:8000
```

The Docker build:
1. Builds the React frontend (Node 20)
2. Copies the static build into the Python container
3. FastAPI serves both API and frontend from a single origin

### Option B: Render / Railway / Heroku

1. Push the repo to GitHub
2. Connect the repo to your platform
3. Set build command: `pip install -r requirements.txt && cd frontend && npm ci && npm run build && cd ..`
4. Set start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env.example`

### Option C: Manual Production Build

```bash
# 1. Build the frontend into backend/static/
cd frontend
npm install
npm run build
cd ..

# 2. Start the backend (it auto-serves the frontend)
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

Visit `http://localhost:8000` — both API and UI are served from the same origin.

---

## Database

Predictions are stored in a **SQLite** database (`predictions.db`). The database is created automatically on first startup — no setup needed.

To change the database location, set `DATABASE_URL` in `.env`:
```env
DATABASE_URL=sqlite:///predictions.db
```

---

## API Endpoints

| Method | Endpoint                 | Description                                    |
|--------|--------------------------|------------------------------------------------|
| GET    | /health                  | System health check                           |
| POST   | /predict                 | Analyze a profile (manual input)               |
| POST   | /predict-from-instagram  | **Auto-fetch from Instagram** — pass `{ "username": "..." }` |
| GET    | /predictions             | Prediction history (from database)            |
| GET    | /prediction-stats        | Prediction statistics                         |
| GET    | /model-metrics           | ML model metrics                              |

### Automatic Instagram Detection

The Detection page requires **only an Instagram username or profile URL**. Profile data (followers, following, posts, bio, etc.) is fetched automatically from Instagram — no manual data entry. Pass any of: `username`, `@username`, or `https://instagram.com/username`.

## Tech Stack

- **ML**: Scikit-learn (Random Forest, SVM, MLPClassifier)
- **Backend**: Python, FastAPI, SQLAlchemy, Pydantic, Joblib
- **Frontend**: React, Vite, TypeScript, TailwindCSS, Framer Motion, React Three Fiber, Recharts
- **Database**: SQLite (via SQLAlchemy ORM)
- **Deployment**: Docker, Docker Compose, Procfile
