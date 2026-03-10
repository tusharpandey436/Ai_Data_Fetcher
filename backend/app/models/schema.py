from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class QueryRequest(BaseModel):
    """
    Request model for agent query
    """
    query: str


class AgentResponse(BaseModel):
    """
    Response returned by AI agent
    """
    dataset: Optional[str] = None
    condition: Optional[str] = None
    message: Optional[str] = None


class DatasetListResponse(BaseModel):
    """
    List available datasets
    """
    datasets: List[str]


class Record(BaseModel):
    """
    Single record in report
    """
    data: Dict[str, Any]


class ReportResponse(BaseModel):
    """
    Regulatory report output
    """
    report_name: str
    total_records: int
    records: List[Dict[str, Any]]