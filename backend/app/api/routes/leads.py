from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import get_current_user, get_current_seller
from app.models.user import User, UserRole
from app.models.lead import Lead, LeadStatus
from app.models.site_visit import SiteVisit, VisitStatus
from app.models.property import Property
from app.schemas.lead import LeadCreate, LeadResponse, SiteVisitCreate, SiteVisitResponse

router = APIRouter(tags=["Leads & Site Visits"])


# --- LEADS / ENQUIRIES ---
@router.post("/leads", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def submit_lead(
    lead_in: LeadCreate,
    current_user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Submit an enquiry / interest on a property listing."""
    prop_result = await db.execute(select(Property).where(Property.id == lead_in.property_id))
    prop = prop_result.scalars().first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")

    lead = Lead(
        property_id=lead_in.property_id,
        buyer_id=current_user.id if current_user else None,
        name=lead_in.name,
        phone=lead_in.phone,
        email=lead_in.email.lower().strip(),
        message=lead_in.message,
        interest_type=lead_in.interest_type,
        status=LeadStatus.NEW
    )
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    
    lead_resp = LeadResponse.model_validate(lead)
    lead_resp.property_title = prop.title
    return lead_resp


@router.get("/leads/my", response_model=List[LeadResponse])
async def get_my_seller_leads(
    current_seller: User = Depends(get_current_seller),
    db: AsyncSession = Depends(get_db)
):
    """Fetch all leads received for properties owned by current seller."""
    stmt = (
        select(Lead)
        .join(Lead.property)
        .where(Property.owner_id == current_seller.id)
        .options(selectinload(Lead.property))
        .order_by(Lead.created_at.desc())
    )
    result = await db.execute(stmt)
    leads = result.scalars().all()
    
    response = []
    for l in leads:
        lr = LeadResponse.model_validate(l)
        lr.property_title = l.property.title if l.property else None
        response.append(lr)
    return response


# --- SITE VISITS ---
@router.post("/site-visits", response_model=SiteVisitResponse, status_code=status.HTTP_201_CREATED)
async def schedule_site_visit(
    visit_in: SiteVisitCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Schedule a site visit for a property (Buyer)."""
    prop_result = await db.execute(select(Property).where(Property.id == visit_in.property_id))
    prop = prop_result.scalars().first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")

    visit = SiteVisit(
        property_id=visit_in.property_id,
        buyer_id=current_user.id,
        preferred_date=visit_in.preferred_date,
        preferred_time=visit_in.preferred_time,
        visitor_count=visit_in.visitor_count,
        message=visit_in.message,
        status=VisitStatus.REQUESTED
    )
    db.add(visit)
    await db.commit()
    await db.refresh(visit)

    vr = SiteVisitResponse.model_validate(visit)
    vr.property_title = prop.title
    vr.buyer_name = current_user.full_name
    vr.buyer_phone = current_user.phone
    return vr


@router.get("/site-visits/my", response_model=List[SiteVisitResponse])
async def get_my_site_visits(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get site visits for logged-in user (as Buyer or Seller)."""
    if current_user.role in [UserRole.SELLER, UserRole.ADMIN]:
        stmt = (
            select(SiteVisit)
            .join(SiteVisit.property)
            .where(Property.owner_id == current_user.id)
            .options(selectinload(SiteVisit.property), selectinload(SiteVisit.buyer))
            .order_by(SiteVisit.created_at.desc())
        )
    else:
        stmt = (
            select(SiteVisit)
            .where(SiteVisit.buyer_id == current_user.id)
            .options(selectinload(SiteVisit.property), selectinload(SiteVisit.buyer))
            .order_by(SiteVisit.created_at.desc())
        )

    result = await db.execute(stmt)
    visits = result.scalars().all()

    resp = []
    for v in visits:
        vr = SiteVisitResponse.model_validate(v)
        vr.property_title = v.property.title if v.property else None
        vr.buyer_name = v.buyer.full_name if v.buyer else None
        vr.buyer_phone = v.buyer.phone if v.buyer else None
        resp.append(vr)
    return resp
