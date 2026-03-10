import pandas as pd
from app.utils.logger import get_logger

logger = get_logger()


class DataProcessorService:

    def apply_condition(self, df: pd.DataFrame, condition: str):
        """
        Apply filter condition on dataframe
        Example condition: 'amount > 10000'
        """

        try:

            logger.info(f"Applying condition: {condition}")

            filtered_df = df.query(condition)

            return filtered_df

        except Exception as e:

            logger.error(f"Condition processing failed: {str(e)}")

            return df

    def join_datasets(self, df1: pd.DataFrame, df2: pd.DataFrame, key: str):
        """
        Join two datasets using a common key
        """

        try:

            logger.info(f"Joining datasets on key: {key}")

            joined_df = pd.merge(df1, df2, on=key)

            return joined_df

        except Exception as e:

            logger.error(f"Dataset join failed: {str(e)}")

            return df1

    def dataframe_to_records(self, df: pd.DataFrame):
        """
        Convert dataframe to list of dictionaries
        """

        try:

            records = df.to_dict(orient="records")

            return records

        except Exception as e:

            logger.error(f"Data conversion failed: {str(e)}")

            return []


# Singleton instance
data_processor_service = DataProcessorService()