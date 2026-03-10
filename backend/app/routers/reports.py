from fastapi import APIRouter
import os
import json
from app.utils.config import settings
from app.utils.logger import get_logger

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

logger = get_logger()

@router.get("/")
def fetch_all_reports():
    """
    Return all generated regulatory reports from the reports directory
    """
    logger.info("Fetching all available reports")
    
    reports_dir = os.path.join(os.getcwd(), "reports")
    all_reports = []

    if not os.path.exists(reports_dir):
        logger.warning(f"Reports directory not found at {reports_dir}")
        return []

    # Iterate through all files in the reports folder
    for filename in os.listdir(reports_dir):
        if filename.endswith(".json"):
            file_path = os.path.join(reports_dir, filename)
            try:
                with open(file_path, "r") as f:
                    data = json.load(f)
                    # The query workspace saves reports inside an 'agent_result' key
                    # We extract that or the whole object if 'agent_result' isn't there
                    report_content = data.get("agent_result", data)
                    
                    # Ensure it's a valid report object before adding
                    if isinstance(report_content, dict) and "report_name" in report_content:
                        all_reports.append(report_content)
            except Exception as e:
                logger.error(f"Failed to read report {filename}: {str(e)}")
                continue
    
    # Sort reports by name or date if needed (optional)
    all_reports.sort(key=lambda x: x.get("report_name", ""))
    return all_reports