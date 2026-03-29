from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class TreatmentPlan(Base):
    __tablename__ = "treatment_plans"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id", ondelete="CASCADE"), unique=True)
    pathogen: Mapped[str] = mapped_column(String(100), nullable=False)
    resistance: Mapped[str | None] = mapped_column(String(100))
    iv_drug: Mapped[str | None] = mapped_column(String(255))
    iv_dosage: Mapped[str | None] = mapped_column(String(255))
    iv_duration: Mapped[str | None] = mapped_column(String(100))
    oral_drug: Mapped[str | None] = mapped_column(String(255))
    oral_dosage: Mapped[str | None] = mapped_column(String(255))
    oral_duration: Mapped[str | None] = mapped_column(String(100))
    citation: Mapped[str | None] = mapped_column(Text)
    confidence: Mapped[float] = mapped_column(Float, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    patient = relationship("Patient", back_populates="treatment_plan")
