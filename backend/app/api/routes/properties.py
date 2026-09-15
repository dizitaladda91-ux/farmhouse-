from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user, get_current_seller
from app.models.user import User
from app.schemas.property import (
    PropertyCreate, PropertyUpdate, PropertyResponse, PropertyListResponse
)
from app.services.property_service import PropertyService
from app.services.search_service import SearchService

router = APIRouter(prefix="/properties", tags=["Properties"])


@router.post("", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
async def create_property(
    prop_in: PropertyCreate,
    current_seller: User = Depends(get_current_seller),
    db: AsyncSession = Depends(get_db)
):
    """Create a new property listing (Seller or Admin)."""
    return await PropertyService.create_property(db, current_seller.id, prop_in)


@router.get("", response_model=PropertyListResponse)
async def list_properties(
    query: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    locality: Optional[str] = Query(None),
    property_type: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    min_land_area: Optional[float] = Query(None),
    max_land_area: Optional[float] = Query(None),
    land_area_unit: Optional[str] = Query("sqft"),
    min_built_up_area: Optional[float] = Query(None),
    max_built_up_area: Optional[float] = Query(None),
    bedrooms: Optional[int] = Query(None),
    bathrooms: Optional[int] = Query(None),
    status: Optional[str] = Query("AVAILABLE"),
    furnishing: Optional[str] = Query(None),
    is_featured: Optional[bool] = Query(None),
    sort_by: Optional[str] = Query("relevance"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """List public properties with rich filtering and relevance sorting."""
    items, total = await SearchService.filter_properties(
        db=db,
        query=query,
        location=location,
        city=city,
        locality=locality,
        property_type=property_type,
        min_price=min_price,
        max_price=max_price,
        min_land_area=min_land_area,
        max_land_area=max_land_area,
        land_area_unit=land_area_unit,
        min_built_up_area=min_built_up_area,
        max_built_up_area=max_built_up_area,
        bedrooms=bedrooms,
        bathrooms=bathrooms,
        verification_status="VERIFIED",
        status=status,
        furnishing=furnishing,
        is_featured=is_featured,
        sort_by=sort_by,
        page=page,
        limit=limit,
    )
    pages = (total + limit - 1) // limit if limit > 0 else 0
    return PropertyListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=pages
    )


@router.get("/slug/{slug}", response_model=PropertyResponse)
async def get_property_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    """Fetch property details by SEO slug."""
    prop = await PropertyService.get_by_slug(db, slug)
    if not prop or prop.verification_status.value != "VERIFIED" or prop.status.value != "AVAILABLE":
        raise HTTPException(status_code=404, detail="Property not found")
    return prop


@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property_by_id(property_id: str, db: AsyncSession = Depends(get_db)):
    """Fetch property details by ID and increment view count."""
    prop = await PropertyService.get_by_id(db, property_id, increment_views=True)
    if not prop or prop.verification_status.value != "VERIFIED" or prop.status.value != "AVAILABLE":
        raise HTTPException(status_code=404, detail="Property not found")
    return prop


@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: str,
    prop_in: PropertyUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update existing property listing (Owner or Admin)."""
    return await PropertyService.update_property(db, property_id, current_user, prop_in)


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property(
    property_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete property listing (Owner or Admin)."""
    await PropertyService.delete_property(db, property_id, current_user)
    return None
