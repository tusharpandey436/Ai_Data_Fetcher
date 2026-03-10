import faiss
import numpy as np
import os
from app.utils.config import settings
from app.utils.logger import get_logger
from app.embeddings.embedder import embedder

logger = get_logger()


class VectorStore:

    def __init__(self):

        self.index = None
        self.dataset_map = []

        os.makedirs(settings.FAISS_INDEX_PATH, exist_ok=True)

    def build_index(self, dataset_descriptions):

        """
        Build FAISS index from dataset descriptions
        """

        logger.info("Building FAISS index")

        embeddings = []

        for dataset in dataset_descriptions:

            text = dataset["description"]

            vector = embedder.encode(text)

            embeddings.append(vector)

            self.dataset_map.append(dataset)

        embeddings = np.array(embeddings).astype("float32")

        dimension = embeddings.shape[1]

        self.index = faiss.IndexFlatL2(dimension)

        self.index.add(embeddings)

        logger.info("FAISS index created")

    def search(self, query, top_k=1):

        """
        Search most relevant dataset
        """

        query_vector = embedder.encode(query)

        query_vector = np.array([query_vector]).astype("float32")

        distances, indices = self.index.search(query_vector, top_k)

        results = []

        for idx in indices[0]:
            results.append(self.dataset_map[idx])

        return results


# Singleton
vector_store = VectorStore()