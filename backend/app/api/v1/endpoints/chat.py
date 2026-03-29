import httpx
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
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
    """
    Hỏi đáp AI về ca bệnh.

    Gửi toàn bộ thông tin ca bệnh (JSON) sang chatbot microservice.
    Fallback sang rule-based nếu chatbot service không khả dụng.
    """
    # Build structured patient context from DB
    patient_context = {}
    if data.patient_id:
        patient_context = await build_patient_context(db, data.patient_id)

    history = [{"role": m.role, "content": m.content} for m in data.history]

    # Try external chatbot service first
    if settings.chatbot_service_url:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{settings.chatbot_service_url}/api/chat",
                    json={
                        "message": data.message,
                        "patient_id": data.patient_id,
                        "patient_context": patient_context,
                        "history": history,
                    },
                )
                response.raise_for_status()
                result = response.json()
        except Exception:
            # Fallback to local if external service fails
            result = await generate_response(data.message, patient_context, history)
    else:
        result = await generate_response(data.message, patient_context, history)

    await log_action(
        db, current_user, "CHAT", "chat",
        resource_id=data.patient_id,
        detail=data.message[:100],
    )

    return ChatResponse(**result)
