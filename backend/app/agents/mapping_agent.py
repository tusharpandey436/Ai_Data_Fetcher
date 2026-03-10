import json
from app.utils.logger import get_logger
from app.utils.gemini_client import ask_gemini

logger = get_logger()


def generate_field_mapping(columns, regulatory_fields):
    """
    Use Gemini to map dataset fields to regulatory fields
    """

    prompt = f"""
You are a data mapping assistant.

Map dataset fields to regulatory reporting fields.

Dataset Fields:
{columns}

Regulatory Fields:
{regulatory_fields}

Return JSON mapping.

Example Output:
{{
 "transaction_id": "transaction_identifier",
 "amount": "transaction_value"
}}
"""

    response = ask_gemini(prompt)

    try:

        mapping = json.loads(response)

        return mapping

    except Exception:

        logger.error("Mapping generation failed")

        return {}