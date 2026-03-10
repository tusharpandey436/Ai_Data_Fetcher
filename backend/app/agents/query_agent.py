import json
import re

from app.utils.logger import get_logger
from app.utils.gemini_client import ask_gemini

from app.services.dataset_search import dataset_search_service
from app.services.data_fetcher import data_fetcher_service
from app.services.data_processor import data_processor_service
from app.services.report_generator import report_generator_service

logger = get_logger()


def safe_parse_json(response: str):
    """
    Clean Gemini response and extract JSON safely
    """

    try:

        # Remove markdown formatting
        response = re.sub(r"```json", "", response)
        response = re.sub(r"```", "", response)

        # Extract JSON object
        match = re.search(r"\{.*\}", response, re.DOTALL)

        if match:
            json_str = match.group()
            return json.loads(json_str)

        return None

    except Exception:
        return None


def extract_query_information(query: str):
    """
    Use Gemini to extract dataset intent and condition
    """

    prompt = f"""
You are a data query assistant.

Extract dataset intent and filtering condition from the user query.

Return JSON only.

Example:
Query: Show transactions above 10000

Output:
{{
 "dataset_intent": "transactions",
 "condition": "amount > 10000"
}}

User Query:
{query}
"""

    response = ask_gemini(prompt)

    try:

        parsed = safe_parse_json(response)

        return parsed

    except Exception:

        logger.error("Failed to parse Gemini response")

        return {
            "dataset_intent": query,
            "condition": None
        }


def process_query(query: str):
    """
    Full AI agent pipeline
    """

    logger.info(f"Processing query: {query}")

    # Step 1: Extract information from query
    extracted = extract_query_information(query)

    dataset_intent = extracted.get("dataset_intent")
    condition = extracted.get("condition")

    # Step 2: Search dataset using FAISS
    datasets = dataset_search_service.search_dataset(dataset_intent)

    if not datasets:

        return {"error": "No dataset found"}

    dataset = datasets[0]

    dataset_path = dataset["path"]

    logger.info(f"Selected dataset: {dataset_path}")

    # Step 3: Fetch dataset
    df = data_fetcher_service.fetch_dataset(dataset_path)

    if df is None:

        return {"error": "Dataset loading failed"}

    # Step 4: Apply condition if exists
    if condition:

        df = data_processor_service.apply_condition(df, condition)

    # Step 5: Convert dataframe to records
    records = data_processor_service.dataframe_to_records(df)

    # Step 6: Generate report
    report = report_generator_service.generate_report(
        "query_result",
        records
    )

    return report