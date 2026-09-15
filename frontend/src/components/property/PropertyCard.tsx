"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "@/types";
import { formatIndianPrice, formatLandArea } from "@/lib/utils";
import { ShieldCheck, Heart, Bed, Bath, Maximize2, MapPin, ArrowRight, UserCheck } from "lucide-react";
import Card3D from "@/components/ui/Card3D";

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
}

export default function PropertyCard({ property, onFavoriteToggle, isFavorite = false }: PropertyCardProps) {
  const [fav, setFav] = useState(isFavorite);
  const primaryMedia = property.media?.find((m) => m.is_primary) || property.media?.[0];
  const imageUrl = primaryMedia?.url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80";

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFav(!fav);
    if (onFavoriteToggle) {
      onFavoriteToggle(property.id);
    }
  };

  return (
    <Card3D intensity={8} depth={15} className="h-full">
      <div className="group relative bosa-card rounded-2xl overflow-hidden flex flex-col h-full bg-white shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-300">
        
        {/* 1. Image Container */}
        <div className="relative h-64 w-full overflow-hidden bg-slate-900">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* Top Header Badges */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md text-[11px] font-heading font-bold uppercase tracking-wider bosa-gradient-bg text-white shadow-md">
                FOR SALE
              </span>
              {property.verification_status === "VERIFIED" && (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-sans font-medium bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified
                </span>
              )}
            </div>

            <button
              onClick={handleFavoriteClick}
              className="w-9 h-9 rounded-full bg-white/90 border border-slate-200 hover:border-[#D4AF37] flex items-center justify-center backdrop-blur-md text-slate-700 hover:text-[#D4AF37] transition-colors shadow-sm"
            >
              <Heart className={`w-4 h-4 ${fav ? "fill-amber-500 text-amber-500" : ""}`} />
            </button>
          </div>

          {/* Bottom Property Type Tag */}
          <div className="absolute bottom-3 left-3.5 z-10">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-slate-900/90 text-white border border-slate-700 backdrop-blur-md">
              {property.property_type}
            </span>
          </div>
        </div>

        {/* 2. Content Details Section */}
        <div className="p-6 flex flex-col flex-grow justify-between font-sans">
          <div>
            {/* Price Header */}
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-heading text-2xl font-extrabold bosa-gradient-text">
                {formatIndianPrice(property.price)}
              </span>
              {property.built_up_area_sqft && (
                <span className="text-[11px] text-slate-500 font-mono">
                  ₹{Math.round(property.price / property.built_up_area_sqft).toLocaleString("en-IN")}/sqft
                </span>
              )}
            </div>

            {/* Title */}
            <Link href={`/properties/${property.id}`} className="block">
              <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                {property.title}
              </h3>
            </Link>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              <span className="truncate">
                {property.location ? `${property.location.locality}, ${property.location.city}` : "India"}
              </span>
            </div>
          </div>

          {/* 3. Specs Bar */}
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-200">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-slate-900 font-semibold font-heading">
                <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{formatLandArea(property.land_area_value, property.land_area_unit)}</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">Plot Size</span>
            </div>

            {property.bedrooms ? (
              <div className="flex flex-col items-center border-x border-slate-200">
                <div className="flex items-center gap-1 text-slate-900 font-semibold font-heading">
                  <Bed className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{property.bedrooms} Beds</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5">Bedrooms</span>
              </div>
            ) : (
              <div className="flex flex-col items-center border-x border-slate-200">
                <span className="text-slate-900 font-semibold font-heading">Estate</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Type</span>
              </div>
            )}

            <div className="flex flex-col items-center">
              {property.built_up_area_sqft ? (
                <>
                  <div className="flex items-center gap-1 text-slate-900 font-semibold font-heading">
                    <Bath className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{property.built_up_area_sqft.toLocaleString()} sqft</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5">Built-up</span>
                </>
              ) : (
                <>
                  <span className="text-slate-900 font-semibold font-heading">Ready</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Status</span>
                </>
              )}
            </div>
          </div>

          {/* 4. Seller Info Footer & Action Link */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-emerald-700">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] text-slate-600 font-medium truncate max-w-[120px]">
                {property.owner_name || "Verified Seller"}
              </span>
            </div>

            <Link
              href={`/properties/${property.id}`}
              className="px-3.5 py-1.5 rounded-lg bosa-gradient-bg text-white font-heading font-semibold text-xs flex items-center gap-1.5 hover:shadow-md transition-all"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </Card3D>
  );
}

