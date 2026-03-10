from google import genai
from app.utils.config import settings
from app.utils.logger import get_logger

logger = get_logger()

# Create Gemini client
client = genai.Client(api_key=settings.GEMINI_API_KEY)


def ask_gemini(prompt: str) -> str:
    """
    Send prompt to Gemini and return response text
    """

    try:

        logger.info("Sending prompt to Gemini")

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        if response.text:
            return response.text

        return ""

    except Exception as e:

        logger.error(f"Gemini API Error: {str(e)}")

        return ""