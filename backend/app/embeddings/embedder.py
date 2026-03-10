from sentence_transformers import SentenceTransformer
from app.utils.config import settings
from app.utils.logger import get_logger

logger = get_logger()


class Embedder:

    def __init__(self):

        logger.info("Loading embedding model")

        self.model = SentenceTransformer(settings.EMBEDDING_MODEL)

    def encode(self, text: str):

        """
        Convert text into embedding vector
        """

        embedding = self.model.encode(text)

        return embedding


# Singleton instance
embedder = Embedder()