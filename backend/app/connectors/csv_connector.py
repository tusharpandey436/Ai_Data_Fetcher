import pandas as pd
from app.utils.logger import get_logger

logger = get_logger()


class CSVConnector:

    def read(self, path: str):
        """
        Read CSV file and return DataFrame
        """

        try:

            logger.info(f"Reading CSV file: {path}")

            df = pd.read_csv(path)

            return df

        except Exception as e:

            logger.error(f"CSV read error: {str(e)}")

            return None


csv_connector = CSVConnector()