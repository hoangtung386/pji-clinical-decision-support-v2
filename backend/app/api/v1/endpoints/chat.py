from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.audit_service import log_action
from app.services.chat_service import build_patient_context, generate_response

router = APIRouter(prefix="/chat", tags=["AI Chat"])


@router.post("/", response_model=ChatResponse)
async def chat(
    data: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Hỏi đáp AI về ca bệnh (RAG-ready)."""
    patient_context = ""
    if data.patient_id:
        patient_context = await build_patient_context(db, data.patient_id)

    history = [{"role": m.role, "content": m.content} for m in data.history]

    result = await generate_response(
        message=data.message,
        patient_context=patient_context,
        history=history,
    )

    await log_action(
        db,
        current_user,
        "CHAT",
        "chat",
        resource_id=data.patient_id,
        detail=data.message[:100],
    )

    return ChatResponse(**result)
