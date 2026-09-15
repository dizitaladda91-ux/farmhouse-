import React from "react";
import Link from "next/link";
import { Building2, ShieldCheck, MapPin, Phone, Mail, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1A365D] border-t-2 border-[#D4AF37]/50 text-slate-100 text-sm font-sans pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-blue-900/60">
          
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37] p-0.5 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-[#1A365D] rounded-[10px] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#D4AF37]" />
                </div>
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-wide">
                HAVELI <span className="text-[#D4AF37]">&</span> ESTATES
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300 font-normal">
              India's premier digital marketplace exclusively dedicated to curated farmhouses, luxury bungalows, hilltop estates, and ultra-high-net-worth residential properties.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Legal Listings</span>
            </div>
          </div>

          {/* Col 2: Property Categories */}
          <div>
            <h4 className="font-serif text-white font-bold text-base mb-4 tracking-wider uppercase border-b border-[#D4AF37]/30 pb-2 inline-block">
              Property Categories
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              {[
                { label: "Luxury Farmhouses (Delhi NCR, Chhatarpur)", href: "/properties?property_type=Farmhouse" },
                { label: "Modern Luxury Bungalows", href: "/properties?property_type=Luxury+Bungalow" },
                { label: "Beachfront & Coastal Villas (Alibaug, Goa)", href: "/properties?property_type=Villa" },
                { label: "Private Gated Estates", href: "/properties?property_type=Estate" },
                { label: "Hillstation Weekend Homes (Lonavala, Pune)", href: "/properties?property_type=Weekend+Home" }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-slate-300 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 group">
                    <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Prime Locations */}
          <div>
            <h4 className="font-serif text-white font-bold text-base mb-4 tracking-wider uppercase border-b border-[#D4AF37]/30 pb-2 inline-block">
              Prime Indian Destinations
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              {[
                { label: "Chhatarpur & DLF Farms, Delhi", href: "/properties?location=Delhi" },
                { label: "Golf Course Road & Baliawas, Gurgaon", href: "/properties?location=Gurgaon" },
                { label: "Mandwa & Awas Coastal Belt, Alibaug", href: "/properties?location=Alibaug" },
                { label: "Assagao & Vagator Heritage, North Goa", href: "/properties?location=Assagao" },
                { label: "Tungarli Hills & Khandala, Maharashtra", href: "/properties?location=Lonavala" }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-slate-300 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 group">
                    <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Concierge & Contact */}
          <div>
            <h4 className="font-serif text-white font-bold text-base mb-4 tracking-wider uppercase border-b border-[#D4AF37]/30 pb-2 inline-block">
              Private Concierge
            </h4>
            <p className="text-sm text-slate-300 mb-4 font-normal leading-relaxed">
              Schedule confidential site visits or speak directly with our luxury estate advisory team.
            </p>
            <div className="space-y-2.5 text-sm font-medium text-slate-200">
              <a href="tel:+919876543210" className="flex items-center gap-2.5 text-slate-200 hover:text-[#D4AF37] transition-colors">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+91 98765 43210</span>
              </a>
              <a href="mailto:concierge@haveliestates.in" className="flex items-center gap-2.5 text-slate-200 hover:text-[#D4AF37] transition-colors">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>concierge@haveliestates.in</span>
              </a>
              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-xs">DLF Cyber City, Gurgaon & Chhatarpur, New Delhi</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-medium text-slate-400 gap-4">
          <p>© 2026 Haveli & Estates Marketplace. All rights reserved. RERA Compliant Platform.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
            <Link href="/admin" className="text-[#D4AF37] hover:underline font-semibold">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


