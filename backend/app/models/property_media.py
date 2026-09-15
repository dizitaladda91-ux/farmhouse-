import uuid
from enum import Enum as PyEnum
from sqlalchemy import String, Boolean, Integer, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class MediaType(str, PyEnum):
    IMAGE = "IMAGE"
    VIDEO = "VIDEO"
    TOUR_360 = "TOUR_360"
    FLOOR_PLAN = "FLOOR_PLAN"


class PropertyMedia(Base):
    __tablename__ = "property_media"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id: Mapped[str] = mapped_column(String(36), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, index=True)
    media_type: Mapped[MediaType] = mapped_column(Enum(MediaType), default=MediaType.IMAGE, nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    property = relationship("Property", back_populates="media")
