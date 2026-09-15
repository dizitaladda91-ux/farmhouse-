export type UserRole = "BUYER" | "SELLER" | "ADMIN";

export type PropertyType =
  | "Farmhouse"
  | "Luxury Bungalow"
  | "Villa"
  | "Estate"
  | "Weekend Home"
  | "Large Residential Property";

export type LandAreaUnit = "sqft" | "sqyd" | "acre" | "bigha";

export type PropertyStatus = "AVAILABLE" | "UNDER_OFFER" | "SOLD";

export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type FurnishingStatus = "Fully Furnished" | "Semi Furnished" | "Unfurnished";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
}

export interface Location {
  id: string;
  state: string;
  city: string;
  locality: string;
  address?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  nearby_places?: { category: string; name: string; distance: string }[];
}

export interface PropertyMedia {
  id: string;
  property_id: string;
  media_type: "IMAGE" | "VIDEO" | "TOUR_360" | "FLOOR_PLAN";
  url: string;
  is_primary: boolean;
  display_order: number;
}

export interface Amenity {
  id: string;
  name: string;
  category?: string;
  icon?: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description?: string;
  property_type: PropertyType;
  price: number;
  land_area_value: number;
  land_area_unit: LandAreaUnit;
  land_area_sqft_normalized: number;
  built_up_area_sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: FurnishingStatus;
  facing?: string;
  construction_age?: string;
  status: PropertyStatus;
  verification_status: VerificationStatus;
  is_featured: boolean;
  owner_id: string;
  owner_name?: string;
  owner_phone?: string;
  location_id: string;
  location?: Location;
  media: PropertyMedia[];
  amenities: Amenity[];
  views_count?: number;
  created_at: string;
  updated_at: string;
}

export interface FilterParams {
  query?: string;
  location?: string;
  city?: string;
  locality?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  min_land_area?: number;
  max_land_area?: number;
  land_area_unit?: LandAreaUnit;
  min_built_up_area?: number;
  max_built_up_area?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  verification_status?: VerificationStatus;
  status?: PropertyStatus;
  furnishing?: FurnishingStatus;
  is_featured?: boolean;
  sort_by?: "relevance" | "newest" | "price_asc" | "price_desc" | "land_area_desc" | "built_up_desc";
  page?: number;
  limit?: number;
}

export interface Lead {
  id: string;
  property_id: string;
  property_title?: string;
  buyer_id?: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
  interest_type: "Buy" | "Request Information" | "Request Callback" | "Schedule Visit";
  status: "NEW" | "CONTACTED" | "CLOSED";
  created_at: string;
}

export interface SiteVisit {
  id: string;
  property_id: string;
  property_title?: string;
  buyer_id: string;
  buyer_name?: string;
  buyer_phone?: string;
  preferred_date: string;
  preferred_time: string;
  visitor_count: number;
  message?: string;
  status: "Requested" | "Accepted" | "Rescheduled" | "Completed" | "Cancelled";
  created_at: string;
}
