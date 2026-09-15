import uuid
from typing import List, Optional, Tuple
from sqlalchemy import select, func, or_, and_, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models.property import Property, PropertyStatus, VerificationStatus, LandAreaUnit, PropertyType
from app.models.location import Location
from app.models.amenity import Amenity, PropertyAmenity
from app.models.property_media import PropertyMedia, MediaType
from app.models.user import User, UserRole
from app.schemas.property import PropertyCreate, PropertyUpdate
from app.utils.helpers import normalize_land_area_to_sqft, generate_slug


class PropertyService:
    @staticmethod
    async def create_property(db: AsyncSession, owner_id: str, prop_in: PropertyCreate) -> Property:
        # Create Location
        loc_data = prop_in.location.model_dump()
        location = Location(**loc_data)
        db.add(location)
        await db.flush()

        # Calculate normalized land area
        normalized_sqft = normalize_land_area_to_sqft(prop_in.land_area_value, prop_in.land_area_unit.value)
        slug = generate_slug(prop_in.title, str(uuid.uuid4())[:8])

        property_obj = Property(
            title=prop_in.title,
            slug=slug,
            description=prop_in.description,
            property_type=prop_in.property_type,
            price=prop_in.price,
            land_area_value=prop_in.land_area_value,
            land_area_unit=prop_in.land_area_unit,
            land_area_sqft_normalized=normalized_sqft,
            built_up_area_sqft=prop_in.built_up_area_sqft,
            bedrooms=prop_in.bedrooms,
            bathrooms=prop_in.bathrooms,
            furnishing=prop_in.furnishing,
            facing=prop_in.facing,
            construction_age=prop_in.construction_age,
            status=prop_in.status,
            verification_status=VerificationStatus.PENDING,  # Needs admin verification
            is_featured=prop_in.is_featured,
            owner_id=owner_id,
            location_id=location.id,
        )
        db.add(property_obj)
        await db.flush()

        # Attach Media
        if prop_in.media:
            for idx, m in enumerate(prop_in.media):
                media_obj = PropertyMedia(
                    property_id=property_obj.id,
                    media_type=m.media_type,
                    url=m.url,
                    is_primary=m.is_primary or (idx == 0),
                    display_order=m.display_order or idx
                )
                db.add(media_obj)

        # Attach Amenities
        if prop_in.amenity_ids:
            for aid in prop_in.amenity_ids:
                pa = PropertyAmenity(property_id=property_obj.id, amenity_id=aid)
                db.add(pa)

        await db.commit()
        return await PropertyService.get_by_id(db, property_obj.id)

    @staticmethod
    async def get_by_id(db: AsyncSession, property_id: str, increment_views: bool = False) -> Optional[Property]:
        stmt = (
            select(Property)
            .where(Property.id == property_id)
            .options(
                selectinload(Property.location),
                selectinload(Property.media),
                selectinload(Property.property_amenities).selectinload(PropertyAmenity.amenity),
                selectinload(Property.owner),
            )
        )
        result = await db.execute(stmt)
        prop = result.scalars().first()
        if prop and increment_views:
            prop.views_count += 1
            await db.commit()
        return prop

    @staticmethod
    async def get_by_slug(db: AsyncSession, slug: str) -> Optional[Property]:
        stmt = (
            select(Property)
            .where(Property.slug == slug)
            .options(
                selectinload(Property.location),
                selectinload(Property.media),
                selectinload(Property.property_amenities).selectinload(PropertyAmenity.amenity),
                selectinload(Property.owner),
            )
        )
        result = await db.execute(stmt)
        return result.scalars().first()

    @staticmethod
    async def update_property(db: AsyncSession, property_id: str, user: User, prop_in: PropertyUpdate) -> Property:
        prop = await PropertyService.get_by_id(db, property_id)
        if not prop:
            raise HTTPException(status_code=404, detail="Property not found")
        if prop.owner_id != user.id and user.role != UserRole.ADMIN:
            raise HTTPException(status_code=403, detail="Not authorized to modify this property")

        update_data = prop_in.model_dump(exclude_unset=True)
        amenity_ids = update_data.pop("amenity_ids", None)

        if "land_area_value" in update_data or "land_area_unit" in update_data:
            unit = update_data.get("land_area_unit", prop.land_area_unit).value
            val = update_data.get("land_area_value", prop.land_area_value)
            prop.land_area_sqft_normalized = normalize_land_area_to_sqft(val, unit)

        for field, value in update_data.items():
            setattr(prop, field, value)

        if amenity_ids is not None:
            # Clear old and set new
            await db.execute(
                PropertyAmenity.__table__.delete().where(PropertyAmenity.property_id == property_id)
            )
            for aid in amenity_ids:
                db.add(PropertyAmenity(property_id=property_id, amenity_id=aid))

        await db.commit()
        return await PropertyService.get_by_id(db, property_id)

    @staticmethod
    async def delete_property(db: AsyncSession, property_id: str, user: User) -> bool:
        prop = await PropertyService.get_by_id(db, property_id)
        if not prop:
            raise HTTPException(status_code=404, detail="Property not found")
        if prop.owner_id != user.id and user.role != UserRole.ADMIN:
            raise HTTPException(status_code=403, detail="Not authorized to delete this property")

        await db.delete(prop)
        await db.commit()
        return True
