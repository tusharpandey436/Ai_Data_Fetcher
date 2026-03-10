from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import agent, datasets, reports,system
from app.utils.logger import get_logger

logger = get_logger()

# Create FastAPI instance
app = FastAPI(
    title="Data Fetcher Agent",
    description="AI-powered data discovery and regulatory reporting system",
    version="1.0.0"
)

# -----------------------------
# CORS CONFIGURATION
# -----------------------------
origins = [
    "http://localhost:3000",   # React dev server
    "http://localhost:5173",
    "https://ai-data-fetcher.vercel.app" # Vite React server
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# ROUTERS
# -----------------------------
app.include_router(agent.router)
app.include_router(datasets.router)
app.include_router(reports.router)
app.include_router(system.router)


# -----------------------------
# ROOT ENDPOINT
# -----------------------------
@app.get("/")
def root():
    """
    Root endpoint to verify API is running
    """
    logger.info("Root endpoint accessed")

    return {
        "message": "Data Fetcher Agent API is running",
        "version": "1.0"
    }


# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.get("/health")
def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "service": "data-fetcher-agent"
    }


# -----------------------------
# STARTUP EVENT
# -----------------------------
@app.on_event("startup")
def startup_event():
    logger.info("🚀 Data Fetcher Agent API started")


# -----------------------------
# SHUTDOWN EVENT
# -----------------------------
@app.on_event("shutdown")
def shutdown_event():
    logger.info("🛑 Data Fetcher Agent API stopped")
