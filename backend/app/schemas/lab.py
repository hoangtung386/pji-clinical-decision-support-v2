from datetime import datetime

from pydantic import BaseModel


class LabResultCreate(BaseModel):
    day: str
    wbc: float | None = None
    neu: float | None = None
    esr: float | None = None
    crp: float | None = None


class LabResultUpdate(BaseModel):
    wbc: float | None = None
    neu: float | None = None
    esr: float | None = None
    crp: float | None = None


class LabResultResponse(BaseModel):
    id: int
    patient_id: int
    day: str
    wbc: float | None
    neu: float | None
    esr: float | None
    crp: float | None
    created_at: datetime

    model_config = {"from_attributes": True}
