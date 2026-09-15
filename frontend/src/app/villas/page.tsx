"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import Card3D from "@/components/ui/Card3D";
import { Property } from "@/types";
import { fetchApi } from "@/lib/api";
import {
  SlidersHorizontal, MapPin, Filter, ArrowUpDown, ShieldCheck, Map as MapIcon, Grid,
  Sparkles, Waves, Sun, Anchor
} from "lucide-react";

function VillasContent() {
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState(false);

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || searchParams.get("location") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [page, setPage] = useState(1);

  const topStatesList = [
    { name: "All States", value: "" },
    { name: "Goa", value: "Goa" },
    { name: "Maharashtra", value: "Maharashtra" },
    { name: "Karnataka", value: "Karnataka" },
  ];

  const topCitiesList = [
    { name: "All Coastal & Hill Locations", value: "" },
    { name: "Assagao & Anjuna (North Goa)", value: "Goa" },
    { name: "Alibaug (Coastal Belt)", value: "Alibaug" },
    { name: "Lonavala & Khandala (Hills)", value: "Lonavala" },
  ];

  useEffect(() => {
    loadVillas();
  }, [query, selectedState, selectedCity, minPrice, maxPrice, bedrooms, verificationStatus, sortBy, page]);

  async function loadVillas() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("property_type", "Villa");
      if (query) params.append("query", query);
      if (selectedState) params.append("state", selectedState);
      if (selectedCity) params.append("location", selectedCity);
      if (minPrice) params.append("min_price", minPrice);
      if (maxPrice) params.append("max_price", maxPrice);
      if (bedrooms) params.append("bedrooms", bedrooms);
      if (verificationStatus) params.append("verification_status", verificationStatus);
      if (sortBy) params.append("sort_by", sortBy);
      params.append("page", page.toString());
      params.append("limit", "12");

      const data = await fetchApi<{ items: Property[]; total: number }>(`/properties?${params.toString()}`);
      setProperties(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to load villas", err);
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
    setBedrooms("");
    setVerificationStatus("");
    setSortBy("relevance");
    setPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      
      {/* 1. SLOGAN BANNER */}
      <section className="bg-white border-b border-slate-200 py-12 px-4 shadow-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-widest shadow-sm">
            <Waves className="w-4 h-4 text-[#D4AF37]" />
            <span>Coastal & Hill Villa Collection</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Luxury Coastal & Hill Villas — <span className="bosa-gradient-text">Private Sanctuary By The Waters</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Explore beachfront sanctuaries, Portuguese-inspired estates in Goa, and sea-view villas in Alibaug and Lonavala with private plunge pools and lush sun decks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>100% Verified Ownership</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Anchor className="w-4 h-4 text-[#D4AF37]" />
              <span>Coastal Jetty & Speedboat Access</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Sun className="w-4 h-4 text-emerald-700" />
              <span>Private Infinity Pools</span>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-8 w-full">
        
        {/* 2. FILTER CONTROLS */}
        <section className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
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
                      onClick={() => { setSelectedState(st.value); setPage(1); }}
                      className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                        isActive ? "bosa-gradient-bg text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      {st.name}
                    </button>
                  );
                })}
              </div>
            </div>

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
                      onClick={() => { setSelectedCity(ct.value); setPage(1); }}
                      className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        isActive ? "bosa-gradient-bg text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
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

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <MapPin className="w-4 h-4 text-emerald-800 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search villas by location, title or keyword..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
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
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* 3. LISTED VILLA PROPERTY CARDS */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#D4AF37]">
                Coastal & Hill Enclaves
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Available Luxury Villas ({total} Estates)
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-white animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 my-8 shadow-sm">
              <Waves className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">No Villas Found</h3>
              <button onClick={resetFilters} className="px-6 py-2.5 rounded-xl bosa-gradient-bg text-white font-bold text-xs uppercase tracking-wider shadow-md">
                Reset Filters
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

export default function VillasPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <Suspense fallback={<div className="py-20 text-center text-xs text-emerald-800 font-bold">Loading Villa Collection...</div>}>
        <VillasContent />
      </Suspense>
    </div>
  );
}
