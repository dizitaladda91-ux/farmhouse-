"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import Card3D from "@/components/ui/Card3D";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  Building2, MapPin, SlidersHorizontal, CheckCircle2, ChevronRight,
  ChevronLeft, Sparkles, Image as ImageIcon, ShieldCheck, Check,
  UserCheck, Lock, ArrowRight, TreePine, Waves, Home, FileText,
  Phone, Mail, Lock as LockIcon, AlertCircle, Eye, EyeOff
} from "lucide-react";

export default function SellPropertyWizard() {
  const router = useRouter();
  const { user, isAuthenticated, login } = useAuth();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // STEP 1: Seller Details
  const [sellerType, setSellerType] = useState<"Owner" | "Dealer" | "Builder">("Owner");
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [mobileNumber, setMobileNumber] = useState(user?.phone || "");
  const [whatsappNumber, setWhatsappNumber] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [alternateContact, setAlternateContact] = useState("");
  const [preferredContact, setPreferredContact] = useState("WhatsApp");
  const [agencyName, setAgencyName] = useState("");
  const [reraLicense, setReraLicense] = useState("");

  // STEP 2: Property Basic Details
  const [propertyType, setPropertyType] = useState<"Farmhouse" | "Luxury Bungalow" | "Villa" | "Farm Land + House">("Farmhouse");
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [priceNegotiable, setPriceNegotiable] = useState("Yes");
  const [propertyStatus, setPropertyStatus] = useState("Ready to Move");

  // STEP 3: Location Details
  const [state, setState] = useState("Delhi NCR");
  const [city, setCity] = useState("Delhi");
  const [district, setDistrict] = useState("South Delhi");
  const [locality, setLocality] = useState("Chhatarpur");
  const [fullAddress, setFullAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("110074");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [highwayName, setHighwayName] = useState("Gurgaon-Faridabad Expressway");
  const [distAirport, setDistAirport] = useState("18 km");
  const [distMetro, setDistMetro] = useState("3.5 km");
  const [distHighway, setDistHighway] = useState("1.2 km");
  const [hideExactAddress, setHideExactAddress] = useState(true);

  // STEP 4: Land & Building Details (Farmhouse / Bungalow)
  const [totalLandArea, setTotalLandArea] = useState("2.5");
  const [landAreaUnit, setLandAreaUnit] = useState("acre");
  const [frontage, setFrontage] = useState("180 Ft");
  const [plotLength, setPlotLength] = useState("300 Ft");
  const [plotWidth, setPlotWidth] = useState("363 Ft");
  const [landType, setLandType] = useState("Converted / Freehold");
  const [isConvertedLand, setIsConvertedLand] = useState("Yes");
  const [hasBoundaryWall, setHasBoundaryWall] = useState("Yes");
  const [isCornerProperty, setIsCornerProperty] = useState("Yes");
  const [roadWidth, setRoadWidth] = useState("40 Ft Wide Road");
  const [numberOfRoads, setNumberOfRoads] = useState("2 Roads (Corner)");
  const [ownershipType, setOwnershipType] = useState("Freehold Single Owner");

  // Building Details
  const [builtUpAreaSqft, setBuiltUpAreaSqft] = useState("12500");
  const [carpetAreaSqft, setCarpetAreaSqft] = useState("10500");
  const [numberOfFloors, setNumberOfFloors] = useState("2 Floors (G+1)");
  const [bedrooms, setBedrooms] = useState("5");
  const [bathrooms, setBathrooms] = useState("6");
  const [balconies, setBalconies] = useState("4");
  const [servantRooms, setServantRooms] = useState("2 Suites");
  const [parkingCapacity, setParkingCapacity] = useState("8 Covered Cars");
  const [furnishedStatus, setFurnishedStatus] = useState("Fully Furnished");
  const [propertyAge, setPropertyAge] = useState("1-3 Years");

  // STEP 5: Farmhouse-Specific Features Checkboxes
  const [amenities, setAmenities] = useState<Record<string, boolean>>({
    "Swimming Pool": true,
    "Garden": true,
    "Agricultural Land": true,
    "Orchard": true,
    "Guest House": true,
    "Staff Quarters": true,
    "Covered Parking": true,
    "Cricket Ground": false,
    "Sports Area": true,
    "BBQ Area": true,
    "Party Lawn": true,
    "Gazebo": true,
    "Borewell": true,
    "Water Tank": true,
    "Solar System": true,
    "Generator": true,
    "Water Body": true,
    "Horse Stable": false,
    "Cow Shed": false,
    "Security Room": true,
    "Internal Roads": true,
  });

  // Utilities
  const [electricityConnection, setElectricityConnection] = useState("3-Phase High Load");
  const [waterSource, setWaterSource] = useState("Private Borewell + Municipal");
  const [solarPower, setSolarPower] = useState("10 KW Solar Panel");
  const [smartHomeFeatures, setSmartHomeFeatures] = useState("CCTV + Automated Gates + Solar");

  // STEP 6: Legal & Documentation (MANDATORY AUDIT SECTION)
  const [titleDeedAvailable, setTitleDeedAvailable] = useState("Yes");
  const [registryAvailable, setRegistryAvailable] = useState("Yes");
  const [propertyTaxPaid, setPropertyTaxPaid] = useState("Yes");
  const [mutationAvailable, setMutationAvailable] = useState("Yes");
  const [encumbranceCertificate, setEncumbranceCertificate] = useState("Clean Certificate");
  const [approvedBuildingPlan, setApprovedBuildingPlan] = useState("Yes");
  const [hasLitigation, setHasLitigation] = useState("No");
  const [hasMortgage, setHasMortgage] = useState("No");
  const [docRegistryUrl, setDocRegistryUrl] = useState("https://haveliestates.in/docs/registry_sample.pdf");
  const [docSitePlanUrl, setDocSitePlanUrl] = useState("https://haveliestates.in/docs/siteplan_sample.pdf");

  // STEP 7: Photos & Videos
  const [coverImageUrl, setCoverImageUrl] = useState("/images/farmhouse-hero.jpg");
  const [bedroomImageUrl, setBedroomImageUrl] = useState("/images/bedroom.jpg");
  const [gardenImageUrl, setGardenImageUrl] = useState("/images/villa.jpg");
  const [droneVideoUrl, setDroneVideoUrl] = useState("https://youtube.com/watch?v=demo_estate_tour");
  const [tour360Url, setTour360Url] = useState("https://my.matterport.com/show/?m=demo_360_farmhouse");

  // STEP 8: Selling Information & Settings
  const [minimumExpectedPrice, setMinimumExpectedPrice] = useState("");
  const [urgentSale, setUrgentSale] = useState("No");
  const [reasonForSelling, setReasonForSelling] = useState("Portfolio Rebalance");
  const [possessionStatus, setPossessionStatus] = useState("Immediate Possession");
  const [siteVisitTiming, setSiteVisitTiming] = useState("10:00 AM - 6:00 PM (Prior Appointment)");
  const [visibleContactDetails, setVisibleContactDetails] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(true);

  // Seller Quick Login Handler
  const handleQuickSellerLogin = () => {
    login("demo-seller-jwt-token", {
      id: "demo-seller-id",
      email: "seller@farmhouse.com",
      full_name: "Vikramaditya Singhania",
      role: "SELLER",
      phone: "+91 98765 43210",
      is_verified: true,
      created_at: new Date().toISOString()
    });
  };

  const toggleAmenity = (name: string) => {
    setAmenities((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async () => {
    if (!termsAgreed) {
      alert("Please agree to the Terms & Conditions before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const selectedAmenityNames = Object.keys(amenities).filter((k) => amenities[k]);

      const payload = {
        title: title || `Verified ${propertyType} in ${locality}, ${city}`,
        description: shortDescription || `Curated ${propertyType} featuring private lawns, swimming pool, borewell, and legal deed verification.`,
        property_type: propertyType,
        price: parseFloat(expectedPrice) || 250000000.0,
        land_area_value: parseFloat(totalLandArea) || 2.5,
        land_area_unit: landAreaUnit,
        built_up_area_sqft: parseFloat(builtUpAreaSqft) || 12500.0,
        bedrooms: parseInt(bedrooms) || 5,
        bathrooms: parseInt(bathrooms) || 6,
        furnishing: furnishedStatus,
        location: {
          state,
          city,
          locality,
          address: hideExactAddress ? `${locality}, ${city}` : fullAddress,
          pincode,
          landmark,
          nearby_places: [
            { category: "Airport", name: "IGI Airport", distance: distAirport },
            { category: "Metro", name: "Chhatarpur Metro", distance: distMetro },
            { category: "Highway", name: highwayName, distance: distHighway }
          ]
        },
        media: [
          { url: coverImageUrl, is_primary: true, display_order: 0 },
          { url: bedroomImageUrl, is_primary: false, display_order: 1 },
          { url: gardenImageUrl, is_primary: false, display_order: 2 }
        ]
      };

      await fetchApi("/properties", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setStep(10); // Success Step
    } catch (err) {
      console.error("Failed to submit property", err);
      alert("Failed to submit property. Ensure you are logged in as a Seller.");
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: "Seller Details" },
    { num: 2, label: "Property Details" },
    { num: 3, label: "Location" },
    { num: 4, label: "Land & Building" },
    { num: 5, label: "Amenities & Utilities" },
    { num: 6, label: "Legal & Documents" },
    { num: 7, label: "Photos & Videos" },
    { num: 8, label: "Pricing & Settings" },
    { num: 9, label: "Preview Listing" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 py-10 px-4 text-center shadow-sm">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>13-Point Title Audited Listing Wizard</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            List Your <span className="bosa-gradient-text">Farmhouse & Estate</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
            Multi-step verification wizard for Farmhouses, Coastal Villas, and Luxury Bungalows.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        
        {/* UNAUTHENTICATED GATEWAY CARD */}
        {!isAuthenticated ? (
          <Card3D intensity={6} depth={15}>
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#0F172A] p-0.5 mx-auto flex items-center justify-center shadow-lg">
                <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center">
                  <Lock className="w-8 h-8 text-[#D4AF37]" />
                </div>
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                  Seller Account Gateway Required
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  To preserve 100% legal title compliance and verified HNWI buyer trust, sellers must authenticate before listing properties.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <button
                  onClick={handleQuickSellerLogin}
                  className="w-full py-3.5 bosa-gradient-bg text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Continue as Verified Seller (Demo)</span>
                </button>

                <Link
                  href="/login"
                  className="w-full py-3.5 bg-slate-900 text-white font-heading font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In / Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Card3D>
        ) : (
          /* AUTHENTICATED MULTI-STEP WIZARD */
          <div className="space-y-8">
            
            {/* Step Indicator Header Bar */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider block">
                    Step {step} of 9 — {stepsList[step - 1]?.label}
                  </span>
                  <h2 className="font-heading text-2xl font-bold text-slate-900">
                    {step === 1 && "Seller Contact & Agency Details"}
                    {step === 2 && "Property Basic Information"}
                    {step === 3 && "Location & Privacy Preferences"}
                    {step === 4 && "Land & Building Specifications"}
                    {step === 5 && "Farmhouse Features & Utilities"}
                    {step === 6 && "Legal Documents & Title Verification"}
                    {step === 7 && "Photos, Drone Video & 360° Tours"}
                    {step === 8 && "Selling Terms & Privacy Settings"}
                    {step === 9 && "Review & Submit for Verification"}
                  </h2>
                </div>

                {/* Status Pipeline Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Pipeline: Draft → Submitted → Review → Verified</span>
                </div>
              </div>

              {/* Step Navigation Dots */}
              <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
                {stepsList.map((st) => (
                  <button
                    key={st.num}
                    onClick={() => setStep(st.num)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-all ${
                      step === st.num
                        ? "bosa-gradient-bg text-white shadow-md"
                        : step > st.num
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <span>{st.num}.</span>
                    <span>{st.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* WIZARD CARD PANEL */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
              
              {/* ==================================================================== */}
              {/* STEP 1: SELLER DETAILS */}
              {/* ==================================================================== */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">Seller Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["Owner", "Dealer", "Builder"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSellerType(type)}
                          className={`py-3 rounded-xl text-xs font-bold font-heading border transition-all ${
                            sellerType === type
                              ? "bosa-gradient-bg text-white shadow-md border-[#D4AF37]"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Vikramaditya Singhania"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Mobile Number *</label>
                      <input
                        type="text"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">WhatsApp Number *</label>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="owner@haveliestates.in"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Preferred Contact Method</label>
                      <select
                        value={preferredContact}
                        onChange={(e) => setPreferredContact(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none"
                      >
                        <option value="WhatsApp">WhatsApp Message</option>
                        <option value="Phone Call">Direct Phone Call</option>
                        <option value="Email">Email Communication</option>
                      </select>
                    </div>

                    {sellerType === "Dealer" && (
                      <div>
                        <label className="font-bold text-slate-800 block mb-1">Agency / Company Name *</label>
                        <input
                          type="text"
                          value={agencyName}
                          onChange={(e) => setAgencyName(e.target.value)}
                          placeholder="Singhania Luxury Estates Advisory"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==================================================================== */}
              {/* STEP 2: PROPERTY BASIC DETAILS */}
              {/* ==================================================================== */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">Property Category</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(["Farmhouse", "Villa", "Luxury Bungalow", "Farm Land + House"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setPropertyType(type as any)}
                          className={`py-3 rounded-xl text-xs font-bold font-heading border transition-all ${
                            propertyType === type
                              ? "bosa-gradient-bg text-white shadow-md border-[#D4AF37]"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Property Title *</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Luxury 2.5 Acre Gated Farmhouse in Chhatarpur with Swimming Pool & Lawn"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Short Description *</label>
                      <textarea
                        rows={4}
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        placeholder="Architectural features, gated lawns, pool deck, guest suites, borewell, and road frontage..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-bold text-slate-800 block mb-1">Expected Price (₹ INR) *</label>
                        <input
                          type="number"
                          value={expectedPrice}
                          onChange={(e) => setExpectedPrice(e.target.value)}
                          placeholder="250000000 (₹25 Cr)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 font-bold"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-800 block mb-1">Price Negotiable?</label>
                        <select
                          value={priceNegotiable}
                          onChange={(e) => setPriceNegotiable(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900"
                        >
                          <option value="Yes">Yes, Slightly Negotiable</option>
                          <option value="No">No, Fixed Price</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-800 block mb-1">Property Status</label>
                        <select
                          value={propertyStatus}
                          onChange={(e) => setPropertyStatus(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900"
                        >
                          <option value="Ready to Move">Ready to Move</option>
                          <option value="Under Construction">Under Construction</option>
                          <option value="Land Only">Land Only with Approved Plan</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================================== */}
              {/* STEP 3: LOCATION DETAILS & PRIVACY */}
              {/* ==================================================================== */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">State *</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Delhi NCR"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">City *</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Delhi / Gurgaon / Alibaug"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Locality / Area *</label>
                      <input
                        type="text"
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        placeholder="Chhatarpur / Assagao / Golf Course Extension"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Pincode</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="110074"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-800 block mb-1">Full Address / House No.</label>
                      <input
                        type="text"
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                        placeholder="DLF Farms, Ansal Villa Zone, Chhatarpur, New Delhi"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900"
                      />
                    </div>
                  </div>

                  {/* PRIVACY TOGGLE: HIDE EXACT ADDRESS */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-900">
                      <input
                        type="checkbox"
                        checked={hideExactAddress}
                        onChange={(e) => setHideExactAddress(e.target.checked)}
                        className="w-4 h-4 text-emerald-800 rounded"
                      />
                      <span>Hide Exact Address on Public Listing (Show Locality Only)</span>
                    </label>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Recommended for privacy. Buyers will see "Chhatarpur, South Delhi" until a site visit is confirmed.
                    </p>
                  </div>
                </div>
              )}

              {/* ==================================================================== */}
              {/* STEP 4: LAND & BUILDING DETAILS */}
              {/* ==================================================================== */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-heading text-lg font-bold text-slate-900">Land Specifications</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Total Land Area *</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={totalLandArea}
                          onChange={(e) => setTotalLandArea(e.target.value)}
                          placeholder="2.5"
                          className="w-2/3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900"
                        />
                        <select
                          value={landAreaUnit}
                          onChange={(e) => setLandAreaUnit(e.target.value)}
                          className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl px-1 py-2.5 font-bold"
                        >
                          <option value="acre">Acres</option>
                          <option value="bigha">Bigha</option>
                          <option value="sqyd">Sq.Yd.</option>
                          <option value="sqft">Sq.Ft.</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Frontage</label>
                      <input
                        type="text"
                        value={frontage}
                        onChange={(e) => setFrontage(e.target.value)}
                        placeholder="180 Ft Front Road"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Ownership Type</label>
                      <select
                        value={ownershipType}
                        onChange={(e) => setOwnershipType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900"
                      >
                        <option value="Freehold Single Owner">Freehold Single Owner</option>
                        <option value="Joint Family Ownership">Joint Family Ownership</option>
                        <option value="Company Owned">Company Owned</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-b border-slate-100 pb-3 pt-4">
                    <h3 className="font-heading text-lg font-bold text-slate-900">Mansion & Building Specs</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Built-up Area (Sq.Ft.)</label>
                      <input
                        type="number"
                        value={builtUpAreaSqft}
                        onChange={(e) => setBuiltUpAreaSqft(e.target.value)}
                        placeholder="12500"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Bedrooms</label>
                      <input
                        type="number"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        placeholder="5"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Bathrooms</label>
                      <input
                        type="number"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        placeholder="6"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Furnished Status</label>
                      <select
                        value={furnishedStatus}
                        onChange={(e) => setFurnishedStatus(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900"
                      >
                        <option value="Fully Furnished">Fully Furnished</option>
                        <option value="Semi Furnished">Semi Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================================== */}
              {/* STEP 5: FARMHOUSE AMENITIES CHECKBOXES */}
              {/* ==================================================================== */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-heading text-lg font-bold text-slate-900">
                      Select Farmhouse & Estate Amenities (21 Checkboxes)
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    {Object.keys(amenities).map((name) => (
                      <label
                        key={name}
                        onClick={() => toggleAmenity(name)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          amenities[name]
                            ? "bg-emerald-50 border-emerald-500 font-bold text-emerald-900 shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{name}</span>
                        <input
                          type="checkbox"
                          checked={amenities[name]}
                          onChange={() => {}}
                          className="w-4 h-4 text-emerald-800"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ==================================================================== */}
              {/* STEP 6: LEGAL & DOCUMENTS (MANDATORY AUDIT SECTION) */}
              {/* ==================================================================== */}
              {step === 6 && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
                    <ShieldCheck className="w-6 h-6 text-[#D4AF37] shrink-0" />
                    <span>
                      <strong>Admin Legal Moderation Queue:</strong> Uploading deed documents speeds up verification and awards the Verified badge.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Title Deed / Registry Available? *</label>
                      <select
                        value={registryAvailable}
                        onChange={(e) => setRegistryAvailable(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 font-bold"
                      >
                        <option value="Yes">Yes, Registered Deed Available</option>
                        <option value="No">No, Pending Mutation</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Litigation / Dispute Status *</label>
                      <select
                        value={hasLitigation}
                        onChange={(e) => setHasLitigation(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900"
                      >
                        <option value="No">No Litigation (Clean Title)</option>
                        <option value="Yes">Under Litigation</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-3 pt-2">
                      <label className="font-bold text-slate-800 block">Deed Document Link / Attachment URL</label>
                      <input
                        type="text"
                        value={docRegistryUrl}
                        onChange={(e) => setDocRegistryUrl(e.target.value)}
                        placeholder="https://haveliestates.in/docs/registry.pdf"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================================== */}
              {/* STEP 7: PHOTOS & VIDEOS */}
              {/* ==================================================================== */}
              {step === 7 && (
                <div className="space-y-6">
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Main Cover Photo URL *</label>
                      <input
                        type="text"
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Garden / Drone Photo URL</label>
                      <input
                        type="text"
                        value={gardenImageUrl}
                        onChange={(e) => setGardenImageUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">360° Virtual Tour / Matterport Link</label>
                      <input
                        type="text"
                        value={tour360Url}
                        onChange={(e) => setTour360Url(e.target.value)}
                        placeholder="https://my.matterport.com/show/?m=xxx"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================================== */}
              {/* STEP 8: PRICING & SETTINGS */}
              {/* ==================================================================== */}
              {step === 8 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Urgent Sale?</label>
                      <select
                        value={urgentSale}
                        onChange={(e) => setUrgentSale(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900"
                      >
                        <option value="No">No, Standard Sale</option>
                        <option value="Yes">Yes, Urgent Sale</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Site Visit Timing</label>
                      <input
                        type="text"
                        value={siteVisitTiming}
                        onChange={(e) => setSiteVisitTiming(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900">
                      <input
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        className="w-4 h-4 text-emerald-800 rounded"
                      />
                      <span>I agree to the Terms & Conditions and certify title ownership.</span>
                    </label>
                  </div>
                </div>
              )}

              {/* ==================================================================== */}
              {/* STEP 9: PREVIEW LISTING & SUBMIT */}
              {/* ==================================================================== */}
              {step === 9 && (
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 rounded-md bosa-gradient-bg text-white font-bold uppercase text-[10px]">
                        {propertyType}
                      </span>
                      <span className="font-heading text-2xl font-extrabold text-emerald-900">
                        ₹ {expectedPrice ? parseFloat(expectedPrice).toLocaleString("en-IN") : "25,00,00,000"}
                      </span>
                    </div>

                    <h3 className="font-heading text-xl font-bold text-slate-900">
                      {title || `Verified ${propertyType} in ${locality}`}
                    </h3>

                    <p className="text-slate-600 leading-relaxed">
                      {shortDescription || "No short description provided."}
                    </p>

                    <div className="pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 font-bold text-slate-800">
                      <div>Land: {totalLandArea} {landAreaUnit}</div>
                      <div>Built: {builtUpAreaSqft} Sqft</div>
                      <div>Bedrooms: {bedrooms} BHK</div>
                      <div>Address: {hideExactAddress ? `${locality}, ${city} (Hidden)` : fullAddress}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================================== */}
              {/* STEP 10: SUCCESS */}
              {/* ==================================================================== */}
              {step === 10 && (
                <div className="text-center py-10 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                  <h2 className="font-heading text-3xl font-bold text-slate-900">Submitted for Verification!</h2>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Your estate listing pipeline status: <strong>Submitted → Under Review</strong>. Platform legal auditors will verify your deed documents before assigning the Verified badge.
                  </p>
                  <button
                    onClick={() => router.push("/properties")}
                    className="px-8 py-3.5 bosa-gradient-bg text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg"
                  >
                    View Public Marketplace
                  </button>
                </div>
              )}

              {/* WIZARD CONTROLS */}
              {step <= 9 && (
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <button
                    disabled={step === 1}
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"
                  >
                    Back
                  </button>

                  {step === 9 ? (
                    <button
                      disabled={submitting}
                      onClick={handleSubmit}
                      className="px-8 py-3.5 bosa-gradient-bg text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      {submitting ? "Submitting..." : "Submit for Verification"}
                    </button>
                  ) : (
                    <button
                      onClick={() => setStep(step + 1)}
                      className="px-8 py-3.5 bosa-gradient-bg text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-1.5"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}
