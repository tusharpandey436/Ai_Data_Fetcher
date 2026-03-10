import pandas as pd
from app.utils.logger import get_logger

logger = get_logger()


class JSONConnector:

    def read(self, path: str):
        """
        Read JSON file and return DataFrame
        """

        try:

            logger.info(f"Reading JSON file: {path}")

            df = pd.read_json(path)

            return df

        except Exception as e:

            logger.error(f"JSON read error: {str(e)}")

            return None


json_connector = JSONConnector()