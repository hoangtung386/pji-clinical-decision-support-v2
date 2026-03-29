import enum
from datetime import date, datetime, timezone

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ImplantType(str, enum.Enum):
    THA = "THA"
    TKA = "TKA"


class ImplantNature(str, enum.Enum):
    PRIMARY = "Primary"
    REVISION = "Revision"


class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    mrn: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    dob: Mapped[date] = mapped_column(Date, nullable=False)
    gender: Mapped[str] = mapped_column(String(20), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(20))
    address: Mapped[str | None] = mapped_column(Text)
    height: Mapped[float] = mapped_column(Float, default=0)
    weight: Mapped[float] = mapped_column(Float, default=0)
    bmi: Mapped[float] = mapped_column(Float, default=0)

    surgery_date: Mapped[date | None] = mapped_column(Date)
    symptom_date: Mapped[date | None] = mapped_column(Date)
    is_acute: Mapped[bool] = mapped_column(Boolean, default=False)

    implant_type: Mapped[ImplantType] = mapped_column(
        Enum(ImplantType), default=ImplantType.TKA
    )
    fixation_type: Mapped[str] = mapped_column(String(50), default="cemented")
    implant_nature: Mapped[ImplantNature] = mapped_column(
        Enum(ImplantNature), default=ImplantNature.PRIMARY
    )

    comorbidities: Mapped[dict] = mapped_column(JSONB, default=dict)
    medical_history: Mapped[str | None] = mapped_column(Text)
    past_medical_history: Mapped[str | None] = mapped_column(Text)
    related_characteristics: Mapped[dict] = mapped_column(JSONB, default=dict)
    surgical_history: Mapped[list] = mapped_column(JSONB, default=list)

    created_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    clinical_assessment = relationship("ClinicalAssessment", back_populates="patient", uselist=False, cascade="all, delete-orphan")
    lab_results = relationship("LabResult", back_populates="patient", cascade="all, delete-orphan")
    treatment_plan = relationship("TreatmentPlan", back_populates="patient", uselist=False, cascade="all, delete-orphan")
