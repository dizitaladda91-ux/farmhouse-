"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import Card3D from "@/components/ui/Card3D";
import { Property } from "@/types";
import { fetchApi } from "@/lib/api";
import {
  SlidersHorizontal, MapPin, Filter, ArrowUpDown, ShieldCheck, Map as MapIcon, Grid,
  Sparkles, TreePine, RotateCcw, CheckCircle2, ChevronRight, Flower2
} from "lucide-react";

function FarmhousesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState(false);

  // Filter States (Locked to Farmhouse category by default)
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || searchParams.get("location") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [landAreaUnit, setLandAreaUnit] = useState<"sqft" | "sqyd" | "acre" | "bigha">("sqft");
  const [minLandArea, setMinLandArea] = useState("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [page, setPage] = useState(1);

  const topStatesList = [
    { name: "All States", value: "" },
    { name: "Delhi NCR", value: "Delhi" },
    { name: "Haryana", value: "Haryana" },
    { name: "Maharashtra", value: "Maharashtra" },
    { name: "Goa", value: "Goa" },
  ];

  const topCitiesList = [
    { name: "All Locations", value: "" },
    { name: "Chhatarpur (Delhi)", value: "Delhi" },
    { name: "DLF Farms (Gurgaon)", value: "Gurgaon" },
    { name: "Alibaug (Coastal)", value: "Alibaug" },
    { name: "Assagao (Goa)", value: "Goa" },
    { name: "Lonavala (Hills)", value: "Lonavala" },
  ];

  useEffect(() => {
    loadFarmhouses();
  }, [query, selectedState, selectedCity, minPrice, maxPrice, landAreaUnit, minLandArea, bedrooms, verificationStatus, sortBy, page]);

  async function loadFarmhouses() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("property_type", "Farmhouse");
      if (query) params.append("query", query);
      if (selectedState) params.append("state", selectedState);
      if (selectedCity) params.append("location", selectedCity);
      if (minPrice) params.append("min_price", minPrice);
      if (maxPrice) params.append("max_price", maxPrice);
      if (landAreaUnit) params.append("land_area_unit", landAreaUnit);
      if (minLandArea) params.append("min_land_area", minLandArea);
      if (bedrooms) params.append("bedrooms", bedrooms);
      if (verificationStatus) params.append("verification_status", verificationStatus);
      if (sortBy) params.append("sort_by", sortBy);
      params.append("page", page.toString());
      params.append("limit", "12");

      const data = await fetchApi<{ items: Property[]; total: number }>(`/properties?${params.toString()}`);
      setProperties(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to load farmhouses", err);
    } finally {
      setLoading(false);
    }
  }

  const resetFilters = () => {
    setQuery("");
    setSelectedState("");
    setSelectedCity("");
    setMinPrice("");
    setMaxPrice("");
    setMinLandArea("");
    setBedrooms("");
    setVerificationStatus("");
    setSortBy("relevance");
    setPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      
      {/* ==================================================================== */}
      {/* 1. HERO SLOGAN BANNER (SLOGAN TYPE HEADER) */}
      {/* ==================================================================== */}
      <section className="bg-white border-b border-slate-200 py-12 px-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-widest shadow-sm">
            <TreePine className="w-4 h-4 text-[#D4AF37]" />
            <span>Exclusive Farmhouse Collection</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Luxury Farmhouses & Country Estates — <span className="bosa-gradient-text">Where Tranquility Meets Opulence</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover handpicked, title-verified farmhouses with expansive green lawns, private pool sanctuaries, and organic acreage across Chhatarpur, DLF Farms, Gurgaon, Goa & Alibaug.
          </p>

          {/* Quick Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>100% Legal Title Audited</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Flower2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Sprawling Organic Plots (1 - 10+ Acres)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Gated Countryside Privacy</span>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-8 w-full">
        
        {/* ==================================================================== */}
        {/* 2. FILTER CONTROLS DOCK (STATES + CITIES + SEARCH + ADVANCED) */}
        {/* ==================================================================== */}
        <section className="space-y-4">
          
          {/* Quick Location Pills */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            
            {/* States Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#D4AF37] shrink-0">
                States:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {topStatesList.map((st) => {
                  const isActive = selectedState === st.value;
                  return (
                    <button
                      key={st.name}
                      onClick={() => {
                        setSelectedState(st.value);
                        setPage(1);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                        isActive
                          ? "bosa-gradient-bg text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      {st.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cities Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-t border-slate-100 pt-3">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#D4AF37] shrink-0">
                Enclaves:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {topCitiesList.map((ct) => {
                  const isActive = selectedCity === ct.value;
                  return (
                    <button
                      key={ct.name}
                      onClick={() => {
                        setSelectedCity(ct.value);
                        setPage(1);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        isActive
                          ? "bosa-gradient-bg text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 ${isActive ? "text-amber-200" : "text-emerald-700"}`} />
                      <span>{ct.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Search Bar & Sort Dock */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Search Query Input */}
              <div className="relative w-full md:w-96">
                <MapPin className="w-4 h-4 text-emerald-800 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search farmhouses by locality, title or keyword..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <button
                  onClick={() => setExpandedFilter(!expandedFilter)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2 hover:bg-slate-200 transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                  <span>{expandedFilter ? "Hide Filters" : "Budget & Acreage Filters"}</span>
                </button>

                <button
                  onClick={() => setShowMap(!showMap)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
                >
                  {showMap ? <Grid className="w-4 h-4 text-[#D4AF37]" /> : <MapIcon className="w-4 h-4 text-[#D4AF37]" />}
                  <span>{showMap ? "Grid Only" : "Map View"}</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800">
                  <ArrowUpDown className="w-3.5 h-3.5 text-emerald-800" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent focus:outline-none cursor-pointer font-bold text-xs"
                  >
                    <option value="relevance">Sort: Relevance</option>
                    <option value="newest">Sort: Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="land_area_desc">Largest Plot Area</option>
                  </select>
                </div>
              </div>

            </div>

            {/* EXPANDABLE ADVANCED FILTERS PANEL */}
            {expandedFilter && (
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Budget Range */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Max Budget (₹)</label>
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  >
                    <option value="">Any Budget</option>
                    <option value="30000000">Up to ₹3 Cr</option>
                    <option value="50000000">Up to ₹5 Cr</option>
                    <option value="100000000">Up to ₹10 Cr</option>
                    <option value="250000000">Up to ₹25 Cr+</option>
                  </select>
                </div>

                {/* Land Area Filter */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-800">Land Area Unit</label>
                    <select
                      value={landAreaUnit}
                      onChange={(e) => setLandAreaUnit(e.target.value as any)}
                      className="bg-slate-100 text-[10px] text-emerald-800 font-bold border border-slate-200 rounded px-1"
                    >
                      <option value="acre">Acres</option>
                      <option value="bigha">Bigha</option>
                      <option value="sqyd">Sq.Yd.</option>
                      <option value="sqft">Sq.Ft.</option>
                    </select>
                  </div>
                  <input
                    type="number"
                    value={minLandArea}
                    onChange={(e) => setMinLandArea(e.target.value)}
                    placeholder={`Min Plot Size in ${landAreaUnit.toUpperCase()}`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>

                {/* Verification & Reset */}
                <div className="flex items-center justify-between pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={verificationStatus === "VERIFIED"}
                      onChange={(e) => setVerificationStatus(e.target.checked ? "VERIFIED" : "")}
                      className="w-4 h-4 text-emerald-800 rounded"
                    />
                    <span>100% Verified Only</span>
                  </label>

                  <button
                    onClick={resetFilters}
                    className="text-emerald-700 hover:underline font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 3. LISTED FARMHOUSE PROPERTY CARDS */}
        {/* ==================================================================== */}
        <section className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#D4AF37]">
                Verified Countryside Listings
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Available Farmhouses ({total} Estates)
              </h2>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Direct Seller & Owner Postings</span>
            </div>
          </div>

          {showMap && (
            <div className="h-80 rounded-2xl bg-slate-900 text-white p-6 flex items-center justify-center text-center">
              <div className="space-y-2">
                <MapIcon className="w-10 h-10 text-[#D4AF37] mx-auto" />
                <h3 className="font-heading text-lg font-bold">Farmhouse Estate Map View</h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Displaying acreage clusters across Delhi NCR, Gurgaon, Alibaug, Assagao & Lonavala.
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-white animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 my-8 shadow-sm">
              <TreePine className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">No Farmhouses Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Try adjusting your state, city, budget, or land area filters to view active listings.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bosa-gradient-bg text-white font-bold text-xs uppercase tracking-wider shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default function FarmhousesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <Suspense fallback={
        <div className="py-20 text-center text-xs text-emerald-800 font-bold">
          Loading Luxury Farmhouse Collection...
        </div>
      }>
        <FarmhousesContent />
      </Suspense>
    </div>
  );
}
