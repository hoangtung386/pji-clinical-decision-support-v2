from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.patient import (
    PatientCreate,
    PatientListResponse,
    PatientResponse,
    PatientUpdate,
)
from app.services.audit_service import log_action
from app.services.patient_service import (
    create_patient,
    delete_patient,
    get_patient,
    get_patients,
    update_patient,
)

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def create(
    data: PatientCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Tạo hồ sơ bệnh nhân mới."""
    patient = await create_patient(db, data, current_user.id)
    await log_action(db, current_user, "CREATE", "patient", patient.id, f"Tạo bệnh nhân {data.name}")
    return patient


@router.get("/", response_model=list[PatientListResponse])
async def list_patients(
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Danh sách bệnh nhân."""
    return await get_patients(db, skip, limit)


@router.get("/{patient_id}", response_model=PatientResponse)
async def get_one(
    patient_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Chi tiết bệnh nhân."""
    patient = await get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh nhân")
    return patient


@router.put("/{patient_id}", response_model=PatientResponse)
async def update(
    patient_id: int,
    data: PatientUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cập nhật thông tin bệnh nhân."""
    patient = await get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh nhân")

    updated = await update_patient(db, patient, data)
    await log_action(
        db, current_user, "UPDATE", "patient", patient_id,
        changes=data.model_dump(exclude_unset=True),
    )
    return updated


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    patient_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Xóa bệnh nhân."""
    patient = await get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh nhân")

    await log_action(db, current_user, "DELETE", "patient", patient_id, f"Xóa bệnh nhân {patient.name}")
    await delete_patient(db, patient)
