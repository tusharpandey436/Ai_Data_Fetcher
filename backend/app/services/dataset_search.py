import os
import pandas as pd
from app.utils.config import settings
from app.utils.logger import get_logger
from app.embeddings.vector_store import vector_store

logger = get_logger()


class DatasetSearchService:

    def __init__(self):

        self.dataset_metadata = []

        self.load_dataset_metadata()

        vector_store.build_index(self.dataset_metadata)

    def load_dataset_metadata(self):

        """
        Load metadata for datasets with column awareness
        """

        data_path = settings.DATA_PATH

        files = os.listdir(data_path)

        for file in files:

            dataset_path = os.path.abspath(os.path.join(data_path, file))

            try:

                # Read first few rows to get columns
                if file.endswith(".csv"):

                    df = pd.read_csv(dataset_path, nrows=5)

                    columns = ", ".join(df.columns)

                else:

                    columns = "unknown columns"

                description = f"""
                Dataset {file} containing columns: {columns}.
                This dataset can be used for analytics and reporting.
                """

            except Exception as e:

                logger.warning(f"Failed to read dataset {file}: {str(e)}")

                description = f"Dataset file containing {file} data"

            metadata = {
                "name": file,
                "description": description,
                "path": dataset_path
            }

            self.dataset_metadata.append(metadata)

        logger.info("Dataset metadata loaded")

    def search_dataset(self, query):

        """
        Search dataset using FAISS similarity
        """

        results = vector_store.search(query)

        logger.info(f"Dataset search result: {results}")

        return results


# Singleton
dataset_search_service = DatasetSearchService()