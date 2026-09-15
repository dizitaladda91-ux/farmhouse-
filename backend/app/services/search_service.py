import re
from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy import select, func, or_, and_, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.property import Property, PropertyStatus, VerificationStatus, LandAreaUnit, PropertyType
from app.models.location import Location
from app.models.amenity import Amenity, PropertyAmenity
from app.models.property_media import PropertyMedia
from app.utils.helpers import normalize_land_area_to_sqft


class SmartQueryParser:
    """
    Parses natural language user queries like:
    'Farmhouse near Delhi under 3 crore with swimming pool'
    Extracts structured search parameters.
    """
    @staticmethod
    def parse(query_str: str) -> Dict[str, Any]:
        result = {
            "query_raw": query_str,
            "property_type": None,
            "location_keyword": None,
            "max_price": None,
            "min_price": None,
            "amenity_keywords": [],
            "bedrooms": None
        }

        q_lower = query_str.lower()

        # 1. Property Type matching
        type_mapping = {
            "farmhouse": PropertyType.FARMHOUSE,
            "farm house": PropertyType.FARMHOUSE,
            "bungalow": PropertyType.LUXURY_BUNGALOW,
            "luxury bungalow": PropertyType.LUXURY_BUNGALOW,
            "villa": PropertyType.VILLA,
            "estate": PropertyType.ESTATE,
            "weekend home": PropertyType.WEEKEND_HOME,
            "residential property": PropertyType.LARGE_RESIDENTIAL,
        }
        for term, ptype in type_mapping.items():
            if term in q_lower:
                result["property_type"] = ptype.value
                break

        # 2. Price Parsing (Crore / Lakh)
        # Match 'under X crore', 'under X cr', 'below X crore', 'under X lakh', etc.
        max_cr_match = re.search(r'(?:under|below|less than|<)\s*(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)', q_lower)
        if max_cr_match:
            result["max_price"] = float(max_cr_match.group(1)) * 10000000.0

        max_lakh_match = re.search(r'(?:under|below|less than|<)\s*(\d+(?:\.\d+)?)\s*(?:lakh|lacs|lac)', q_lower)
        if max_lakh_match and not result["max_price"]:
            result["max_price"] = float(max_lakh_match.group(1)) * 100000.0

        # Match 'between X and Y crore'
        between_match = re.search(r'between\s*(\d+(?:\.\d+)?)\s*(?:cr|crore)?\s*and\s*(\d+(?:\.\d+)?)\s*(?:cr|crore|lakh)', q_lower)
        if between_match:
            val1 = float(between_match.group(1))
            val2 = float(between_match.group(2))
            unit = 10000000.0 if "cr" in q_lower or "crore" in q_lower else 100000.0
            result["min_price"] = val1 * unit
            result["max_price"] = val2 * unit

        # 3. Location Keyword
        locations = ["delhi", "gurgaon", "noida", "chhatarpur", "alibaug", "goa", "assagao", "lonavala", "pune", "bangalore", "jaipur", "hyderabad"]
        for loc in locations:
            if loc in q_lower:
                result["location_keyword"] = loc
                break

        # 4. Amenities Keyword
        amenity_terms = {
            "swimming pool": "Swimming Pool",
            "pool": "Swimming Pool",
            "garden": "Private Lawn / Garden",
            "lawn": "Private Lawn / Garden",
            "security": "24x7 Security & CCTV",
            "power backup": "100% Power Backup",
            "gym": "Private Gym & Spa",
            "theatre": "Home Theatre",
            "orchard": "Organic Orchard & Trees",
        }
        for term, amenity_name in amenity_terms.items():
            if term in q_lower:
                if amenity_name not in result["amenity_keywords"]:
                    result["amenity_keywords"].append(amenity_name)

        # 5. Bedrooms
        bed_match = re.search(r'(\d+)\s*(?:bhk|bedroom|bed)', q_lower)
        if bed_match:
            result["bedrooms"] = int(bed_match.group(1))

        return result


