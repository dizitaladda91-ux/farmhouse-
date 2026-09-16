"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, IndianRupee, Sparkles, ArrowRight, ShieldCheck, Bed } from "lucide-react";
import Card3D from "@/components/ui/Card3D";
import LuxuryDropdown, { DropdownOption } from "@/components/ui/LuxuryDropdown";

const propertyTypeOptions: DropdownOption[] = [
  { label: "All Property Types", value: "" },
  { label: "Farmhouses", value: "Farmhouse", badge: "Acreage" },
  { label: "Luxury Bungalows", value: "Luxury Bungalow", badge: "Prime" },
  { label: "Coastal & Hill Villas", value: "Villa", badge: "Retreat" },
  { label: "Gated Estates", value: "Estate", badge: "Mansion" },
  { label: "Weekend Homes", value: "Weekend Home" },
];

const budgetOptions: DropdownOption[] = [
  { label: "Max Budget (Any)", value: "" },
  { label: "Up to ₹3 Crore", value: "30000000" },
  { label: "Up to ₹5 Crore", value: "50000000" },
  { label: "Up to ₹10 Crore", value: "100000000", badge: "Popular" },
  { label: "Up to ₹25 Crore", value: "250000000" },
  { label: "Up to ₹50 Crore+", value: "500000000", badge: "Ultra" },
];

const bedroomOptions: DropdownOption[] = [
  { label: "Bedrooms (Any)", value: "" },
  { label: "3+ BHK Suites", value: "3" },
  { label: "4+ BHK Luxury", value: "4" },
  { label: "5+ BHK Grand", value: "5" },
  { label: "6+ BHK Mansions", value: "6", badge: "Grand" },
];

const popularLocations = [
  { name: "Chhatarpur & DLF Farms", region: "Delhi NCR", query: "Delhi" },
  { name: "Golf Course Extension", region: "Gurgaon", query: "Gurgaon" },
  { name: "Mandwa Coastal Belt", region: "Alibaug", query: "Alibaug" },
  { name: "Assagao & Vagator", region: "North Goa", query: "Assagao" },
  { name: "Tungarli Hills", region: "Lonavala", query: "Lonavala" },
];

