import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Settings:
    """
    Application configuration loaded from .env
    """

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    EMBEDDING_MODEL: str = os.getenv(
        "EMBEDDING_MODEL",
        "all-MiniLM-L6-v2"
    )

    DATA_PATH: str = os.getenv(
        "DATA_PATH",
        "./data"
    )

    FAISS_INDEX_PATH: str = os.getenv(
        "FAISS_INDEX_PATH",
        "./vector_index"
    )


settings = Settings()