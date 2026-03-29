from datetime import datetime

from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime | None = None


class ChatRequest(BaseModel):
    message: str
    patient_id: int | None = None
    history: list[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str
    sources: list[str] = []
    context_used: bool = False