class SearchService:
    @staticmethod
    async def filter_properties(
        db: AsyncSession,
        query: Optional[str] = None,
        location: Optional[str] = None,
        city: Optional[str] = None,
        locality: Optional[str] = None,
        property_type: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        min_land_area: Optional[float] = None,
        max_land_area: Optional[float] = None,
        land_area_unit: Optional[str] = "sqft",
        min_built_up_area: Optional[float] = None,
        max_built_up_area: Optional[float] = None,
        bedrooms: Optional[int] = None,
        bathrooms: Optional[int] = None,
        amenities: Optional[List[str]] = None,
        verification_status: Optional[str] = None,
        status: Optional[str] = PropertyStatus.AVAILABLE.value,
        furnishing: Optional[str] = None,
        is_featured: Optional[bool] = None,
        sort_by: Optional[str] = "relevance",
        page: int = 1,
        limit: int = 10,
    ) -> Tuple[List[Property], int]:
        stmt = (
            select(Property)
            .join(Property.location, isouter=True)
            .options(
                selectinload(Property.location),
                selectinload(Property.media),
                selectinload(Property.property_amenities).selectinload(PropertyAmenity.amenity),
                selectinload(Property.owner),
            )
        )

        conditions = []

        # Status filter
        if status:
            conditions.append(Property.status == status)

        # Keyword Search
        if query:
            q_term = f"%{query.strip()}%"
            conditions.append(
                or_(
                    Property.title.ilike(q_term),
                    Property.description.ilike(q_term),
                    Location.city.ilike(q_term),
                    Location.locality.ilike(q_term),
                    Location.state.ilike(q_term),
                )
            )

        # Location filters
        if location:
            loc_term = f"%{location.strip()}%"
            conditions.append(
                or_(
                    Location.city.ilike(loc_term),
                    Location.locality.ilike(loc_term),
                    Location.state.ilike(loc_term),
                )
            )
        if city:
            conditions.append(Location.city.ilike(f"%{city.strip()}%"))
        if locality:
            conditions.append(Location.locality.ilike(f"%{locality.strip()}%"))

        # Property type
        if property_type:
            conditions.append(Property.property_type == property_type)

        # Price range
        if min_price is not None:
            conditions.append(Property.price >= min_price)
        if max_price is not None:
            conditions.append(Property.price <= max_price)

        # Land area normalized filtering
        if min_land_area is not None:
            min_sqft = normalize_land_area_to_sqft(min_land_area, land_area_unit or "sqft")
            conditions.append(Property.land_area_sqft_normalized >= min_sqft)
        if max_land_area is not None:
            max_sqft = normalize_land_area_to_sqft(max_land_area, land_area_unit or "sqft")
            conditions.append(Property.land_area_sqft_normalized <= max_sqft)

        # Built up area
        if min_built_up_area is not None:
            conditions.append(Property.built_up_area_sqft >= min_built_up_area)
        if max_built_up_area is not None:
            conditions.append(Property.built_up_area_sqft <= max_built_up_area)

        # Bedrooms & Bathrooms
        if bedrooms is not None:
            conditions.append(Property.bedrooms >= bedrooms)
        if bathrooms is not None:
            conditions.append(Property.bathrooms >= bathrooms)

        # Verification & Furnishing & Featured
        if verification_status:
            conditions.append(Property.verification_status == verification_status)
        if furnishing:
            conditions.append(Property.furnishing == furnishing)
        if is_featured is not None:
            conditions.append(Property.is_featured == is_featured)

        if conditions:
            stmt = stmt.where(and_(*conditions))

        # Sorting
        if sort_by == "newest":
            stmt = stmt.order_by(desc(Property.created_at))
        elif sort_by == "price_asc":
            stmt = stmt.order_by(asc(Property.price))
        elif sort_by == "price_desc":
            stmt = stmt.order_by(desc(Property.price))
        elif sort_by == "land_area_desc":
            stmt = stmt.order_by(desc(Property.land_area_sqft_normalized))
        elif sort_by == "built_up_desc":
            stmt = stmt.order_by(desc(Property.built_up_area_sqft))
        else:
            # Default Relevance Ranking
            stmt = stmt.order_by(
                desc(Property.is_featured),
                desc(Property.verification_status == VerificationStatus.VERIFIED),
                desc(Property.created_at)
            )

        # Total count query
        count_stmt = select(func.count(Property.id)).join(Property.location, isouter=True)
        if conditions:
            count_stmt = count_stmt.where(and_(*conditions))
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        # Pagination
        stmt = stmt.offset((page - 1) * limit).limit(limit)
        results = await db.execute(stmt)
        properties = results.scalars().all()

        return properties, total
