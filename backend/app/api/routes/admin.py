from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import get_current_admin
from app.models.user import User, UserRole
from app.models.property import Property, VerificationStatus, PropertyStatus
from app.models.lead import Lead
from app.models.site_visit import SiteVisit
from app.models.verification import Verification
from app.schemas.property import PropertyResponse
from app.schemas.user import UserResponse

router = APIRouter(prefix="/admin", tags=["Admin Portal"])


@router.get("/analytics")
async def get_admin_analytics(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Platform-wide operational analytics for admin dashboard."""
    total_users = (await db.execute(select(func.count(User.id)))).scalar_one()
    total_buyers = (await db.execute(select(func.count(User.id)).where(User.role == UserRole.BUYER))).scalar_one()
    total_sellers = (await db.execute(select(func.count(User.id)).where(User.role == UserRole.SELLER))).scalar_one()
    
    total_properties = (await db.execute(select(func.count(Property.id)))).scalar_one()
    active_properties = (await db.execute(select(func.count(Property.id)).where(Property.status == PropertyStatus.AVAILABLE))).scalar_one()
    pending_verification = (await db.execute(select(func.count(Property.id)).where(Property.verification_status == VerificationStatus.PENDING))).scalar_one()
    verified_properties = (await db.execute(select(func.count(Property.id)).where(Property.verification_status == VerificationStatus.VERIFIED))).scalar_one()
    sold_properties = (await db.execute(select(func.count(Property.id)).where(Property.status == PropertyStatus.SOLD))).scalar_one()

    total_leads = (await db.execute(select(func.count(Lead.id)))).scalar_one()
    total_visits = (await db.execute(select(func.count(SiteVisit.id)))).scalar_one()

    return {
        "users": {
            "total": total_users,
            "buyers": total_buyers,
            "sellers": total_sellers,
        },
        "properties": {
            "total": total_properties,
            "active": active_properties,
            "pending_verification": pending_verification,
            "verified": verified_properties,
            "sold": sold_properties,
        },
        "engagement": {
            "total_leads": total_leads,
            "total_visits": total_visits,
        }
    }


@router.get("/properties/pending", response_model=List[PropertyResponse])
async def list_pending_verification_properties(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """List properties awaiting admin verification."""
    stmt = (
        select(Property)
        .where(Property.verification_status == VerificationStatus.PENDING)
        .options(
            selectinload(Property.location),
            selectinload(Property.media),
            selectinload(Property.owner),
        )
        .order_by(desc(Property.created_at))
    )
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/properties/{property_id}/verify")
async def verify_property(
    property_id: str,
    status_choice: str = Query(..., description="VERIFIED or REJECTED"),
    notes: Optional[str] = Query(None),
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Approve or Reject a property listing and assign Verified badge."""
    prop_result = await db.execute(select(Property).where(Property.id == property_id))
    prop = prop_result.scalars().first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")

    if status_choice.upper() == "VERIFIED":
        prop.verification_status = VerificationStatus.VERIFIED
    elif status_choice.upper() == "REJECTED":
        prop.verification_status = VerificationStatus.REJECTED
    else:
        raise HTTPException(status_code=400, detail="Invalid status. Use VERIFIED or REJECTED.")

    verif_record = Verification(
        property_id=prop.id,
        reviewer_id=admin.id,
        status=prop.verification_status.value,
        notes=notes
    )
    db.add(verif_record)
    await db.commit()

    return {
        "success": True,
        "property_id": prop.id,
        "verification_status": prop.verification_status.value,
        "message": f"Property listing status set to {prop.verification_status.value}."
    }


@router.get("/users", response_model=List[UserResponse])
async def list_all_users(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """List all registered users for admin moderation."""
    stmt = select(User).order_by(desc(User.created_at))
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/users/{user_id}/toggle-active")
async def toggle_user_active(
    user_id: str,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Suspend or reactivate user account."""
    user_res = await db.execute(select(User).where(User.id == user_id))
    u = user_res.scalars().first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    if u.role == UserRole.ADMIN:
        raise HTTPException(status_code=400, detail="Cannot deactivate admin accounts")

    u.is_active = not u.is_active
    await db.commit()
    return {"user_id": u.id, "is_active": u.is_active}
