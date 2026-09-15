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
  Sparkles, TreePine, Waves, Home, Building2, ChevronRight, RotateCcw
} from "lucide-react";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState(false);

  // Filters State
  const [query, setQuery] = useState(searchParams.get("smart_query") || searchParams.get("query") || "");
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || searchParams.get("location") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("property_type") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [landAreaUnit, setLandAreaUnit] = useState<"sqft" | "sqyd" | "acre" | "bigha">("sqft");
  const [minLandArea, setMinLandArea] = useState("");
  const [maxLandArea, setMaxLandArea] = useState("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [page, setPage] = useState(1);

  // Available Data Categories
  const categoriesList = [
    { id: "Farmhouse", name: "Farmhouses", icon: TreePine, desc: "Chhatarpur & DLF Farms", count: "18+ Available" },
    { id: "Villa", name: "Coastal & Hill Villas", icon: Waves, desc: "Alibaug, Goa & Lonavala", count: "15+ Available" },
    { id: "Luxury Bungalow", name: "Luxury Bungalows", icon: Home, desc: "Gurgaon & Prime Cities", count: "12+ Available" },
  ];

  const topStatesList = [
    { name: "All States", value: "" },
    { name: "Delhi NCR", value: "Delhi" },
    { name: "Haryana", value: "Haryana" },
    { name: "Maharashtra", value: "Maharashtra" },
    { name: "Goa", value: "Goa" },
  ];

  const topCitiesList = [
    { name: "All Cities", value: "" },
    { name: "Delhi (Chhatarpur)", value: "Delhi" },
    { name: "Gurgaon (Golf Course)", value: "Gurgaon" },
    { name: "Alibaug (Coastal Belt)", value: "Alibaug" },
    { name: "North Goa (Assagao)", value: "Goa" },
    { name: "Lonavala (Tungarli)", value: "Lonavala" },
  ];

  useEffect(() => {
    loadFilteredProperties();
  }, [query, selectedState, selectedCity, propertyType, minPrice, maxPrice, landAreaUnit, minLandArea, maxLandArea, bedrooms, verificationStatus, sortBy, page]);

  async function loadFilteredProperties() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (selectedState) params.append("state", selectedState);
      if (selectedCity) params.append("location", selectedCity);
      if (propertyType) params.append("property_type", propertyType);
      if (minPrice) params.append("min_price", minPrice);
      if (maxPrice) params.append("max_price", maxPrice);
      if (landAreaUnit) params.append("land_area_unit", landAreaUnit);
      if (minLandArea) params.append("min_land_area", minLandArea);
      if (maxLandArea) params.append("max_land_area", maxLandArea);
      if (bedrooms) params.append("bedrooms", bedrooms);
      if (verificationStatus) params.append("verification_status", verificationStatus);
      if (sortBy) params.append("sort_by", sortBy);
      params.append("page", page.toString());
      params.append("limit", "12");

      const data = await fetchApi<{ items: Property[]; total: number }>(`/properties?${params.toString()}`);
      setProperties(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to load properties", err);
    } finally {
      setLoading(false);
    }
  }

  const resetFilters = () => {
    setQuery("");
    setSelectedState("");
    setSelectedCity("");
    setPropertyType("");
    setMinPrice("");
    setMaxPrice("");
    setMinLandArea("");
    setMaxLandArea("");
    setBedrooms("");
    setVerificationStatus("");
    setSortBy("relevance");
    setPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      
      {/* HEADER BANNER */}
      <div className="bg-white border-b border-slate-200 py-12 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Curated Estate Discovery</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Explore Luxury <span className="bosa-gradient-text">Estates & Mansions</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-normal">
            Showing {total} verified farmhouses, villas, and luxury bungalows available for purchase across India.
          </p>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-12 w-full">
        
        {/* ==================================================================== */}
        {/* 1. TOP CATEGORIES WE SELL */}
        {/* ==================================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#D4AF37]">
                1. Property Types We Sell
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Choose Category
              </h2>
            </div>

            {propertyType && (
              <button
                onClick={() => setPropertyType("")}
                className="text-xs text-emerald-700 hover:underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Show All Categories</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoriesList.map((cat) => {
              const IconComp = cat.icon;
              const isActive = propertyType === cat.id;

              return (
                <Card3D key={cat.id} intensity={8} depth={15}>
                  <div
                    onClick={() => {
                      setPropertyType(isActive ? "" : cat.id);
                      setPage(1);
                    }}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center space-x-4 ${
                      isActive
                        ? "bosa-gradient-bg text-white shadow-xl border-[#D4AF37]"
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-900"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-800"
                    }`}>
                      <IconComp className="w-6 h-6" />
                    </div>

                    <div>
                      <span className={`text-[10px] font-mono uppercase tracking-widest block font-bold ${
                        isActive ? "text-amber-200" : "text-[#D4AF37]"
                      }`}>
                        {cat.count}
                      </span>
                      <h3 className="font-heading text-lg font-bold leading-tight">
                        {cat.name}
                      </h3>
                      <p className={`text-xs mt-0.5 ${isActive ? "text-emerald-100" : "text-slate-500"}`}>
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                </Card3D>
              );
            })}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 2. TOP STATES WHERE PROPERTIES ARE LOCATED */}
        {/* ==================================================================== */}
        <section className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#D4AF37]">
              2. Prime State Regions
            </span>
            <h2 className="font-heading text-xl font-bold text-slate-900 mt-0.5">
              Filter by Top States
            </h2>
          </div>

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
                  className={`px-5 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
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
        </section>

        {/* ==================================================================== */}
        {/* 3. TOP CITIES & ENCLAVES */}
        {/* ==================================================================== */}
        <section className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#D4AF37]">
              3. Prime City Enclaves
            </span>
            <h2 className="font-heading text-xl font-bold text-slate-900 mt-0.5">
              Filter by Top Cities & Destinations
            </h2>
          </div>

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
                  className={`px-5 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
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
        </section>

        {/* ==================================================================== */}
        {/* 4. FILTER CONTROL DOCK & SORTING BAR */}
        {/* ==================================================================== */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Left: Quick Search Input */}
            <div className="relative w-full md:w-96">
              <MapPin className="w-4 h-4 text-emerald-800 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by city, locality, or keyword..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <button
                onClick={() => setExpandedFilter(!expandedFilter)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2 hover:bg-slate-200 transition-all"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                <span>{expandedFilter ? "Hide Filters" : "More Filters (Budget/Area)"}</span>
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
                  className="bg-transparent focus:outline-none cursor-pointer font-bold"
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="newest">Sort: Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="land_area_desc">Largest Plot Size</option>
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
                    <option value="sqft">Sq.Ft.</option>
                    <option value="sqyd">Sq.Yd.</option>
                    <option value="acre">Acres</option>
                    <option value="bigha">Bigha</option>
                  </select>
                </div>
                <input
                  type="number"
                  value={minLandArea}
                  onChange={(e) => setMinLandArea(e.target.value)}
                  placeholder={`Min Area in ${landAreaUnit.toUpperCase()}`}
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
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ==================================================================== */}
        {/* 5. ALL PROPERTIES GRID / MAP DISPLAY */}
        {/* ==================================================================== */}
        <section className="space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-heading text-xl font-bold text-slate-900">
              Listing Results ({properties.length} Properties)
            </h3>
            
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Title-Audited Legal Listings</span>
            </div>
          </div>

          {showMap && (
            <div className="h-80 rounded-2xl bg-slate-900 text-white p-6 flex items-center justify-center text-center">
              <div className="space-y-2">
                <MapIcon className="w-10 h-10 text-[#D4AF37] mx-auto" />
                <h3 className="font-heading text-lg font-bold">Interactive Estate Map View</h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Displaying pin clusters for luxury properties across Delhi NCR, Gurgaon, Alibaug, Goa & Lonavala.
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
              <Filter className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">No Properties Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Try selecting a different State, City, or Property Type filter above.
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

export default function SearchResultsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <Suspense fallback={
        <div className="py-20 text-center text-xs text-emerald-800 font-bold">
          Loading Luxury Real Estate Marketplace...
        </div>
      }>
        <SearchResultsContent />
      </Suspense>
    </div>
  );
}
