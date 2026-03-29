from datetime import date, datetime

from pydantic import BaseModel


class Comorbidities(BaseModel):
    diabetes: bool = False
    smoking: bool = False
    immunosuppression: bool = False
    prior_infection: bool = False
    malnutrition: bool = False
    liver_disease: bool = False


class CharacteristicEntry(BaseModel):
    checked: bool = False
    note: str = ""


class RelatedCharacteristics(BaseModel):
    allergy: CharacteristicEntry = CharacteristicEntry()
    drugs: CharacteristicEntry = CharacteristicEntry()
    alcohol: CharacteristicEntry = CharacteristicEntry()
    smoking: CharacteristicEntry = CharacteristicEntry()
    other: CharacteristicEntry = CharacteristicEntry()


class SurgicalHistoryRow(BaseModel):
    surgery_date: str = ""
    procedure: str = ""
    notes: str = ""


class PatientCreate(BaseModel):
    mrn: str
    name: str
    dob: date
    gender: str
    phone: str | None = None
    address: str | None = None
    height: float = 0
    weight: float = 0
    surgery_date: date | None = None
    symptom_date: date | None = None
    implant_type: str = "TKA"
    fixation_type: str = "cemented"
    implant_nature: str = "Primary"
    comorbidities: Comorbidities = Comorbidities()
    medical_history: str | None = None
    past_medical_history: str | None = None
    related_characteristics: RelatedCharacteristics = RelatedCharacteristics()
    surgical_history: list[SurgicalHistoryRow] = []


class PatientUpdate(BaseModel):
    name: str | None = None
    dob: date | None = None
    gender: str | None = None
    phone: str | None = None
    address: str | None = None
    height: float | None = None
    weight: float | None = None
    surgery_date: date | None = None
    symptom_date: date | None = None
    implant_type: str | None = None
    fixation_type: str | None = None
    implant_nature: str | None = None
    comorbidities: Comorbidities | None = None
    medical_history: str | None = None
    past_medical_history: str | None = None
    related_characteristics: RelatedCharacteristics | None = None
    surgical_history: list[SurgicalHistoryRow] | None = None


class PatientResponse(BaseModel):
    id: int
    mrn: str
    name: str
    dob: date
    gender: str
    phone: str | None
    address: str | None
    height: float
    weight: float
    bmi: float
    surgery_date: date | None
    symptom_date: date | None
    is_acute: bool
    implant_type: str
    fixation_type: str
    implant_nature: str
    comorbidities: dict
    medical_history: str | None
    past_medical_history: str | None
    related_characteristics: dict
    surgical_history: list
    created_by: int | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PatientListResponse(BaseModel):
    id: int
    mrn: str
    name: str
    dob: date
    gender: str
    implant_type: str
    is_acute: bool
    created_at: datetime

    model_config = {"from_attributes": True}
