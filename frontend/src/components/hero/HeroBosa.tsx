"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, IndianRupee, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function HeroBosa() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [naturalQuery, setNaturalQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"structured" | "smart">("structured");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === "smart" && naturalQuery.trim()) {
      router.push(`/properties?smart_query=${encodeURIComponent(naturalQuery.trim())}`);
      return;
    }

    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (activeTab !== "All") {
      params.append("property_type", activeTab);
    } else if (propertyType) {
      params.append("property_type", propertyType);
    }
    if (maxPrice) params.append("max_price", maxPrice);
    if (bedrooms) params.append("bedrooms", bedrooms);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="relative w-full min-h-[640px] lg:min-h-[720px] flex flex-col justify-between overflow-hidden bg-[#0F172A] border-b border-slate-200 pt-12 pb-16">
      
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0 opacity-70">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=90"
          alt="Bosa Real Estate Group"
          fill
          priority
          className="object-cover filter brightness-105 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D3B32]/90 via-[#0F172A]/60 to-[#0F172A]/40" />
      </div>

      {/* Hero Central Headline */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-6 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>India’s Leading Real Estate Group</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
          Find Your Dream <span className="gold-gradient-text">Estate & Sanctuary</span>
        </h1>

        <p className="font-sans text-base sm:text-xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed mt-4">
          Discover verified farmhouses, luxury bungalows, coastal villas, and high-value residential properties across India’s prime enclaves.
        </p>

        {/* Quick Mode Toggle */}
        <div className="flex items-center justify-center gap-3 mt-6 text-xs font-semibold">
          <button
            onClick={() => setSearchMode("structured")}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              searchMode === "structured"
                ? "bosa-gradient-bg text-white font-bold shadow-md"
                : "bg-slate-900/80 text-slate-300 border border-slate-700 hover:text-white"
            }`}
          >
            Structured Filter
          </button>
          <button
            onClick={() => setSearchMode("smart")}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              searchMode === "smart"
                ? "bosa-gradient-bg text-white font-bold shadow-md"
                : "bg-slate-900/80 text-slate-300 border border-slate-700 hover:text-white"
            }`}
          >
            ✨ AI Natural Query
          </button>
        </div>
      </div>

      {/* Bosa Signature Floating Property Search Dock */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 w-full mt-10">
        <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-200">
          
          {/* Category Tabs Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {["All", "Farmhouse", "Villa", "Luxury Bungalow"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeTab === cat
                      ? "bosa-gradient-bg text-white shadow-md"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {cat === "All" ? "All Properties" : cat}
                </button>
              ))}
            </div>

            <span className="hidden md:inline-block text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Listings Only</span>
            </span>
          </div>

          {/* Search Form Inputs */}
          {searchMode === "structured" ? (
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              
              {/* Location Input */}
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City / Locality (Chhatarpur...)"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl pl-10 pr-3 py-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white"
                />
              </div>

              {/* Property Type Select */}
              <div className="relative">
                <Home className="w-4 h-4 text-emerald-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl pl-10 pr-3 py-3.5 text-xs text-slate-900 focus:outline-none appearance-none focus:bg-white"
                >
                  <option value="">Property Type</option>
                  <option value="Farmhouse">Farmhouse</option>
                  <option value="Luxury Bungalow">Bungalow</option>
                  <option value="Villa">Villa</option>
                  <option value="Estate">Estate</option>
                  <option value="Weekend Home">Weekend Home</option>
                </select>
              </div>

              {/* Max Price */}
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-emerald-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl pl-10 pr-3 py-3.5 text-xs text-slate-900 focus:outline-none appearance-none focus:bg-white"
                >
                  <option value="">Max Budget</option>
                  <option value="30000000">Up to ₹3 Crore</option>
                  <option value="50000000">Up to ₹5 Crore</option>
                  <option value="100000000">Up to ₹10 Crore</option>
                  <option value="250000000">Up to ₹25 Crore</option>
                  <option value="500000000">Up to ₹50 Crore+</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div className="relative">
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-3.5 text-xs text-slate-900 focus:outline-none appearance-none focus:bg-white"
                >
                  <option value="">Bedrooms (Any)</option>
                  <option value="3">3+ BHK</option>
                  <option value="4">4+ BHK</option>
                  <option value="5">5+ BHK</option>
                  <option value="6">6+ BHK Suites</option>
                </select>
              </div>

              {/* Search Submit */}
              <button
                type="submit"
                className="w-full py-3.5 bosa-gradient-bg text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl hover:shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Search Properties</span>
              </button>
            </form>
          ) : (
            /* AI Natural Query Bar */
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <Sparkles className="w-5 h-5 text-emerald-700 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  placeholder="e.g. 'Farmhouse in Chhatarpur near Delhi under 30 crore with swimming pool'"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl pl-12 pr-4 py-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 bosa-gradient-bg text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl hover:shadow-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}
