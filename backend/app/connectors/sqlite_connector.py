import sqlite3
import pandas as pd
from app.utils.logger import get_logger

logger = get_logger()


class SQLiteConnector:

    def read(self, db_path: str, table_name: str):
        """
        Read SQLite table and return DataFrame
        """

        try:

            logger.info(f"Reading SQLite table: {table_name}")

            conn = sqlite3.connect(db_path)

            query = f"SELECT * FROM {table_name}"

            df = pd.read_sql_query(query, conn)

            conn.close()

            return df

        except Exception as e:

            logger.error(f"SQLite read error: {str(e)}")

            return None


sqlite_connector = SQLiteConnector()