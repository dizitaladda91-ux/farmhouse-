from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.favorite import Favorite
from app.models.property import Property
from app.schemas.property import PropertyResponse

router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.post("/{property_id}", status_code=status.HTTP_201_CREATED)
async def toggle_favorite(
    property_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Toggle property in buyer favorites (Save / Unsave)."""
    prop_result = await db.execute(select(Property).where(Property.id == property_id))
    if not prop_result.scalars().first():
        raise HTTPException(status_code=404, detail="Property not found")

    fav_stmt = select(Favorite).where(
        Favorite.user_id == current_user.id,
        Favorite.property_id == property_id
    )
    fav_result = await db.execute(fav_stmt)
    existing_fav = fav_result.scalars().first()

    if existing_fav:
        await db.delete(existing_fav)
        await db.commit()
        return {"saved": False, "message": "Property removed from saved favorites."}
    else:
        new_fav = Favorite(user_id=current_user.id, property_id=property_id)
        db.add(new_fav)
        await db.commit()
        return {"saved": True, "message": "Property saved to favorites."}


@router.get("/my", response_model=List[PropertyResponse])
async def get_my_favorites(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all saved properties for currently logged-in buyer."""
    stmt = (
        select(Property)
        .join(Favorite, Property.id == Favorite.property_id)
        .where(Favorite.user_id == current_user.id)
        .options(
            selectinload(Property.location),
            selectinload(Property.media),
            selectinload(Property.property_amenities),
            selectinload(Property.owner),
        )
    )
    result = await db.execute(stmt)
    return result.scalars().all()
