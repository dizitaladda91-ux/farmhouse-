from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from app.models.property import PropertyType, LandAreaUnit, PropertyStatus, VerificationStatus, FurnishingStatus
from app.models.property_media import MediaType


class LocationBase(BaseModel):
    state: str
    city: str
    locality: str
    address: Optional[str] = None
    pincode: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    nearby_places: Optional[List[dict]] = None


class LocationCreate(LocationBase):
    pass


class LocationResponse(LocationBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


class MediaBase(BaseModel):
    media_type: MediaType = MediaType.IMAGE
    url: str
    is_primary: bool = False
    display_order: int = 0


class MediaCreate(MediaBase):
    pass


class MediaResponse(MediaBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


class AmenityResponse(BaseModel):
    id: str
    name: str
    category: Optional[str] = None
    icon: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PropertyBase(BaseModel):
    title: str
    description: Optional[str] = None
    property_type: PropertyType
    price: float = Field(gt=0, description="Price in INR")
    land_area_value: float = Field(gt=0)
    land_area_unit: LandAreaUnit = LandAreaUnit.SQFT
    built_up_area_sqft: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    furnishing: Optional[FurnishingStatus] = None
    facing: Optional[str] = None
    construction_age: Optional[str] = None
    status: PropertyStatus = PropertyStatus.AVAILABLE
    is_featured: bool = False


class PropertyCreate(PropertyBase):
    location: LocationCreate
    amenity_ids: Optional[List[str]] = []
    media: Optional[List[MediaCreate]] = []


class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    property_type: Optional[PropertyType] = None
    price: Optional[float] = None
    land_area_value: Optional[float] = None
    land_area_unit: Optional[LandAreaUnit] = None
    built_up_area_sqft: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    furnishing: Optional[FurnishingStatus] = None
    facing: Optional[str] = None
    construction_age: Optional[str] = None
    status: Optional[PropertyStatus] = None
    is_featured: Optional[bool] = None
    amenity_ids: Optional[List[str]] = None


class PropertyResponse(PropertyBase):
    id: str
    slug: str
    land_area_sqft_normalized: float
    verification_status: VerificationStatus
    views_count: int
    owner_id: str
    owner_name: Optional[str] = None
    owner_phone: Optional[str] = None
    location: Optional[LocationResponse] = None
    media: List[MediaResponse] = []
    amenities: List[AmenityResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PropertyListResponse(BaseModel):
    items: List[PropertyResponse]
    total: int
    page: int
    limit: int
    pages: int
