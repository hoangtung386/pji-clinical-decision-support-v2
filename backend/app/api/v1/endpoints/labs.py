from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.lab import LabResult
from app.models.user import User
from app.schemas.lab import LabResultCreate, LabResultResponse, LabResultUpdate
from app.services.audit_service import log_action

router = APIRouter(prefix="/patients/{patient_id}/labs", tags=["Lab Results"])


@router.get("/", response_model=list[LabResultResponse])
async def list_labs(
    patient_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lấy toàn bộ kết quả xét nghiệm theo timeline."""
    result = await db.execute(
        select(LabResult)
        .where(LabResult.patient_id == patient_id)
        .order_by(LabResult.created_at)
    )
    return list(result.scalars().all())


@router.post("/", response_model=LabResultResponse, status_code=status.HTTP_201_CREATED)
async def create_lab(
    patient_id: int,
    data: LabResultCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Thêm kết quả xét nghiệm cho một thời điểm."""
    lab = LabResult(patient_id=patient_id, **data.model_dump())
    db.add(lab)
    await db.flush()
    await log_action(db, current_user, "CREATE", "lab", lab.id, f"Lab {data.day}")
    return lab


@router.put("/{lab_id}", response_model=LabResultResponse)
async def update_lab(
    patient_id: int,
    lab_id: int,
    data: LabResultUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cập nhật kết quả xét nghiệm."""
    result = await db.execute(
        select(LabResult).where(LabResult.id == lab_id, LabResult.patient_id == patient_id)
    )
    lab = result.scalar_one_or_none()
    if not lab:
        raise HTTPException(status_code=404, detail="Không tìm thấy kết quả xét nghiệm")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(lab, key, value)
    await db.flush()
    await log_action(db, current_user, "UPDATE", "lab", lab_id)
    return lab


@router.delete("/{lab_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lab(
    patient_id: int,
    lab_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Xóa kết quả xét nghiệm."""
    result = await db.execute(
        select(LabResult).where(LabResult.id == lab_id, LabResult.patient_id == patient_id)
    )
    lab = result.scalar_one_or_none()
    if not lab:
        raise HTTPException(status_code=404, detail="Không tìm thấy kết quả xét nghiệm")

    await log_action(db, current_user, "DELETE", "lab", lab_id)
    await db.delete(lab)
    await db.flush()
