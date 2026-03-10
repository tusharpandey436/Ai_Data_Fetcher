import pandas as pd
import os
import sqlite3

from app.utils.logger import get_logger

logger = get_logger()


class DataFetcherService:

    def load_csv(self, path: str):
        """
        Load CSV dataset
        """

        try:

            logger.info(f"Loading CSV dataset: {path}")

            df = pd.read_csv(path)

            return df

        except Exception as e:

            logger.error(f"CSV loading failed: {str(e)}")

            return None

    def load_json(self, path: str):
        """
        Load JSON dataset
        """

        try:

            logger.info(f"Loading JSON dataset: {path}")

            df = pd.read_json(path)

            return df

        except Exception as e:

            logger.error(f"JSON loading failed: {str(e)}")

            return None

    def load_sqlite(self, path: str, table_name: str):
        """
        Load SQLite dataset
        """

        try:

            logger.info(f"Loading SQLite dataset: {path}")

            conn = sqlite3.connect(path)

            query = f"SELECT * FROM {table_name}"

            df = pd.read_sql_query(query, conn)

            conn.close()

            return df

        except Exception as e:

            logger.error(f"SQLite loading failed: {str(e)}")

            return None

    def fetch_dataset(self, dataset_path: str):
        """
        Automatically detect dataset type
        """

        extension = os.path.splitext(dataset_path)[1]

        if extension == ".csv":
            return self.load_csv(dataset_path)

        elif extension == ".json":
            return self.load_json(dataset_path)

        elif extension == ".db":
            logger.error("SQLite requires table name")
            return None

        else:

            logger.error(f"Unsupported file format: {extension}")

            return None


# Singleton instance
data_fetcher_service = DataFetcherService()