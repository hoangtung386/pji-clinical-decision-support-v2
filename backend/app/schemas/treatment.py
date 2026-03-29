from datetime import datetime

from pydantic import BaseModel


class TreatmentCreate(BaseModel):
    pathogen: str
    resistance: str | None = None
    iv_drug: str | None = None
    iv_dosage: str | None = None
    iv_duration: str | None = None
    oral_drug: str | None = None
    oral_dosage: str | None = None
    oral_duration: str | None = None
    citation: str | None = None
    confidence: float = 0


class TreatmentUpdate(BaseModel):
    pathogen: str | None = None
    resistance: str | None = None
    iv_drug: str | None = None
    iv_dosage: str | None = None
    iv_duration: str | None = None
    oral_drug: str | None = None
    oral_dosage: str | None = None
    oral_duration: str | None = None
    citation: str | None = None
    confidence: float | None = None


class TreatmentResponse(BaseModel):
    id: int
    patient_id: int
    pathogen: str
    resistance: str | None
    iv_drug: str | None
    iv_dosage: str | None
    iv_duration: str | None
    oral_drug: str | None
    oral_dosage: str | None
    oral_duration: str | None
    citation: str | None
    confidence: float
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TreatmentRecommendRequest(BaseModel):
    pathogen: str


class TreatmentRecommendResponse(BaseModel):
    iv_drug: str
    iv_dosage: str
    iv_duration: str
    oral_drug: str
    citation: str
