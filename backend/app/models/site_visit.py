import uuid
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import String, Integer, Text, DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class VisitStatus(str, PyEnum):
    REQUESTED = "Requested"
    ACCEPTED = "Accepted"
    RESCHEDULED = "Rescheduled"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"


class SiteVisit(Base):
    __tablename__ = "site_visits"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id: Mapped[str] = mapped_column(String(36), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, index=True)
    buyer_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    preferred_date: Mapped[str] = mapped_column(String(20), nullable=False)
    preferred_time: Mapped[str] = mapped_column(String(20), nullable=False)
    visitor_count: Mapped[int] = mapped_column(Integer, default=1)
    message: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[VisitStatus] = mapped_column(Enum(VisitStatus), default=VisitStatus.REQUESTED, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    property = relationship("Property", back_populates="site_visits")
    buyer = relationship("User")
