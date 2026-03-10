import os
from loguru import logger

LOG_DIR = "app/logs"
LOG_FILE = "agent.log"

os.makedirs(LOG_DIR, exist_ok=True)

logger.add(
    f"{LOG_DIR}/{LOG_FILE}",
    rotation="1 MB",
    retention="10 days",
    level="INFO",
    format="{time} | {level} | {message}"
)


def get_logger():
    return logger