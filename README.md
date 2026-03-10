# 🤖 AI Data Fetcher Agent

> An AI-powered system that lets users query datasets using plain English. The agent automatically discovers relevant datasets, processes them, and generates structured reports — no SQL or code required.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Example Queries](#example-queries)
- [API Reference](#api-reference)
- [Deployment (Free)](#deployment-free)
- [Contributing](#contributing)

---

## Overview

AI Data Fetcher Agent bridges the gap between raw CSV datasets and actionable insights. A user types a natural language question — the system:

1. Sends the query to **Google Gemini** for intent understanding
2. Uses **FAISS vector search** to find the most semantically relevant dataset
3. Applies **Pandas** filtering and transformation
4. Returns a structured **JSON report** rendered in the React dashboard

---

## Key Features

| Feature | Description |
|---|---|
| 🗣️ Natural Language Queries | Ask questions in plain English |
| 🧠 Gemini AI Understanding | Google Gemini parses intent and extracts filter parameters |
| 🔍 FAISS Vector Search | Semantic similarity search across registered datasets |
| 📂 CSV Dataset Ingestion | Upload and register CSV files as queryable data sources |
| ⚙️ Smart Data Filtering | Automatic Pandas-powered filtering and transformation |
| 📊 Report Generation | Structured JSON reports with summaries, rows and metadata |
| 📡 Live Log Streaming | Real-time backend logs streamed to the frontend |
| 🖥️ React + TS Dashboard | Modern responsive dashboard with charts and export |

---

## Architecture

```
User Query
    ↓
React Frontend Dashboard      (TypeScript + TailwindCSS + Framer Motion)
    ↓
FastAPI Backend API            (Python async REST API)
    ↓
Gemini AI Query Understanding  (Intent parsing + parameter extraction)
    ↓
FAISS Vector Dataset Discovery (Semantic k-NN search over dataset embeddings)
    ↓
Dataset Loader (CSV)           (Pandas CSV ingestion)
    ↓
Data Processor                 (Filtering, sorting, aggregation)
    ↓
Report Generator               (Structured JSON output)
    ↓
Frontend Report Visualisation  (Charts, tables, export)
```

---

## Tech Stack

### Backend
| Library | Purpose |
|---|---|
| **FastAPI** | Async REST API framework |
| **Uvicorn** | ASGI server |
| **Google Gemini** | LLM for natural language understanding |
| **FAISS** | Facebook AI Similarity Search — fast vector k-NN |
| **SentenceTransformers** | Semantic text embeddings |
| **Pandas** | DataFrame operations, filtering, aggregation |
| **Pydantic** | Request/response schema validation |

### Frontend
| Library | Purpose |
|---|---|
| **React 18** | Component-driven UI |
| **TypeScript** | Type-safe development |
| **TailwindCSS** | Utility-first dark-theme styling |
| **Framer Motion** | Animations and micro-interactions |
| **Axios** | HTTP client for API calls |
| **Recharts** | Data visualisation charts |

---

## Project Structure

```
ai-data-fetcher/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI entry point
│   │   ├── routers/
│   │   │   ├── query.py             # POST /query endpoint
│   │   │   ├── datasets.py          # Dataset management
│   │   │   ├── reports.py           # Report retrieval
│   │   │   └── logs.py              # SSE log streaming
                system.py
│   │   ├── services/
│   │   │   ├── gemini_service.py    # Google Gemini integration
│   │   │   ├── faiss_service.py     # FAISS vector search
│   │   │   ├── dataset_loader.py    # CSV ingestion
│   │   │   ├── data_processor.py   # Pandas filtering
│   │   │   └── report_generator.py # JSON report creation
│   │   ├── models/
│   │   │   └── schemas.py           # Pydantic models
│   │   └── data/
│   │       └── datasets/            # CSV dataset files
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   ├── QueryPanel/
│   │   │   ├── Reports/
│   │   │   ├── Logs/
│   │   │   └── shared/
│   │   ├── api/
│   │   │   └── client.ts            # Axios API client
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces
│   │   ├── store/                   # State management
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── reports/                         # Generated JSON reports
├── README.md
└── .env.example
```

---

## Setup & Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- Google Gemini API key → [aistudio.google.com](https://aistudio.google.com)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-data-fetcher-agent.git
cd ai-data-fetcher-agent
```

---

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Copy the environment file and add your API key:

```bash
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here
```

Start the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open the dashboard: `http://localhost:3000`

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Google Gemini API key (required)
GEMINI_API_KEY=your_gemini_api_key_here

# FAISS index path
FAISS_INDEX_PATH=./data/faiss_index

# Dataset directory
DATASET_DIR=./data/datasets

# Reports output directory
REPORTS_DIR=./reports

# CORS allowed origins
CORS_ORIGINS=http://localhost:3000
```

---

## Example Queries

Type any of these into the query box:

```
Show transactions above 10000
List customers with purchases above 5000
Show recent transactions for customer 102
Get all failed transactions from last month
Summarise sales by region for Q4
Find customers with no activity in 90 days
Show top 10 products by revenue
List orders with status pending
```

---

## API Reference

### `POST /api/query`
Submit a natural language query.

**Request body:**
```json
{
  "query": "Show transactions above 10000",
  "limit": 100
}
```

**Response:**
```json
{
  "report_id": "rpt_abc123",
  "query": "Show transactions above 10000",
  "dataset_used": "transactions.csv",
  "total_records": 47,
  "records": [...],
  "summary": "Found 47 transactions above 10,000",
  "generated_at": "2025-03-10T08:00:00Z"
}
```

---

### `GET /api/datasets`
List all registered datasets.

### `POST /api/datasets/upload`
Upload a new CSV dataset.

### `GET /api/reports`
List all previously generated reports.

### `GET /api/reports/{report_id}`
Retrieve a specific report by ID.

### `GET /api/logs/stream`
SSE endpoint for real-time backend log streaming.

---

## Deployment (Free)

### Backend → [Render.com](https://render.com)

1. Push `backend/` to GitHub
2. Create a new **Web Service** on Render
3. Set **Build Command:** `pip install -r requirements.txt`
4. Set **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in the Render dashboard



### Frontend → [Vercel](https://vercel.com)

1. Push `frontend/` to GitHub
2. Import project on Vercel
3. Set environment variable: `VITE_API_URL=https://your-app.onrender.com`
4. Click **Deploy**

### AI API → [Google AI Studio](https://aistudio.google.com) (Free tier)

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

> Built with FastAPI · Google Gemini · FAISS · SentenceTransformers · React · TypeScript · TailwindCSS · Framer Motion
