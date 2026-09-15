"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, MapPin, Home, IndianRupee, SlidersHorizontal, ArrowRight, Compass } from "lucide-react";

export default function SmartSearchBar() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"smart" | "structured">("smart");
  const [naturalQuery, setNaturalQuery] = useState("");
  
  // Structured state
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleNaturalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalQuery.trim()) return;
    router.push(`/properties?smart_query=${encodeURIComponent(naturalQuery.trim())}`);
  };

  const handleStructuredSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (propertyType) params.append("property_type", propertyType);
    if (maxPrice) params.append("max_price", maxPrice);
    router.push(`/properties?${params.toString()}`);
  };

  const quickPills = [
    "Farmhouse in Chhatarpur under 25 Crore",
    "Alibaug Beachfront Villa",
    "Golf Course Road Estate Gurgaon",
    "Assagao Portuguese Heritage Bungalow",
  ];

  return (
    <div className="w-full max-w-5xl mx-auto -mt-16 relative z-30 px-4 font-sans">
      <div className="glass-panel-dark p-6 sm:p-8 rounded-2xl shadow-2xl border border-luxury-accent/40">
        
        {/* Search Mode Switcher Tabs */}
        <div className="flex items-center justify-between mb-5 border-b border-luxury-accent/20 pb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab("smart")}
              className={`px-5 py-2 rounded-lg font-serif text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all ${
                activeTab === "smart"
                  ? "bg-gold-gradient text-luxury-dark shadow-gold-glow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Concierge AI Natural Search</span>
            </button>
            <button
              onClick={() => setActiveTab("structured")}
              className={`px-5 py-2 rounded-lg font-serif text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all ${
                activeTab === "structured"
                  ? "bg-gold-gradient text-luxury-dark shadow-gold-glow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Structured Filter</span>
            </button>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-luxury-accent font-serif italic">
            {activeTab === "smart" ? "Type queries in natural English" : "Filter by exact location & budget"}
          </span>
        </div>

        {/* Tab 1: AI Natural Language Search */}
        {activeTab === "smart" ? (
          <div className="space-y-4">
            <form onSubmit={handleNaturalSearch} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <Search className="w-5 h-5 text-luxury-accent absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  placeholder="e.g. 'Farmhouse in Chhatarpur near Delhi under 30 crore with swimming pool'"
                  className="w-full bg-[#070D0B] border border-luxury-accent/30 focus:border-luxury-accent rounded-xl pl-12 pr-4 py-4 text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-9 py-4 bg-gold-gradient text-luxury-dark font-serif font-bold text-xs uppercase tracking-widest rounded-xl hover:shadow-gold-glow flex items-center justify-center gap-2 whitespace-nowrap transition-all"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Sample Search Tags */}
            <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
              <span className="text-gray-400 font-serif italic text-xs">Frequent Inquiries:</span>
              {quickPills.map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setNaturalQuery(pill);
                    router.push(`/properties?smart_query=${encodeURIComponent(pill)}`);
                  }}
                  className="px-3 py-1 rounded-full bg-[#0F221D] border border-luxury-accent/20 text-gray-300 hover:text-luxury-accent hover:border-luxury-accent transition-all text-[11px]"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Tab 2: Structured Filter Bar */
          <form onSubmit={handleStructuredSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            
            {/* Location Select */}
            <div className="relative">
              <MapPin className="w-4 h-4 text-luxury-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City / Locality (e.g. Chhatarpur)"
                className="w-full bg-[#070D0B] border border-luxury-accent/30 focus:border-luxury-accent rounded-xl pl-10 pr-3 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Property Type Dropdown */}
            <div className="relative">
              <Home className="w-4 h-4 text-luxury-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-[#070D0B] border border-luxury-accent/30 focus:border-luxury-accent rounded-xl pl-10 pr-3 py-3.5 text-xs text-white focus:outline-none appearance-none"
              >
                <option value="">All Estate Categories</option>
                <option value="Farmhouse">Farmhouse</option>
                <option value="Luxury Bungalow">Heritage Bungalow</option>
                <option value="Villa">Villa & Coastal Sanctuary</option>
                <option value="Estate">Gated Estate</option>
                <option value="Weekend Home">Weekend Retreat</option>
                <option value="Large Residential Property">Large Residential</option>
              </select>
            </div>

            {/* Budget Max Price */}
            <div className="relative">
              <IndianRupee className="w-4 h-4 text-luxury-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-[#070D0B] border border-luxury-accent/30 focus:border-luxury-accent rounded-xl pl-10 pr-3 py-3.5 text-xs text-white focus:outline-none appearance-none"
              >
                <option value="">Max Guide Price</option>
                <option value="30000000">Up to ₹3 Crore</option>
                <option value="50000000">Up to ₹5 Crore</option>
                <option value="100000000">Up to ₹10 Crore</option>
                <option value="250000000">Up to ₹25 Crore</option>
                <option value="500000000">Up to ₹50 Crore+</option>
              </select>
            </div>

            {/* Search Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gold-gradient text-luxury-dark font-serif font-bold text-xs uppercase tracking-widest rounded-xl hover:shadow-gold-glow flex items-center justify-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
