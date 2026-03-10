from fastapi import APIRouter, File, UploadFile, HTTPException
import os
import shutil
import pandas as pd
from app.utils.config import settings
from app.utils.logger import get_logger

router = APIRouter(
    prefix="/datasets",
    tags=["Datasets"]
)

logger = get_logger()

@router.get("/")
def list_datasets():
    """
    List all datasets with metadata and column names
    """
    data_path = settings.DATA_PATH
    datasets = []

    try:
        # Check if directory exists
        if not os.path.exists(data_path):
            logger.error(f"Data path not found: {data_path}")
            return {"datasets": [], "error": "Data directory missing"}

        for filename in os.listdir(data_path):
            if filename.endswith(".csv"):
                file_path = os.path.join(data_path, filename)
                
                try:
                    # Read only the first row to get column names (fast)
                    df = pd.read_csv(file_path, nrows=0)
                    columns = df.columns.tolist()
                except Exception as e:
                    logger.warning(f"Could not read columns for {filename}: {e}")
                    columns = []

                datasets.append({
                    "name": filename,
                    "description": f"Dataset containing information from {filename}. Ready for AI analysis.",
                    "columns": columns,
                    "type": "csv"
                })

        logger.info(f"Successfully fetched {len(datasets)} datasets")
        
        # Return as an object containing the list to match your frontend logic
        return {"datasets": datasets}

    except Exception as e:
        logger.error(f"Error fetching datasets: {str(e)}")
        return {
            "datasets": [],
            "error": str(e)
        }
    

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    """
    Upload a CSV file to the data directory
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    data_path = settings.DATA_PATH
    file_location = os.path.join(data_path, file.filename)

    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        return {
            "message": f"Successfully uploaded {file.filename}",
            "filename": file.filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")