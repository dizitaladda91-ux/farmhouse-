import uuid
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import String, Text, DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class DocumentType(str, PyEnum):
    TITLE_DEED = "Title Deed"
    MUTATION_CERTIFICATE = "Mutation Certificate"
    KHATA_EXTRACT = "Khata Extract"
    ELECTRICITY_BILL = "Electricity Bill"
    SELLER_ID = "Seller Government ID"
    OTHER = "Other Legal Document"


class Verification(Base):
    __tablename__ = "verifications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id: Mapped[str] = mapped_column(String(36), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, index=True)
    reviewer_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    document_type: Mapped[DocumentType] = mapped_column(Enum(DocumentType), default=DocumentType.TITLE_DEED, nullable=False)
    document_url: Mapped[str] = mapped_column(String(500), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="PENDING", nullable=False)  # PENDING, APPROVED, REJECTED
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    property = relationship("Property", back_populates="verifications")
    reviewer = relationship("User")
