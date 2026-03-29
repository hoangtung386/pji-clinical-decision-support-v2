import enum
from datetime import datetime, timezone

from sqlalchemy import (
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


class DiagnosisStatus(str, enum.Enum):
    INFECTED = "Infected"
    INCONCLUSIVE = "Inconclusive"
    NOT_INFECTED = "Not Infected"


class CultureStatus(str, enum.Enum):
    NEGATIVE = "negative"
    POSITIVE = "positive"


class ImageTypeEnum(str, enum.Enum):
    X_RAY = "X-ray"
    CT = "CT"
    ULTRASOUND = "Ultrasound"


class TestCategory(str, enum.Enum):
    HEMATOLOGY = "hematology"
    BIOCHEMISTRY = "biochemistry"
    FLUID = "fluid"
    OTHER = "other"
    FLUID_ANALYSIS = "fluid_analysis"


class ClinicalAssessment(Base):
    __tablename__ = "clinical_assessments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id", ondelete="CASCADE"), unique=True)

    major_criteria: Mapped[dict] = mapped_column(JSONB, default=dict)
    symptoms: Mapped[dict] = mapped_column(JSONB, default=dict)
    imaging_description: Mapped[str | None] = mapped_column(Text)

    # Diagnosis result
    diagnosis_score: Mapped[int] = mapped_column(Integer, default=0)
    diagnosis_probability: Mapped[float] = mapped_column(Float, default=0)
    diagnosis_status: Mapped[DiagnosisStatus] = mapped_column(
        Enum(DiagnosisStatus), default=DiagnosisStatus.INCONCLUSIVE
    )
    diagnosis_reasoning: Mapped[list] = mapped_column(JSONB, default=list)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    patient = relationship("Patient", back_populates="clinical_assessment")
    test_results = relationship("TestResult", back_populates="assessment", cascade="all, delete-orphan")
    culture_samples = relationship("CultureSample", back_populates="assessment", cascade="all, delete-orphan")
    diagnostic_images = relationship("DiagnosticImage", back_populates="assessment", cascade="all, delete-orphan")


class TestResult(Base):
    __tablename__ = "test_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    assessment_id: Mapped[int] = mapped_column(ForeignKey("clinical_assessments.id", ondelete="CASCADE"))
    category: Mapped[TestCategory] = mapped_column(Enum(TestCategory), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    result: Mapped[str | None] = mapped_column(String(100))
    normal_range: Mapped[str | None] = mapped_column(String(100))
    unit: Mapped[str | None] = mapped_column(String(50))

    assessment = relationship("ClinicalAssessment", back_populates="test_results")


class CultureSample(Base):
    __tablename__ = "culture_samples"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    assessment_id: Mapped[int] = mapped_column(ForeignKey("clinical_assessments.id", ondelete="CASCADE"))
    sample_number: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[CultureStatus] = mapped_column(Enum(CultureStatus), default=CultureStatus.NEGATIVE)
    bacteria_name: Mapped[str | None] = mapped_column(String(255))

    assessment = relationship("ClinicalAssessment", back_populates="culture_samples")


class DiagnosticImage(Base):
    __tablename__ = "diagnostic_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    assessment_id: Mapped[int] = mapped_column(ForeignKey("clinical_assessments.id", ondelete="CASCADE"))
    image_type: Mapped[ImageTypeEnum] = mapped_column(Enum(ImageTypeEnum), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    assessment = relationship("ClinicalAssessment", back_populates="diagnostic_images")
