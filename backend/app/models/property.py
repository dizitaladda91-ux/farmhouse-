import uuid
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import String, Float, Integer, Text, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class PropertyType(str, PyEnum):
    FARMHOUSE = "Farmhouse"
    LUXURY_BUNGALOW = "Luxury Bungalow"
    VILLA = "Villa"
    ESTATE = "Estate"
    WEEKEND_HOME = "Weekend Home"
    LARGE_RESIDENTIAL = "Large Residential Property"


class LandAreaUnit(str, PyEnum):
    SQFT = "sqft"
    SQYD = "sqyd"
    ACRE = "acre"
    BIGHA = "bigha"


class PropertyStatus(str, PyEnum):
    AVAILABLE = "AVAILABLE"
    UNDER_OFFER = "UNDER_OFFER"
    SOLD = "SOLD"


class VerificationStatus(str, PyEnum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"


class FurnishingStatus(str, PyEnum):
    FULLY_FURNISHED = "Fully Furnished"
    SEMI_FURNISHED = "Semi Furnished"
    UNFURNISHED = "Unfurnished"


class Property(Base):
    __tablename__ = "properties"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    
    property_type: Mapped[PropertyType] = mapped_column(Enum(PropertyType), nullable=False, index=True)
    price: Mapped[float] = mapped_column(Float, nullable=False, index=True)
    
    land_area_value: Mapped[float] = mapped_column(Float, nullable=False)
    land_area_unit: Mapped[LandAreaUnit] = mapped_column(Enum(LandAreaUnit), default=LandAreaUnit.SQFT, nullable=False)
    land_area_sqft_normalized: Mapped[float] = mapped_column(Float, nullable=False, index=True)
    
    built_up_area_sqft: Mapped[float] = mapped_column(Float, nullable=True, index=True)
    bedrooms: Mapped[int] = mapped_column(Integer, nullable=True, index=True)
    bathrooms: Mapped[int] = mapped_column(Integer, nullable=True, index=True)
    furnishing: Mapped[FurnishingStatus] = mapped_column(Enum(FurnishingStatus), nullable=True)
    facing: Mapped[str] = mapped_column(String(50), nullable=True)
    construction_age: Mapped[str] = mapped_column(String(50), nullable=True)
    
    status: Mapped[PropertyStatus] = mapped_column(Enum(PropertyStatus), default=PropertyStatus.AVAILABLE, nullable=False, index=True)
    verification_status: Mapped[VerificationStatus] = mapped_column(Enum(VerificationStatus), default=VerificationStatus.PENDING, nullable=False, index=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    views_count: Mapped[int] = mapped_column(Integer, default=0)

    owner_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    location_id: Mapped[str] = mapped_column(String(36), ForeignKey("locations.id", ondelete="SET NULL"), nullable=True, index=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    owner = relationship("User", back_populates="properties")
    location = relationship("Location", back_populates="properties")
    media = relationship("PropertyMedia", back_populates="property", cascade="all, delete-orphan", order_by="PropertyMedia.display_order")
    property_amenities = relationship("PropertyAmenity", back_populates="property", cascade="all, delete-orphan")
    leads = relationship("Lead", back_populates="property", cascade="all, delete-orphan")
    site_visits = relationship("SiteVisit", back_populates="property", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="property", cascade="all, delete-orphan")
    verifications = relationship("Verification", back_populates="property", cascade="all, delete-orphan")
