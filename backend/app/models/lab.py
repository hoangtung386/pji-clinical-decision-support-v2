from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class LabResult(Base):
    __tablename__ = "lab_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id", ondelete="CASCADE"))
    day: Mapped[str] = mapped_column(String(50), nullable=False)
    wbc: Mapped[float | None] = mapped_column(Float)
    neu: Mapped[float | None] = mapped_column(Float)
    esr: Mapped[float | None] = mapped_column(Float)
    crp: Mapped[float | None] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    patient = relationship("Patient", back_populates="lab_results")
