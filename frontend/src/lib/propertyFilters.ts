import { Property } from "@/types";

export interface PropertyFilterParams {
  query?: string;
  smart_query?: string;
  location?: string;
  city?: string;
  state?: string;
  property_type?: string;
  min_price?: number | string;
  max_price?: number | string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  min_land_area?: number | string;
  max_land_area?: number | string;
  land_area_unit?: string;
  verification_status?: string;
  sort_by?: string;
}

/**
 * Parses natural language smart query like:
 * "Farmhouse in Delhi under 10 crore 4 bhk"
 */
export function parseSmartQuery(queryStr: string): Partial<PropertyFilterParams> {
  const params: Partial<PropertyFilterParams> = {};
  const q = queryStr.toLowerCase();

  // 1. Property Type
  if (q.includes("farmhouse") || q.includes("farm house")) {
    params.property_type = "Farmhouse";
  } else if (q.includes("bungalow") || q.includes("kothi")) {
    params.property_type = "Luxury Bungalow";
  } else if (q.includes("villa")) {
    params.property_type = "Villa";
  } else if (q.includes("estate")) {
    params.property_type = "Estate";
  }

  // 2. Location
  const knownLocations = [
    { key: "chhatarpur", value: "Delhi" },
    { key: "delhi", value: "Delhi" },
    { key: "gurgaon", value: "Gurgaon" },
    { key: "gurugram", value: "Gurgaon" },
    { key: "noida", value: "Noida" },
    { key: "alibaug", value: "Alibaug" },
    { key: "goa", value: "Goa" },
    { key: "assagao", value: "Goa" },
    { key: "lonavala", value: "Lonavala" },
    { key: "mumbai", value: "Mumbai" },
    { key: "bangalore", value: "Bangalore" },
    { key: "bengaluru", value: "Bangalore" },
  ];

  for (const loc of knownLocations) {
    if (q.includes(loc.key)) {
      params.location = loc.value;
      break;
    }
  }

  // 3. Price parsing (Crore / Lakh)
  const maxCrMatch = q.match(/(?:under|below|less than|within|upto|up to|<)\s*(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)/);
  if (maxCrMatch) {
    params.max_price = parseFloat(maxCrMatch[1]) * 10000000;
  }

  const minCrMatch = q.match(/(?:above|more than|min|>)\s*(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)/);
  if (minCrMatch) {
    params.min_price = parseFloat(minCrMatch[1]) * 10000000;
  }

  // 4. Bedrooms
  const bedMatch = q.match(/(\d+)\s*(?:bhk|bedroom|bed|beds)/);
  if (bedMatch) {
    params.bedrooms = bedMatch[1];
  }

  return params;
}

/**
 * Normalizes location matching to support regional synonyms
 * e.g. "Delhi NCR" matches Delhi, Gurgaon, Noida
 */
function matchesLocation(prop: Property, searchLoc: string): boolean {
  if (!searchLoc || !searchLoc.trim()) return true;

  const needle = searchLoc.trim().toLowerCase();
  const city = (prop.location?.city || "").toLowerCase();
  const state = (prop.location?.state || "").toLowerCase();
  const locality = (prop.location?.locality || "").toLowerCase();
  const address = (prop.location?.address || "").toLowerCase();
  const title = (prop.title || "").toLowerCase();
  const desc = (prop.description || "").toLowerCase();

  // Exact or substring match in any address field
  if (
    city.includes(needle) ||
    locality.includes(needle) ||
    state.includes(needle) ||
    address.includes(needle) ||
    title.includes(needle) ||
    desc.includes(needle)
  ) {
    return true;
  }

  // Delhi NCR special handling
  if (needle === "delhi" || needle === "delhi ncr") {
    if (city === "delhi" || state === "delhi" || locality.includes("chhatarpur") || locality.includes("mehrauli")) {
      return true;
    }
    // If user searched broad "Delhi NCR", include Gurgaon and Noida
    if (needle === "delhi ncr" && (city === "gurgaon" || city === "noida")) {
      return true;
    }
  }

  // Goa regional handling (Assagao, Vagator, Candolim, Anjuna)
  if (needle === "goa" || needle === "north goa") {
    if (city === "goa" || state === "goa" || locality.includes("assagao") || locality.includes("vagator") || locality.includes("candolim")) {
      return true;
    }
  }

  // Alibaug regional handling (Mandwa, Awas)
  if (needle === "alibaug") {
    if (city === "alibaug" || locality.includes("mandwa") || locality.includes("awas")) {
      return true;
    }
  }

  return false;
}

/**
 * Filters a list of properties with exact criterion matching
 */
