import uuid
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Amenity(Base):
    __tablename__ = "amenities"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(50), nullable=True)
    icon: Mapped[str] = mapped_column(String(50), nullable=True)

    property_amenities = relationship("PropertyAmenity", back_populates="amenity", cascade="all, delete-orphan")


class PropertyAmenity(Base):
    __tablename__ = "property_amenities"

    property_id: Mapped[str] = mapped_column(String(36), ForeignKey("properties.id", ondelete="CASCADE"), primary_key=True)
    amenity_id: Mapped[str] = mapped_column(String(36), ForeignKey("amenities.id", ondelete="CASCADE"), primary_key=True)

    property = relationship("Property", back_populates="property_amenities")
    amenity = relationship("Amenity", back_populates="property_amenities")
