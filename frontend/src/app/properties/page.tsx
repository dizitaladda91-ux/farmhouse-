"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import Card3D from "@/components/ui/Card3D";
import { Property } from "@/types";
import { fetchApi } from "@/lib/api";
import { MOCK_PROPERTIES } from "@/lib/mockData";
import { filterPropertyList } from "@/lib/propertyFilters";
import {
  SlidersHorizontal, MapPin, Filter, ArrowUpDown, ShieldCheck, Map as MapIcon, Grid,
  Sparkles, TreePine, Waves, Home, Building2, ChevronRight, RotateCcw, X, Bed, IndianRupee
} from "lucide-react";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState(false);

  // Filters State (initialized from searchParams)
  const [query, setQuery] = useState(searchParams.get("smart_query") || searchParams.get("query") || "");
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || searchParams.get("location") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("property_type") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [landAreaUnit, setLandAreaUnit] = useState<"sqft" | "sqyd" | "acre" | "bigha">("sqft");
  const [minLandArea, setMinLandArea] = useState("");
  const [maxLandArea, setMaxLandArea] = useState("");
  const [bedrooms, setBedrooms] = useState<string>(searchParams.get("bedrooms") || "");
  const [verificationStatus, setVerificationStatus] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [page, setPage] = useState(1);

  // Keep state synced whenever URL search params change
  useEffect(() => {
    const q = searchParams.get("smart_query") || searchParams.get("query");
    const loc = searchParams.get("city") || searchParams.get("location");
    const pType = searchParams.get("property_type");
    const maxP = searchParams.get("max_price");
    const minP = searchParams.get("min_price");
    const beds = searchParams.get("bedrooms");
    const st = searchParams.get("state");

    if (q !== null) setQuery(q);
    if (loc !== null) setSelectedCity(loc);
    if (pType !== null) setPropertyType(pType);
    if (maxP !== null) setMaxPrice(maxP);
    if (minP !== null) setMinPrice(minP);
    if (beds !== null) setBedrooms(beds);
    if (st !== null) setSelectedState(st);
  }, [searchParams]);

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
    { name: "Gurgaon (DLF & Golf Course)", value: "Gurgaon" },
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

      let apiLoaded = false;
      try {
        const data = await fetchApi<{ items: Property[]; total: number }>(`/properties?${params.toString()}`);
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          // Double filter client-side to enforce strict exactness
          const filtered = filterPropertyList(data.items, {
            query,
            location: selectedCity,
            city: selectedCity,
            state: selectedState,
            property_type: propertyType,
            min_price: minPrice,
            max_price: maxPrice,
            bedrooms,
            verification_status: verificationStatus,
            sort_by: sortBy,
          });
          setProperties(filtered);
          setTotal(filtered.length);
          apiLoaded = true;
        }
      } catch (err) {
        // Backend offline or error -> fallback to rich mock data
      }

      if (!apiLoaded) {
        const filtered = filterPropertyList(MOCK_PROPERTIES, {
          query,
          location: selectedCity,
          city: selectedCity,
          state: selectedState,
          property_type: propertyType,
          min_price: minPrice,
          max_price: maxPrice,
          bedrooms,
          verification_status: verificationStatus,
          sort_by: sortBy,
        });
        setProperties(filtered);
        setTotal(filtered.length);
      }
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
    router.push("/properties");
  };

  // Check active filter count
  const hasActiveFilters = Boolean(
    query || selectedCity || selectedState || propertyType || minPrice || maxPrice || bedrooms || verificationStatus
  );

  const formatBudgetDisplay = (val: string) => {
    const num = Number(val);
    if (!num) return "";
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(0)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(0)} Lakh`;
    return `₹${num}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      
      {/* HEADER BANNER */}
      <div className="bg-white border-b border-slate-200 py-12 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Verified Luxury Estate Discovery</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Explore Luxury <span className="bosa-gradient-text">Estates & Mansions</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-normal">
            Showing {total} verified farmhouses, villas, and luxury bungalows available for purchase across India.
          </p>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-8 w-full">
        
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
        {/* 2. TOP CITIES & ENCLAVES */}
        {/* ==================================================================== */}
        <section className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#D4AF37]">
                2. Prime City Enclaves
              </span>
              <h2 className="font-heading text-xl font-bold text-slate-900 mt-0.5">
                Filter by Top Cities & Destinations
              </h2>
            </div>
            {selectedCity && (
              <button
                onClick={() => setSelectedCity("")}
                className="text-xs text-emerald-700 hover:underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>All Cities</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {topCitiesList.map((ct) => {
              const isActive = selectedCity.toLowerCase() === ct.value.toLowerCase() || (!selectedCity && ct.value === "");
              return (
                <button
                  key={ct.name}
                  onClick={() => {
                    setSelectedCity(ct.value);
                    setPage(1);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bosa-gradient-bg text-white shadow-md border border-[#D4AF37]"
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
        {/* 3. FILTER CONTROL DOCK & SORTING BAR */}
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
                placeholder="Search city (e.g. Delhi), area, or keyword..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap sm:flex-nowrap">
              <button
                onClick={() => setExpandedFilter(!expandedFilter)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  expandedFilter || maxPrice || bedrooms || minPrice
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                <span>{expandedFilter ? "Hide Budget & Beds" : "Budget & Bedroom Filters"}</span>
                {(maxPrice || bedrooms) && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                )}
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
                  className="bg-transparent focus:outline-none cursor-pointer font-bold text-slate-900"
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="newest">Sort: Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="land_area_desc">Largest Land Area</option>
                </select>
              </div>
            </div>

          </div>

          {/* EXPANDABLE ADVANCED FILTERS PANEL */}
          {expandedFilter && (
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              
              {/* Max Budget */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Max Budget (₹)</label>
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-emerald-600"
                >
                  <option value="">Any Budget</option>
                  <option value="50000000">Up to ₹5 Crore</option>
                  <option value="100000000">Up to ₹10 Crore</option>
                  <option value="200000000">Up to ₹20 Crore</option>
                  <option value="350000000">Up to ₹35 Crore</option>
                  <option value="500000000">Up to ₹50 Crore+</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Bedrooms (BHK)</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-emerald-600"
                >
                  <option value="">Any Bedrooms</option>
                  <option value="3">3+ BHK Suites</option>
                  <option value="4">4+ BHK Luxury</option>
                  <option value="5">5+ BHK Grand</option>
                  <option value="6">6+ BHK Mansions</option>
                </select>
              </div>

              {/* State */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">State / Region</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-emerald-600"
                >
                  <option value="">All States</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Goa">Goa</option>
                </select>
              </div>

              {/* Verification & Reset */}
              <div className="flex flex-col justify-end gap-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={verificationStatus === "VERIFIED"}
                    onChange={(e) => setVerificationStatus(e.target.checked ? "VERIFIED" : "")}
                    className="w-4 h-4 text-emerald-800 rounded accent-emerald-700"
                  />
                  <span>100% Verified Only</span>
                </label>

                <button
                  onClick={resetFilters}
                  className="text-left text-xs text-emerald-700 hover:underline font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE FILTER BADGES ROW */}
          {hasActiveFilters && (
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider">Active Filters:</span>
              
              {selectedCity && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold">
                  <MapPin className="w-3 h-3 text-emerald-700" />
                  <span>City: {selectedCity}</span>
                  <button onClick={() => setSelectedCity("")} className="hover:text-red-700 ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {propertyType && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 font-semibold">
                  <span>Type: {propertyType}</span>
                  <button onClick={() => setPropertyType("")} className="hover:text-red-700 ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {maxPrice && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
                  <IndianRupee className="w-3 h-3 text-amber-700" />
                  <span>Max: {formatBudgetDisplay(maxPrice)}</span>
                  <button onClick={() => setMaxPrice("")} className="hover:text-red-700 ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {bedrooms && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 font-semibold">
                  <Bed className="w-3 h-3 text-blue-700" />
                  <span>Bedrooms: {bedrooms}+ BHK</span>
                  <button onClick={() => setBedrooms("")} className="hover:text-red-700 ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {query && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 font-semibold">
                  <span>&quot;{query}&quot;</span>
                  <button onClick={() => setQuery("")} className="hover:text-red-700 ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={resetFilters}
                className="text-xs text-slate-500 hover:text-slate-800 underline ml-2 font-medium"
              >
                Clear all
              </button>
            </div>
          )}

        </section>

        {/* ==================================================================== */}
        {/* 4. ALL PROPERTIES GRID / MAP DISPLAY */}
        {/* ==================================================================== */}
        <section className="space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-heading text-xl font-bold text-slate-900">
              Matching Properties ({properties.length})
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
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
                No Listed Properties Found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                No properties match your current filters {selectedCity ? `in "${selectedCity}"` : ""} {propertyType ? `for "${propertyType}"` : ""} {maxPrice ? `under ${formatBudgetDisplay(maxPrice)}` : ""}. Try adjusting the filters or click reset below.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bosa-gradient-bg text-white font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-95 transition-all"
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
