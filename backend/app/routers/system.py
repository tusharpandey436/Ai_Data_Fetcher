from fastapi import APIRouter
import os
from pathlib import Path
from app.utils.logger import get_logger

router = APIRouter(prefix="/system", tags=["System"])
logger = get_logger()

# Resolve the path to backend/app/logs/agent.log
# This assumes this file is in app/routers/
BASE_DIR = Path(__file__).resolve().parent.parent
LOG_FILE_PATH = BASE_DIR / "logs" / "agent.log"

@router.get("/logs")
def get_logs():
    """
    Reads the agent.log file from app/logs/
    """
    if not LOG_FILE_PATH.exists():
        logger.error(f"Log file not found at {LOG_FILE_PATH}")
        return {"logs": [f"Log file not found at {LOG_FILE_PATH}"]}
    
    try:
        with open(LOG_FILE_PATH, "r") as f:
            # Get last 100 lines to keep the UI snappy
            lines = f.readlines()
            return {"logs": [line.strip() for line in lines[-100:]]}
    except Exception as e:
        logger.error(f"Error reading logs: {str(e)}")
        return {"logs": [f"Error reading logs: {str(e)}"]}