export function filterPropertyList(
  properties: Property[],
  filters: PropertyFilterParams
): Property[] {
  // If smart query is provided, merge parsed filters
  let effectiveFilters = { ...filters };
  if (effectiveFilters.smart_query && effectiveFilters.smart_query.trim()) {
    const parsed = parseSmartQuery(effectiveFilters.smart_query.trim());
    effectiveFilters = {
      ...effectiveFilters,
      ...parsed,
      query: effectiveFilters.query || effectiveFilters.smart_query,
    };
  }

  return properties.filter((prop) => {
    // 1. Property Type
    if (effectiveFilters.property_type && effectiveFilters.property_type.trim()) {
      const filterType = effectiveFilters.property_type.trim().toLowerCase();
      const propType = (prop.property_type || "").toLowerCase();
      if (filterType !== propType) {
        return false;
      }
    }

    // 2. Location (City / Enclave / Search text)
    const locSearch = effectiveFilters.location || effectiveFilters.city;
    if (locSearch && locSearch.trim()) {
      if (!matchesLocation(prop, locSearch)) {
        return false;
      }
    }

    // 3. State filter
    if (effectiveFilters.state && effectiveFilters.state.trim()) {
      const stateSearch = effectiveFilters.state.trim().toLowerCase();
      const propState = (prop.location?.state || "").toLowerCase();
      if (stateSearch === "delhi" || stateSearch === "delhi ncr") {
        if (!propState.includes("delhi") && !(prop.location?.city || "").toLowerCase().includes("delhi")) {
          return false;
        }
      } else if (!propState.includes(stateSearch)) {
        return false;
      }
    }

    // 4. Min Price
    if (effectiveFilters.min_price !== undefined && effectiveFilters.min_price !== "") {
      const minP = Number(effectiveFilters.min_price);
      if (!isNaN(minP) && minP > 0) {
        if (prop.price < minP) return false;
      }
    }

    // 5. Max Price (Strict upper bound)
    if (effectiveFilters.max_price !== undefined && effectiveFilters.max_price !== "") {
      const maxP = Number(effectiveFilters.max_price);
      if (!isNaN(maxP) && maxP > 0) {
        if (prop.price > maxP) return false;
      }
    }

    // 6. Bedrooms (Min bedrooms, e.g. 4+ BHK means >= 4)
    if (effectiveFilters.bedrooms !== undefined && effectiveFilters.bedrooms !== "") {
      const minBeds = Number(effectiveFilters.bedrooms);
      if (!isNaN(minBeds) && minBeds > 0) {
        if (!prop.bedrooms || prop.bedrooms < minBeds) return false;
      }
    }

    // 7. Bathrooms
    if (effectiveFilters.bathrooms !== undefined && effectiveFilters.bathrooms !== "") {
      const minBaths = Number(effectiveFilters.bathrooms);
      if (!isNaN(minBaths) && minBaths > 0) {
        if (!prop.bathrooms || prop.bathrooms < minBaths) return false;
      }
    }

    // 8. Verification Status
    if (effectiveFilters.verification_status && effectiveFilters.verification_status.trim()) {
      if (prop.verification_status !== effectiveFilters.verification_status.trim()) {
        return false;
      }
    }

    // 9. Text Keyword Search (query)
    if (effectiveFilters.query && effectiveFilters.query.trim()) {
      const q = effectiveFilters.query.trim().toLowerCase();
      const titleMatch = (prop.title || "").toLowerCase().includes(q);
      const descMatch = (prop.description || "").toLowerCase().includes(q);
      const cityMatch = (prop.location?.city || "").toLowerCase().includes(q);
      const localityMatch = (prop.location?.locality || "").toLowerCase().includes(q);
      const stateMatch = (prop.location?.state || "").toLowerCase().includes(q);
      const typeMatch = (prop.property_type || "").toLowerCase().includes(q);
      const amenityMatch = (prop.amenities || []).some((a) =>
        a.name.toLowerCase().includes(q)
      );

      if (!titleMatch && !descMatch && !cityMatch && !localityMatch && !stateMatch && !typeMatch && !amenityMatch) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    // Sorting
    switch (effectiveFilters.sort_by) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "newest":
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case "land_area_desc":
        return (b.land_area_sqft_normalized || 0) - (a.land_area_sqft_normalized || 0);
      case "relevance":
      default:
        // Featured first, then verified, then price descending
        if (a.is_featured !== b.is_featured) {
          return a.is_featured ? -1 : 1;
        }
        if (a.verification_status === "VERIFIED" && b.verification_status !== "VERIFIED") {
          return -1;
        }
        if (b.verification_status === "VERIFIED" && a.verification_status !== "VERIFIED") {
          return 1;
        }
        return b.price - a.price;
    }
  });
}
