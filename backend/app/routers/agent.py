from fastapi import APIRouter
from app.models.schema import QueryRequest
from app.agents.query_agent import process_query
from app.utils.logger import get_logger

router = APIRouter(
    prefix="/agent",
    tags=["Agent"]
)

logger = get_logger()


@router.post("/query")
def query_agent(request: QueryRequest):
    """
    Endpoint to process user query through AI agent
    """

    logger.info(f"Received query: {request.query}")

    result = process_query(request.query)

    return {
        "status": "success",
        "query": request.query,
        "agent_result": result
    }