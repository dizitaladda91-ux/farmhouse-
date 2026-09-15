import re
from typing import Tuple, Optional


# Unit conversion factors to Normalized Square Feet (sqft)
# 1 Sq Yd = 9 Sq Ft
# 1 Acre = 43,560 Sq Ft
# 1 Bigha (Standard North Indian benchmark) = 27,225 Sq Ft (approx 0.625 acre or 3025 sq.yd)
UNIT_CONVERSION_TO_SQFT = {
    "sqft": 1.0,
    "sqyd": 9.0,
    "acre": 43560.0,
    "bigha": 27225.0,
}


def normalize_land_area_to_sqft(value: float, unit: str) -> float:
    """
    Converts any Indian land area measurement (sqft, sqyd, acre, bigha)
    to a normalized square feet float value for accurate indexing and filtering.
    """
    unit_clean = unit.lower().strip()
    factor = UNIT_CONVERSION_TO_SQFT.get(unit_clean, 1.0)
    return round(float(value) * factor, 2)


def generate_slug(title: str, id_prefix: Optional[str] = None) -> str:
    """
    Generates SEO friendly URL slug from title.
    Example: 'Luxury Farmhouse in Chhatarpur' -> 'luxury-farmhouse-in-chhatarpur-a1b2'
    """
    slug = title.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_-]+', '-', slug)
    slug = slug.strip('-')
    if id_prefix:
        slug = f"{slug}-{id_prefix[:8]}"
    return slug


def format_indian_currency(amount: float) -> str:
    """
    Formats price into Lakhs (Lakh) or Crores (Cr) in Indian numbering system.
    Example: 25000000 -> '₹ 2.50 Cr', 7500000 -> '₹ 75 Lakh'
    """
    if amount >= 10000000:
        cr = amount / 10000000.0
        return f"₹ {cr:.2f}".rstrip('0').rstrip('.') + " Cr"
    elif amount >= 100000:
        lakh = amount / 100000.0
        return f"₹ {lakh:.2f}".rstrip('0').rstrip('.') + " Lakh"
    else:
        return f"₹ {amount:,.0f}"
