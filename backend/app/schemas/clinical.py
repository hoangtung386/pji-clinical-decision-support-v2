from datetime import datetime

from pydantic import BaseModel


class MajorCriteria(BaseModel):
    sinus_tract: bool = False
    two_positive_cultures: bool = False


class Symptoms(BaseModel):
    fever: bool = False
    sinus_tract: bool = False
    pain: bool = False
    swelling: bool = False
    drainage: bool = False


class TestResultCreate(BaseModel):
    category: str
    name: str
    result: str | None = None
    normal_range: str | None = None
    unit: str | None = None


class TestResultResponse(BaseModel):
    id: int
    category: str
    name: str
    result: str | None
    normal_range: str | None
    unit: str | None

    model_config = {"from_attributes": True}


class CultureSampleCreate(BaseModel):
    sample_number: int
    status: str = "negative"
    bacteria_name: str | None = None


class CultureSampleResponse(BaseModel):
    id: int
    sample_number: int
    status: str
    bacteria_name: str | None

    model_config = {"from_attributes": True}


class DiagnosisResponse(BaseModel):
    score: int
    probability: float
    status: str
    reasoning: list[str]


class ClinicalCreate(BaseModel):
    major_criteria: MajorCriteria = MajorCriteria()
    symptoms: Symptoms = Symptoms()
    imaging_description: str | None = None
    test_results: list[TestResultCreate] = []
    culture_samples: list[CultureSampleCreate] = []


class ClinicalUpdate(BaseModel):
    major_criteria: MajorCriteria | None = None
    symptoms: Symptoms | None = None
    imaging_description: str | None = None


class ClinicalResponse(BaseModel):
    id: int
    patient_id: int
    major_criteria: dict
    symptoms: dict
    imaging_description: str | None
    diagnosis_score: int
    diagnosis_probability: float
    diagnosis_status: str
    diagnosis_reasoning: list
    test_results: list[TestResultResponse]
    culture_samples: list[CultureSampleResponse]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
