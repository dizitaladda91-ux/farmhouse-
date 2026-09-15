from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.search_service import SmartQueryParser, SearchService
from app.schemas.property import PropertyListResponse

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("/smart", response_model=dict)
async def parse_smart_query(q: str = Query(..., description="Natural language search query")):
    """
    Parses natural language query like:
    'Farmhouse near Delhi under 3 crore with swimming pool'
    Extracts structured intent parameters.
    """
    parsed = SmartQueryParser.parse(q)
    return {
        "success": True,
        "parsed": parsed
    }


@router.get("/execute-smart", response_model=PropertyListResponse)
async def execute_smart_search(
    q: str = Query(..., description="Natural language search query"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """
    Parses natural language query and executes filtered backend search.
    """
    parsed = SmartQueryParser.parse(q)
    items, total = await SearchService.filter_properties(
        db=db,
        query=parsed["location_keyword"],
        property_type=parsed["property_type"],
        max_price=parsed["max_price"],
        min_price=parsed["min_price"],
        bedrooms=parsed["bedrooms"],
        page=page,
        limit=limit
    )
    pages = (total + limit - 1) // limit if limit > 0 else 0
    return PropertyListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=pages
    )
