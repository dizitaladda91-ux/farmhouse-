"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import HeroBosa from "@/components/hero/HeroBosa";
import PropertyCard from "@/components/property/PropertyCard";
import Card3D from "@/components/ui/Card3D";
import { Property } from "@/types";
import { fetchApi } from "@/lib/api";
import {
  ShieldCheck, MapPin, Sparkles, Building2, CheckCircle2,
  ArrowRight, TreePine, Key, PhoneCall, Award, Users, TrendingUp
} from "lucide-react";

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<string>("ALL");

  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await fetchApi<{ items: Property[] }>("/properties?limit=6");
        setProperties(res.items || []);
      } catch (err) {
        console.error("Failed to load featured properties", err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  const filteredProperties = properties.filter((p) => {
    if (selectedTab === "ALL") return true;
    if (selectedTab === "FARMHOUSE") return p.property_type === "Farmhouse";
    if (selectedTab === "BUNGALOW") return p.property_type === "Luxury Bungalow";
    if (selectedTab === "VILLA") return p.property_type === "Villa";
    return true;
  });

  const categories = [
    {
      title: "Farmhouses",
      count: "18+ Listings",
      desc: "2 to 10+ Acre gated green land plots with private lawns & orchards.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      type: "Farmhouse"
    },
    {
      title: "Luxury Bungalows",
      count: "12+ Listings",
      desc: "Modern architectural luxury residences in prime Delhi NCR & Gurgaon belts.",
      image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80",
      type: "Luxury Bungalow"
    },
    {
      title: "Coastal Villas",
      count: "15+ Listings",
      desc: "Private beach retreats & coconut grove villas in Alibaug & North Goa.",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      type: "Villa"
    },
    {
      title: "Gated Estates",
      count: "10+ Listings",
      desc: "High-value architectural mansions with smart automation & hill views.",
      image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
      type: "Estate"
    },
  ];

  const destinations = [
    { name: "Chhatarpur & DLF Farms", location: "Delhi NCR", count: "14 Properties", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80", query: "Delhi" },
    { name: "Golf Course Extension", location: "Gurgaon", count: "10 Properties", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80", query: "Gurgaon" },
    { name: "Mandwa Coastal Belt", location: "Alibaug", count: "8 Properties", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80", query: "Alibaug" },
    { name: "Assagao & Vagator", location: "North Goa", count: "12 Properties", image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=600&q=80", query: "Assagao" },
    { name: "Tungarli Hills", location: "Lonavala", count: "6 Properties", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80", query: "Lonavala" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <Navbar />

      {/* Bosa Hero with Floating Multi-Tab Search Bar */}
      <HeroBosa />

      {/* SECTION 1: Bosa Counter Stats Impact Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-30 mb-20">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="font-heading text-3xl sm:text-4xl font-extrabold bosa-gradient-text block">500+</span>
            <span className="text-xs text-slate-600 uppercase tracking-wider font-bold mt-1 block">Properties Listed</span>
          </div>
          <div>
            <span className="font-heading text-3xl sm:text-4xl font-extrabold bosa-gradient-text block">₹1,500+ Cr</span>
            <span className="text-xs text-slate-600 uppercase tracking-wider font-bold mt-1 block">Portfolio Value</span>
          </div>
          <div>
            <span className="font-heading text-3xl sm:text-4xl font-extrabold bosa-gradient-text block">100%</span>
            <span className="text-xs text-slate-600 uppercase tracking-wider font-bold mt-1 block">Verified Title Deeds</span>
          </div>
          <div>
            <span className="font-heading text-3xl sm:text-4xl font-extrabold bosa-gradient-text block">99.4%</span>
            <span className="text-xs text-slate-600 uppercase tracking-wider font-bold mt-1 block">Client Satisfaction</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: Explore Property Types (Category Cards Grid with 3D Tilt) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#D4AF37]">
            Curated Categories
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
            Explore <span className="bosa-gradient-text">Property Types</span>
          </h2>
          <p className="text-xs text-slate-600 mt-2">
            Select from our specialized portfolios tailored for agricultural sanctuaries, bungalows, and beachfront retreats.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Card3D key={idx} intensity={10} depth={20} className="h-80">
              <Link
                href={`/properties?property_type=${encodeURIComponent(cat.type)}`}
                className="bosa-card rounded-2xl overflow-hidden p-5 flex flex-col justify-between group h-full relative shadow-md block"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-white/90 text-slate-900 border border-slate-200 font-bold">
                    {cat.count}
                  </span>
                </div>

                <div className="relative z-10 space-y-1">
                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {cat.desc}
                  </p>
                  <div className="pt-2 flex items-center gap-1 text-xs font-bold text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                    <span>Browse Listings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </Card3D>
          ))}
        </div>
      </section>

      {/* SECTION 3: Featured Properties Portfolio (With Tabs) */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-200 pb-6">
            <div>
              <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
                Handpicked Portfolios
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
                Featured <span className="bosa-gradient-text">Properties for Sale</span>
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="mt-6 md:mt-0 flex items-center space-x-2 overflow-x-auto pb-1">
              {[
                { label: "All Properties", key: "ALL" },
                { label: "Farmhouses", key: "FARMHOUSE" },
                { label: "Bungalows", key: "BUNGALOW" },
                { label: "Villas", key: "VILLA" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    selectedTab === tab.key
                      ? "bosa-gradient-bg text-white shadow-md"
                      : "bg-white text-slate-700 hover:text-slate-900 border border-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-white animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bosa-gradient-bg text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:opacity-95 transition-all"
            >
              <span>Explore All {properties.length} Properties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 4: About Us / Why Choose Us Section (Bosa Signature Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Image Composition */}
          <div className="relative">
            <Card3D intensity={6} depth={15}>
              <div className="relative h-[480px] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="About Haveli & Estates"
                  fill
                  className="object-cover"
                />
              </div>
            </Card3D>
            {/* Floating Experience Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xl text-center z-20">
              <span className="font-heading text-4xl font-extrabold bosa-gradient-text block">10+ Years</span>
              <span className="text-xs text-slate-700 font-bold uppercase tracking-wider mt-1 block">
                Estate Excellence
              </span>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>Who We Are</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
              India’s Most Trusted <span className="bosa-gradient-text">Real Estate Group</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Haveli & Estates is a premier digital marketplace and private advisory built specifically for buying, selling, and managing high-value farmhouses, luxury bungalows, hilltop retreats, and coastal estates across India.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "100% Legal Title Deed Audit & Admin Moderation Queue",
                "Normalized Metric Engine (Sq.Ft, Sq.Yd, Acre, Regional Bigha)",
                "Confidential Buyer-to-Seller Site Visit Scheduling",
                "360° Panoramic Virtual Tour & Aerial Walkthroughs",
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bosa-gradient-bg flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-sm">
                    ✓
                  </div>
                  <span className="text-xs sm:text-sm text-slate-800 font-semibold">{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/sell"
                className="px-6 py-3 rounded-xl bosa-gradient-bg text-white font-heading font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
              >
                List Property With Us
              </Link>
              <a
                href="tel:+919876543210"
                className="px-6 py-3 rounded-xl bg-slate-900 text-white font-heading font-semibold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all"
              >
                Call Advisory
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: Prime Indian Destinations (3D Tilt Grid) */}
      <section className="bg-slate-100/70 border-t border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#D4AF37]">
              Prime Destinations
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
              Explore by <span className="bosa-gradient-text">Estate Enclave</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {destinations.map((loc, idx) => (
              <Card3D key={idx} intensity={10} depth={20} className="h-80">
                <Link
                  href={`/properties?location=${encodeURIComponent(loc.query)}`}
                  className="bosa-card rounded-2xl overflow-hidden h-full relative flex flex-col justify-end p-5 group shadow-md block"
                >
                  <Image
                    src={loc.image}
                    alt={loc.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="relative z-10">
                    <span className="text-[10px] text-[#D4AF37] font-mono uppercase tracking-wider block">
                      {loc.location} • {loc.count}
                    </span>
                    <h3 className="font-heading text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors mt-0.5">
                      {loc.name}
                    </h3>
                  </div>
                </Link>
              </Card3D>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 6: Call To Action Banner */}
      <section className="bg-white border-t border-b border-slate-200 py-20 text-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#D4AF37]">
            Looking to Buy or Sell?
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 mt-3 max-w-3xl mx-auto leading-tight">
            Connect With India’s Top Estate Advisory Team
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto mt-3 font-normal leading-relaxed">
            Schedule a confidential site visit or list your farmhouse with verified HNW buyer reach.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/sell"
              className="px-8 py-3.5 rounded-xl bosa-gradient-bg text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
            >
              <span>Submit Property Listing</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </Link>
            <a
              href="tel:+919876543210"
              className="px-8 py-3.5 rounded-xl bg-[#1A365D] text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#142A4A] inline-flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
              <span>Call Private Concierge</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

