import React from "react";
import { Property } from "@/types";

interface RealEstateSchemaProps {
  property?: Property;
  siteUrl?: string;
}

export default function RealEstateSchema({ property, siteUrl = "https://haveliestates.in" }: RealEstateSchemaProps) {
  if (!property) {
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Haveli & Estates",
      "description": "India's Premier Verified Luxury Farmhouse, Bungalow & Villa Marketplace",
      "url": siteUrl,
      "logo": `${siteUrl}/images/farmhouse-hero.jpg`,
      "areaServed": [
        { "@type": "AdministrativeArea", "name": "Delhi NCR" },
        { "@type": "AdministrativeArea", "name": "Gurgaon" },
        { "@type": "AdministrativeArea", "name": "Goa" },
        { "@type": "AdministrativeArea", "name": "Alibaug" },
        { "@type": "AdministrativeArea", "name": "Lonavala" }
      ],
      "priceRange": "₹2.5 Cr - ₹50 Cr+"
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    );
  }

  const propertySchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `${siteUrl}/properties/${property.id}`,
    "image": property.media?.[0]?.url ? `${siteUrl}${property.media[0].url}` : `${siteUrl}/images/farmhouse-hero.jpg`,
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "INR",
      "availability": property.status === "AVAILABLE" ? "https://schema.org/InStock" : "https://schema.org/SoldOut"
    },
    "category": property.property_type,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location?.city || "Delhi NCR",
      "addressRegion": property.location?.state || "Delhi",
      "streetAddress": property.location?.locality || "Luxury Green Belt",
      "addressCountry": "IN"
    },
    "numberOfRooms": property.bedrooms || 4,
    "numberOfBathroomsTotal": property.bathrooms || 4,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.land_area_value,
      "unitText": property.land_area_unit
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
    />
  );
}
