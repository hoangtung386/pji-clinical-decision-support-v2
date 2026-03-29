from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.treatment import TreatmentPlan
from app.models.user import User
from app.schemas.treatment import (
    TreatmentCreate,
    TreatmentRecommendRequest,
    TreatmentRecommendResponse,
    TreatmentResponse,
    TreatmentUpdate,
)
from app.services.audit_service import log_action
from app.services.icm_scoring import get_treatment_recommendation

router = APIRouter(prefix="/patients/{patient_id}/treatment", tags=["Treatment Plan"])


async def _get_plan(db: AsyncSession, patient_id: int) -> TreatmentPlan:
    result = await db.execute(
        select(TreatmentPlan).where(TreatmentPlan.patient_id == patient_id)
    )
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Chưa có phác đồ điều trị")
    return plan


@router.post("/", response_model=TreatmentResponse, status_code=status.HTTP_201_CREATED)
async def create_plan(
    patient_id: int,
    data: TreatmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Tạo phác đồ điều trị."""
    plan = TreatmentPlan(patient_id=patient_id, **data.model_dump())
    db.add(plan)
    await db.flush()
    await log_action(db, current_user, "CREATE", "treatment", plan.id)
    return plan


@router.get("/", response_model=TreatmentResponse)
async def get_plan(
    patient_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lấy phác đồ điều trị."""
    return await _get_plan(db, patient_id)


@router.put("/", response_model=TreatmentResponse)
async def update_plan(
    patient_id: int,
    data: TreatmentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cập nhật phác đồ điều trị."""
    plan = await _get_plan(db, patient_id)
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(plan, key, value)
    await db.flush()
    await log_action(db, current_user, "UPDATE", "treatment", plan.id)
    return plan


@router.post("/recommend", response_model=TreatmentRecommendResponse)
async def recommend(
    patient_id: int,
    data: TreatmentRecommendRequest,
    current_user: User = Depends(get_current_user),
):
    """Khuyến nghị phác đồ kháng sinh dựa trên tác nhân gây bệnh."""
    rec = get_treatment_recommendation(data.pathogen)
    return TreatmentRecommendResponse(**rec)