export default function HeroBosa() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [naturalQuery, setNaturalQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"structured" | "smart">("structured");
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocationMenu(false);
      }
    }
    if (showLocationMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLocationMenu]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === "smart" && naturalQuery.trim()) {
      router.push(`/properties?smart_query=${encodeURIComponent(naturalQuery.trim())}`);
      return;
    }

    const params = new URLSearchParams();
    if (location.trim()) params.append("location", location.trim());
    if (propertyType) params.append("property_type", propertyType);
    if (maxPrice) params.append("max_price", maxPrice);
    if (bedrooms) params.append("bedrooms", bedrooms);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="relative w-full min-h-[640px] lg:min-h-[720px] flex flex-col justify-between bg-[#0F172A] border-b border-slate-200 pt-12 pb-24">
      
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0 opacity-70 overflow-hidden">
        <Image
          src="/images/farmhouse-hero.jpg"
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

      {/* 3D Animated Floating Property Search Dock */}
      <div className="relative z-40 max-w-6xl mx-auto px-4 w-full mt-10">
        <div className="relative rounded-3xl p-1.5 bg-gradient-to-b from-white/95 via-white/80 to-[#D4AF37]/35 shadow-[0_30px_70px_-15px_rgba(15,23,42,0.35),0_10px_25px_-5px_rgba(212,175,55,0.2)] hover:shadow-[0_35px_80px_-10px_rgba(26,54,93,0.45)] hover:-translate-y-1 transition-all duration-300 border border-white/80">
          <div className="bg-white p-5 sm:p-7 rounded-[22px] border border-slate-100 shadow-inner">
            
            {/* Top Meta Info Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-heading font-bold text-slate-800 uppercase tracking-wider">
                  Instant Multi-Filter Search
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50/90 px-3 py-1 rounded-full border border-emerald-200/70 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Listings Only</span>
              </div>
            </div>

            {/* Search Form Inputs */}
            {searchMode === "structured" ? (
              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                
                {/* 1. Location Input with Custom Suggestions Dropdown */}
                <div
                  ref={locationRef}
                  className={`group relative bg-slate-50/90 hover:bg-white border rounded-2xl p-2.5 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer ${
                    showLocationMenu
                      ? "border-[#1A365D] bg-white ring-2 ring-[#1A365D]/10 -translate-y-1 shadow-md"
                      : "border-slate-200/90 hover:border-[#D4AF37] hover:-translate-y-1"
                  }`}
                >
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1 mb-0.5">
                    Location
                  </label>
                  <div className="flex items-center px-1">
                    <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0 mr-2 group-hover:scale-110 transition-transform" />
                    <input
                      type="text"
                      value={location}
                      onFocus={() => setShowLocationMenu(true)}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City / Locality..."
                      className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  {/* Popular Location Menu */}
                  {showLocationMenu && (
                    <div className="absolute top-full left-0 mt-2 z-[9999] bg-white border border-slate-200/90 rounded-2xl shadow-[0_25px_60px_-10px_rgba(26,54,93,0.3),0_10px_20px_-5px_rgba(0,0,0,0.1)] p-2 min-w-full w-max max-w-sm animate-in fade-in zoom-in-95 duration-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 block">
                        Popular Enclaves
                      </span>
                      <div className="space-y-1">
                        {popularLocations.map((loc) => (
                          <div
                            key={loc.name}
                            onClick={() => {
                              setLocation(loc.query);
                              setShowLocationMenu(false);
                            }}
                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs hover:bg-slate-100 hover:text-[#1A365D] hover:pl-4.5 cursor-pointer transition-all duration-150 font-semibold text-slate-900"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span>{loc.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-normal ml-3">{loc.region}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Custom Property Type Dropdown */}
                <LuxuryDropdown
                  label="Property Type"
                  icon={<Home className="w-4 h-4 text-[#1A365D]" />}
                  value={propertyType}
                  placeholder="All Property Types"
                  options={propertyTypeOptions}
                  onChange={setPropertyType}
                />

                {/* 3. Custom Max Budget Dropdown */}
                <LuxuryDropdown
                  label="Budget Range"
                  icon={<IndianRupee className="w-4 h-4 text-[#D4AF37]" />}
                  value={maxPrice}
                  placeholder="Max Budget (Any)"
                  options={budgetOptions}
                  onChange={setMaxPrice}
                />

                {/* 4. Custom Bedrooms Dropdown */}
                <LuxuryDropdown
                  label="Bedrooms"
                  icon={<Bed className="w-4 h-4 text-slate-700" />}
                  value={bedrooms}
                  placeholder="Bedrooms (Any)"
                  options={bedroomOptions}
                  onChange={setBedrooms}
                />

                {/* 5. 3D Animated Raised Search Button */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="relative group overflow-hidden w-full h-[58px] bosa-gradient-bg text-white font-heading font-bold text-xs uppercase tracking-wider rounded-2xl shadow-[0_10px_25px_rgba(26,54,93,0.35)] hover:shadow-[0_15px_35px_rgba(212,175,55,0.45)] hover:-translate-y-1 active:translate-y-0.5 active:shadow-inner transition-all duration-300 flex items-center justify-center gap-2.5"
                  >
                    {/* 3D Shimmer Beam */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                    <Search className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                    <span className="tracking-wider">Search Properties</span>
                  </button>
                </div>

              </form>
            ) : (
              /* AI Natural Query Bar */
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full group">
                  <Sparkles className="w-5 h-5 text-emerald-700 absolute left-4 top-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform" />
                  <input
                    type="text"
                    value={naturalQuery}
                    onChange={(e) => setNaturalQuery(e.target.value)}
                    placeholder="e.g. 'Farmhouse in Chhatarpur near Delhi under 30 crore with swimming pool'"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-2xl pl-12 pr-4 py-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white shadow-sm hover:shadow-md transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bosa-gradient-bg text-white font-heading font-bold text-xs uppercase tracking-wider rounded-2xl hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-md"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>
      </div>

    </div>
  );
}
