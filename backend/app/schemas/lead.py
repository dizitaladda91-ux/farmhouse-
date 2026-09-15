from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.lead import LeadStatus, InterestType
from app.models.site_visit import VisitStatus


class LeadCreate(BaseModel):
    property_id: str
    name: str
    phone: str
    email: EmailStr
    message: Optional[str] = None
    interest_type: InterestType = InterestType.BUY


class LeadResponse(BaseModel):
    id: str
    property_id: str
    property_title: Optional[str] = None
    buyer_id: Optional[str] = None
    name: str
    phone: str
    email: EmailStr
    message: Optional[str] = None
    interest_type: InterestType
    status: LeadStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SiteVisitCreate(BaseModel):
    property_id: str
    preferred_date: str
    preferred_time: str
    visitor_count: int = 1
    message: Optional[str] = None


class SiteVisitResponse(BaseModel):
    id: str
    property_id: str
    property_title: Optional[str] = None
    buyer_id: str
    buyer_name: Optional[str] = None
    buyer_phone: Optional[str] = None
    preferred_date: str
    preferred_time: str
    visitor_count: int
    message: Optional[str] = None
    status: VisitStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
