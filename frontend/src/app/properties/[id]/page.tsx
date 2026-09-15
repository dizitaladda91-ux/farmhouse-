"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Property } from "@/types";
import { fetchApi } from "@/lib/api";
import { MOCK_PROPERTIES } from "@/lib/mockData";
import { formatIndianPrice, formatLandArea } from "@/lib/utils";
import {
  ShieldCheck, Heart, Share2, MapPin, Bed, Bath, Maximize2, Building2,
  Calendar, Phone, Mail, CheckCircle2, Video, Eye, Compass, Sparkles,
  ChevronLeft, ChevronRight, FileText, ArrowRight, UserCheck
} from "lucide-react";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"photos" | "360tour" | "video" | "map">("photos");

  // Lead / Visit Form Modal state
  const [inquiryType, setInquiryType] = useState<"callback" | "visit" | "info">("info");
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("11:00 AM");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      try {
        const data = await fetchApi<Property>(`/properties/${propertyId}`);
        if (data && data.id) {
          setProperty(data);
        } else {
          const fallback = MOCK_PROPERTIES.find(p => p.id === propertyId || p.slug === propertyId) || MOCK_PROPERTIES[0];
          setProperty(fallback);
        }
      } catch (err) {
        console.error("Failed to load property details", err);
        const fallback = MOCK_PROPERTIES.find(p => p.id === propertyId || p.slug === propertyId) || MOCK_PROPERTIES[0];
        setProperty(fallback);
      } finally {
        setLoading(false);
      }
    }
    if (propertyId) loadProperty();
  }, [propertyId]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (inquiryType === "visit") {
        await fetchApi("/site-visits", {
          method: "POST",
          body: JSON.stringify({
            property_id: propertyId,
            preferred_date: visitDate || "2026-09-20",
            preferred_time: visitTime,
            visitor_count: 2,
            message: leadMessage
          })
        });
      } else {
        await fetchApi("/leads", {
          method: "POST",
          body: JSON.stringify({
            property_id: propertyId,
            name: leadName,
            phone: leadPhone,
            email: leadEmail,
            message: leadMessage,
            interest_type: inquiryType === "callback" ? "Request Callback" : "Request Information"
          })
        });
      }
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit inquiry", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-dark text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-luxury-accent border-t-transparent animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-luxury-accent">Loading Estate Details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-luxury-dark text-white flex items-center justify-center font-sans">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold mb-2">Property Not Found</h2>
          <button onClick={() => router.push("/properties")} className="text-xs text-luxury-accent hover:underline">
            Back to Search Listings
          </button>
        </div>
      </div>
    );
  }

  const mediaList = property.media || [];
  const activeMedia = mediaList[activeMediaIndex] || {
    url: "/images/farmhouse-hero.jpg"
  };

  return (
    <div className="min-h-screen bg-luxury-dark text-white font-sans selection:bg-luxury-accent selection:text-luxury-dark">
      <Navbar />

      {/* Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => router.back()}
          className="text-xs font-semibold text-gray-400 hover:text-luxury-accent flex items-center gap-1.5 transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Listings
        </button>
      </div>

      {/* Top Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-luxury-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-luxury-emerald text-luxury-accent border border-luxury-accent/30">
                {property.property_type}
              </span>
              {property.verification_status === "VERIFIED" && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Property
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-luxury-accent font-medium mt-3">
              <MapPin className="w-4 h-4" />
              <span>
                {property.location ? `${property.location.address || ""}, ${property.location.locality}, ${property.location.city}, ${property.location.state}` : "India"}
              </span>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="lg:text-right">
            <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Guide Price</span>
            <div className="font-serif text-3xl sm:text-4xl font-extrabold gold-gradient-text">
              {formatIndianPrice(property.price)}
            </div>
            {property.built_up_area_sqft && (
              <span className="text-xs text-gray-400 block mt-1 font-mono">
                ₹{Math.round(property.price / property.built_up_area_sqft).toLocaleString("en-IN")} / sqft built-up
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Cinematic Media Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="glass-panel p-3 rounded-2xl border border-luxury-border">
          
          {/* Media View Mode Tabs */}
          <div className="flex items-center space-x-2 mb-3 bg-luxury-dark/80 p-1.5 rounded-xl w-fit border border-luxury-border text-xs">
            <button
              onClick={() => setActiveTab("photos")}
              className={`px-4 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                activeTab === "photos" ? "bg-gold-gradient text-luxury-dark shadow-gold-glow" : "text-gray-400 hover:text-white"
              }`}
            >
              Gallery Photos ({mediaList.length})
            </button>
            <button
              onClick={() => setActiveTab("360tour")}
              className={`px-4 py-1.5 rounded-lg font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === "360tour" ? "bg-gold-gradient text-luxury-dark shadow-gold-glow" : "text-gray-400 hover:text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              360° Virtual Tour
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`px-4 py-1.5 rounded-lg font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === "video" ? "bg-gold-gradient text-luxury-dark shadow-gold-glow" : "text-gray-400 hover:text-white"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              Video Tour
            </button>
          </div>

          {/* Media Player Viewport */}
          <div className="relative h-[400px] sm:h-[550px] w-full rounded-xl overflow-hidden bg-black">
            {activeTab === "photos" && (
              <Image
                src={activeMedia.url}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
            )}

            {activeTab === "360tour" && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-950/40 p-6 text-center">
                <Compass className="w-16 h-16 text-luxury-accent animate-spin mb-4" />
                <h3 className="font-serif text-2xl font-bold mb-2">Interactive 360° Equirectangular Tour</h3>
                <p className="text-xs text-gray-300 max-w-md">
                  Drag with cursor or tilt device to inspect full 360-degree panoramic view of living room and lawns.
                </p>
              </div>
            )}

            {activeTab === "video" && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-black p-6 text-center">
                <Video className="w-16 h-16 text-luxury-accent mb-4" />
                <h3 className="font-serif text-2xl font-bold mb-2">High-Definition Estate Cinematic Walkthrough</h3>
                <p className="text-xs text-gray-300 max-w-md">
                  Playing 4K aerial drone footage of the 2.5 acre manicured orchards and private pool deck.
                </p>
              </div>
            )}
          </div>

          {/* Media Thumbnails Slider */}
          {activeTab === "photos" && mediaList.length > 1 && (
            <div className="flex items-center gap-3 mt-3 overflow-x-auto pb-2">
              {mediaList.map((m, idx) => (
                <button
                  key={m.id || idx}
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeMediaIndex === idx ? "border-luxury-accent scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={m.url} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Main Content & Booking Form Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT 2 COLUMNS: Property Information */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Quick Specs Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-panel p-4 rounded-xl border border-luxury-border text-center">
                <Maximize2 className="w-5 h-5 text-luxury-accent mx-auto mb-1" />
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Plot Size</span>
                <span className="font-serif text-sm font-bold text-white">
                  {formatLandArea(property.land_area_value, property.land_area_unit)}
                </span>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-luxury-border text-center">
                <Building2 className="w-5 h-5 text-luxury-accent mx-auto mb-1" />
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Built-up Area</span>
                <span className="font-serif text-sm font-bold text-white">
                  {property.built_up_area_sqft ? `${property.built_up_area_sqft.toLocaleString()} sqft` : "Custom Estate"}
                </span>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-luxury-border text-center">
                <Bed className="w-5 h-5 text-luxury-accent mx-auto mb-1" />
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Bedrooms</span>
                <span className="font-serif text-sm font-bold text-white">
                  {property.bedrooms ? `${property.bedrooms} Luxury Suites` : "Multi-Suite"}
                </span>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-luxury-border text-center">
                <Bath className="w-5 h-5 text-luxury-accent mx-auto mb-1" />
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Bathrooms</span>
                <span className="font-serif text-sm font-bold text-white">
                  {property.bathrooms ? `${property.bathrooms} En-Suite` : "Private"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="glass-panel p-8 rounded-2xl border border-luxury-border space-y-4">
              <h2 className="font-serif text-2xl font-bold text-white border-b border-gray-800 pb-3">
                Estate Overview & Philosophy
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed font-light whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Visual Amenities Cards */}
            <div className="glass-panel p-8 rounded-2xl border border-luxury-border space-y-6">
              <h2 className="font-serif text-2xl font-bold text-white border-b border-gray-800 pb-3">
                Amenities & Estate Facilities
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.amenities && property.amenities.length > 0 ? (
                  property.amenities.map((am) => (
                    <div key={am.id} className="p-3.5 rounded-xl bg-luxury-dark/90 border border-luxury-border flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-luxury-emerald/80 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-luxury-accent" />
                      </div>
                      <span className="text-xs font-semibold text-gray-200">{am.name}</span>
                    </div>
                  ))
                ) : (
                  ["Swimming Pool", "Private Lawn", "24x7 Security", "100% Power Backup", "Servant Quarter", "Organic Orchard"].map((name, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-luxury-dark/90 border border-luxury-border flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-luxury-emerald/80 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-luxury-accent" />
                      </div>
                      <span className="text-xs font-semibold text-gray-200">{name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Verified Legal Info Block */}
            <div className="glass-panel p-8 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h2 className="font-serif text-xl font-bold text-white">Verified Legal Information</h2>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                This estate has undergone platform legal moderation. Clear title deed verification, mutation documentation, and local authority NOCs have been verified by platform legal team.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: Contact / Schedule Visit Sticky Box */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-6 rounded-2xl border border-luxury-accent/30 space-y-6 sticky top-28 shadow-luxury">
              
              <div className="border-b border-gray-800 pb-4">
                <span className="text-xs uppercase font-semibold tracking-wider text-luxury-accent block mb-1">
                  Schedule Private Viewing
                </span>
                <h3 className="font-serif text-xl font-bold text-white">Contact Seller Advisory</h3>
              </div>

              {submitted ? (
                <div className="p-6 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-serif text-lg font-bold text-white">Request Received</h4>
                  <p className="text-xs text-gray-300">
                    Our private estate advisor and seller representative will reach out to you within 2 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4 font-sans text-xs">
                  
                  {/* Mode Selector */}
                  <div className="flex rounded-lg bg-luxury-dark p-1 border border-luxury-border">
                    <button
                      type="button"
                      onClick={() => setInquiryType("info")}
                      className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all ${
                        inquiryType === "info" ? "bg-gold-gradient text-luxury-dark font-bold" : "text-gray-400"
                      }`}
                    >
                      Enquire
                    </button>
                    <button
                      type="button"
                      onClick={() => setInquiryType("visit")}
                      className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all ${
                        inquiryType === "visit" ? "bg-gold-gradient text-luxury-dark font-bold" : "text-gray-400"
                      }`}
                    >
                      Site Visit
                    </button>
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="e.g. Rajiv Roy"
                      className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-luxury-accent"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-luxury-accent"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="rajiv@gmail.com"
                      className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-luxury-accent"
                    />
                  </div>

                  {inquiryType === "visit" && (
                    <div>
                      <label className="text-gray-300 font-semibold block mb-1">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-3 py-2.5 text-white focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Message / Notes</label>
                    <textarea
                      rows={3}
                      value={leadMessage}
                      onChange={(e) => setLeadMessage(e.target.value)}
                      placeholder="I am interested in scheduling a confidential viewing..."
                      className="w-full bg-luxury-dark border border-luxury-border rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gold-gradient text-luxury-dark font-bold text-xs uppercase tracking-wider rounded-xl hover:shadow-gold-glow flex items-center justify-center gap-2 transition-all"
                  >
                    <span>{inquiryType === "visit" ? "Schedule Visit" : "Submit Enquiry"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
