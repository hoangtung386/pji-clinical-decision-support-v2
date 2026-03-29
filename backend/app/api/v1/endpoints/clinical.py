import os

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.clinical import (
    ClinicalAssessment,
    CultureSample,
    DiagnosticImage,
    TestResult,
)
from app.models.user import User
from app.schemas.clinical import (
    ClinicalCreate,
    ClinicalResponse,
    ClinicalUpdate,
    CultureSampleCreate,
    DiagnosisResponse,
    TestResultCreate,
    TestResultResponse,
)
from app.services.audit_service import log_action
from app.services.icm_scoring import calculate_diagnosis

router = APIRouter(prefix="/patients/{patient_id}/clinical", tags=["Clinical Assessment"])


async def _get_assessment(db: AsyncSession, patient_id: int) -> ClinicalAssessment:
    result = await db.execute(
        select(ClinicalAssessment)
        .options(
            selectinload(ClinicalAssessment.test_results),
            selectinload(ClinicalAssessment.culture_samples),
            selectinload(ClinicalAssessment.diagnostic_images),
        )
        .where(ClinicalAssessment.patient_id == patient_id)
    )
    assessment = result.scalar_one_or_none()
    if not assessment:
        raise HTTPException(status_code=404, detail="Chưa có đánh giá lâm sàng")
    return assessment


@router.post("/", response_model=ClinicalResponse, status_code=status.HTTP_201_CREATED)
async def create_assessment(
    patient_id: int,
    data: ClinicalCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Tạo đánh giá lâm sàng cho bệnh nhân."""
    assessment = ClinicalAssessment(
        patient_id=patient_id,
        major_criteria=data.major_criteria.model_dump(),
        symptoms=data.symptoms.model_dump(),
        imaging_description=data.imaging_description,
    )
    db.add(assessment)
    await db.flush()

    for t in data.test_results:
        db.add(TestResult(assessment_id=assessment.id, **t.model_dump()))
    for c in data.culture_samples:
        db.add(CultureSample(assessment_id=assessment.id, **c.model_dump()))
    await db.flush()

    await log_action(db, current_user, "CREATE", "clinical", assessment.id)
    return await _get_assessment(db, patient_id)


@router.get("/", response_model=ClinicalResponse)
async def get_assessment(
    patient_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lấy đánh giá lâm sàng."""
    return await _get_assessment(db, patient_id)


@router.put("/", response_model=ClinicalResponse)
async def update_assessment(
    patient_id: int,
    data: ClinicalUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cập nhật đánh giá lâm sàng."""
    assessment = await _get_assessment(db, patient_id)
    if data.major_criteria:
        assessment.major_criteria = data.major_criteria.model_dump()
    if data.symptoms:
        assessment.symptoms = data.symptoms.model_dump()
    if data.imaging_description is not None:
        assessment.imaging_description = data.imaging_description
    await db.flush()

    await log_action(db, current_user, "UPDATE", "clinical", assessment.id)
    return await _get_assessment(db, patient_id)


@router.put("/sync", response_model=ClinicalResponse)
async def sync_assessment(
    patient_id: int,
    data: ClinicalCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Đồng bộ toàn bộ đánh giá lâm sàng (upsert tất cả)."""
    from sqlalchemy import delete as sql_delete

    # Get or create assessment
    result = await db.execute(
        select(ClinicalAssessment).where(ClinicalAssessment.patient_id == patient_id)
    )
    assessment = result.scalar_one_or_none()

    if assessment:
        assessment.major_criteria = data.major_criteria.model_dump()
        assessment.symptoms = data.symptoms.model_dump()
        assessment.imaging_description = data.imaging_description
        # Delete old children
        await db.execute(sql_delete(TestResult).where(TestResult.assessment_id == assessment.id))
        await db.execute(sql_delete(CultureSample).where(CultureSample.assessment_id == assessment.id))
    else:
        assessment = ClinicalAssessment(
            patient_id=patient_id,
            major_criteria=data.major_criteria.model_dump(),
            symptoms=data.symptoms.model_dump(),
            imaging_description=data.imaging_description,
        )
        db.add(assessment)
        await db.flush()

    # Recreate test results
    for t in data.test_results:
        db.add(TestResult(assessment_id=assessment.id, **t.model_dump()))

    # Recreate culture samples
    for c in data.culture_samples:
        db.add(CultureSample(assessment_id=assessment.id, **c.model_dump()))

    await db.flush()

    # Auto-run diagnosis
    cultures = [
        {"status": c.status, "bacteria_name": c.bacteria_name or ""}
        for c in data.culture_samples
    ]
    diag = calculate_diagnosis(
        symptoms=data.symptoms.model_dump(),
        major_criteria=data.major_criteria.model_dump(),
        culture_samples=[{"status": c.status, "bacteria_name": c.bacteria_name or ""} for c in data.culture_samples],
    )
    assessment.diagnosis_score = diag["score"]
    assessment.diagnosis_probability = diag["probability"]
    assessment.diagnosis_status = diag["status"]
    assessment.diagnosis_reasoning = diag["reasoning"]
    await db.flush()

    await log_action(db, current_user, "SYNC", "clinical", assessment.id)
    return await _get_assessment(db, patient_id)


@router.post("/tests", response_model=TestResultResponse, status_code=status.HTTP_201_CREATED)
async def add_test_result(
    patient_id: int,
    data: TestResultCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Thêm kết quả xét nghiệm."""
    assessment = await _get_assessment(db, patient_id)
    test = TestResult(assessment_id=assessment.id, **data.model_dump())
    db.add(test)
    await db.flush()
    return test


@router.post("/cultures", status_code=status.HTTP_201_CREATED)
async def add_culture_sample(
    patient_id: int,
    data: CultureSampleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Thêm mẫu cấy khuẩn."""
    assessment = await _get_assessment(db, patient_id)
    sample = CultureSample(assessment_id=assessment.id, **data.model_dump())
    db.add(sample)
    await db.flush()
    return {"id": sample.id, "sample_number": sample.sample_number, "status": sample.status}


@router.post("/diagnosis", response_model=DiagnosisResponse)
async def run_diagnosis(
    patient_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Chạy thuật toán chẩn đoán ICM 2018."""
    assessment = await _get_assessment(db, patient_id)
    cultures = [
        {"status": c.status.value, "bacteria_name": c.bacteria_name or ""}
        for c in assessment.culture_samples
    ]

    result = calculate_diagnosis(
        symptoms=assessment.symptoms,
        major_criteria=assessment.major_criteria,
        culture_samples=cultures,
    )

    assessment.diagnosis_score = result["score"]
    assessment.diagnosis_probability = result["probability"]
    assessment.diagnosis_status = result["status"]
    assessment.diagnosis_reasoning = result["reasoning"]
    await db.flush()

    await log_action(db, current_user, "DIAGNOSE", "clinical", assessment.id, detail=result["status"])
    return DiagnosisResponse(**result)


@router.post("/images", status_code=status.HTTP_201_CREATED)
async def upload_image(
    patient_id: int,
    image_type: str,
    file: UploadFile,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload hình ảnh chẩn đoán."""
    assessment = await _get_assessment(db, patient_id)

    upload_dir = os.path.join(settings.upload_dir, str(patient_id))
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    image = DiagnosticImage(
        assessment_id=assessment.id,
        image_type=image_type,
        file_path=file_path,
        file_name=file.filename,
    )
    db.add(image)
    await db.flush()

    return {"id": image.id, "file_name": image.file_name, "image_type": image.image_type}
