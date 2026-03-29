from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate
from app.services.icm_scoring import calculate_bmi, is_acute_infection


async def get_patient_by_mrn(db: AsyncSession, mrn: str) -> Patient | None:
    result = await db.execute(
        select(Patient)
        .options(
            selectinload(Patient.clinical_assessment),
            selectinload(Patient.lab_results),
            selectinload(Patient.treatment_plan),
        )
        .where(Patient.mrn == mrn)
    )
    return result.scalar_one_or_none()


async def get_next_mrn(db: AsyncSession) -> str:
    """Generate next auto-increment MRN starting from '0'."""
    result = await db.execute(select(Patient.mrn))
    all_mrns = [row[0] for row in result.all()]

    if not all_mrns:
        return "0"

    numeric_mrns = []
    for m in all_mrns:
        try:
            numeric_mrns.append(int(m))
        except (ValueError, TypeError):
            continue

    if not numeric_mrns:
        return "0"

    return str(max(numeric_mrns) + 1)


async def create_patient(
    db: AsyncSession, data: PatientCreate, user_id: int
) -> Patient:
    bmi = calculate_bmi(data.height, data.weight)
    acute = False
    if data.surgery_date and data.symptom_date:
        acute = is_acute_infection(str(data.surgery_date), str(data.symptom_date))

    patient = Patient(
        mrn=data.mrn,
        name=data.name,
        dob=data.dob,
        gender=data.gender,
        phone=data.phone,
        address=data.address,
        height=data.height,
        weight=data.weight,
        bmi=bmi,
        surgery_date=data.surgery_date,
        symptom_date=data.symptom_date,
        is_acute=acute,
        implant_type=data.implant_type,
        fixation_type=data.fixation_type,
        implant_nature=data.implant_nature,
        comorbidities=data.comorbidities.model_dump(),
        medical_history=data.medical_history,
        past_medical_history=data.past_medical_history,
        related_characteristics=data.related_characteristics.model_dump(),
        surgical_history=[row.model_dump() for row in data.surgical_history],
        created_by=user_id,
    )
    db.add(patient)
    await db.flush()
    return patient


async def get_patient(db: AsyncSession, patient_id: int) -> Patient | None:
    result = await db.execute(
        select(Patient)
        .options(
            selectinload(Patient.clinical_assessment),
            selectinload(Patient.lab_results),
            selectinload(Patient.treatment_plan),
        )
        .where(Patient.id == patient_id)
    )
    return result.scalar_one_or_none()


async def get_patients(
    db: AsyncSession, skip: int = 0, limit: int = 50
) -> list[Patient]:
    result = await db.execute(
        select(Patient).order_by(Patient.created_at.desc()).offset(skip).limit(limit)
    )
    return list(result.scalars().all())


async def update_patient(
    db: AsyncSession, patient: Patient, data: PatientUpdate
) -> Patient:
    from app.models.patient import ImplantType, ImplantNature

    update_data = data.model_dump(exclude_unset=True)

    if "comorbidities" in update_data and update_data["comorbidities"]:
        update_data["comorbidities"] = data.comorbidities.model_dump()
    if "related_characteristics" in update_data and update_data["related_characteristics"]:
        update_data["related_characteristics"] = data.related_characteristics.model_dump()
    if "surgical_history" in update_data and update_data["surgical_history"]:
        update_data["surgical_history"] = [r.model_dump() for r in data.surgical_history]

    # Convert string to enum for enum fields
    if "implant_type" in update_data and update_data["implant_type"]:
        try:
            update_data["implant_type"] = ImplantType(update_data["implant_type"])
        except ValueError:
            update_data["implant_type"] = ImplantType.TKA
    if "implant_nature" in update_data and update_data["implant_nature"]:
        try:
            update_data["implant_nature"] = ImplantNature(update_data["implant_nature"])
        except ValueError:
            update_data["implant_nature"] = ImplantNature.PRIMARY

    for key, value in update_data.items():
        setattr(patient, key, value)

    # Recalculate derived fields
    patient.bmi = calculate_bmi(patient.height, patient.weight)
    if patient.surgery_date and patient.symptom_date:
        try:
            patient.is_acute = is_acute_infection(
                str(patient.surgery_date), str(patient.symptom_date)
            )
        except (ValueError, TypeError):
            pass

    await db.flush()
    return patient


async def delete_patient(db: AsyncSession, patient: Patient) -> None:
    await db.delete(patient)
    await db.flush()


async def delete_all_patients(db: AsyncSession) -> None:
    from sqlalchemy import delete as sql_delete
    from app.models.clinical import ClinicalAssessment, TestResult, CultureSample, DiagnosticImage
    from app.models.lab import LabResult
    from app.models.treatment import TreatmentPlan

    await db.execute(sql_delete(TestResult))
    await db.execute(sql_delete(CultureSample))
    await db.execute(sql_delete(DiagnosticImage))
    await db.execute(sql_delete(ClinicalAssessment))
    await db.execute(sql_delete(LabResult))
    await db.execute(sql_delete(TreatmentPlan))
    await db.execute(sql_delete(Patient))
    await db.flush()
