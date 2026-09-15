"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Crown, Compass, ShieldCheck, ArrowRight, Award, PhoneCall, CheckCircle2 } from "lucide-react";

export default function HeroClassic() {
  return (
    <div className="relative w-full min-h-[620px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-[#070D0B] border-b border-luxury-accent/30">
      
      {/* Background Image with Ken Burns Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/farmhouse-hero.jpg"
          alt="Luxury Classic Estate"
          fill
          priority
          className="object-cover animate-kenburns opacity-40 filter brightness-90 contrast-110"
        />
        {/* Layered Vignette & Dark Emerald Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1210] via-[#0A1210]/60 to-[#070D0B]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0A1210_90%)]" />
      </div>

      {/* Decorative Gold Corner Borders (Classical Architecture Motif) */}
      <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-luxury-accent/40 z-10 hidden sm:block pointer-events-none" />
      <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-luxury-accent/40 z-10 hidden sm:block pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-luxury-accent/40 z-10 hidden sm:block pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-luxury-accent/40 z-10 hidden sm:block pointer-events-none" />

      {/* Hero Content Box */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 pb-16">
        
        {/* Royal Crest Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full gold-badge backdrop-blur-md mb-8 shadow-2xl">
          <Crown className="w-4 h-4 text-luxury-accent" />
          <span className="font-cinzel text-xs tracking-[0.2em] uppercase text-luxury-accent font-semibold">
            ESTATES OF DISTINCTION & HERITAGE
          </span>
        </div>

        {/* Main Headline in Classic Cinzel Font */}
        <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
          India’s Most Prestigious <br />
          <span className="gold-gradient-text italic font-garamond font-normal font-serif">Private Sanctuaries</span> & Estates
        </h1>

        {/* Subhead in Classic Garamond Italic */}
        <p className="font-garamond text-lg sm:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed mt-6 italic">
          “Curated farmhouses, royal retreats, coastal villas, and sprawling agricultural estates for India’s most discerning buyers.”
        </p>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="/properties"
            className="w-full sm:w-auto px-9 py-4 rounded-xl bg-gold-gradient text-luxury-dark font-serif font-bold text-xs uppercase tracking-[0.2em] shadow-gold-glow hover:scale-105 transition-all flex items-center justify-center gap-2.5"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Private Portfolio</span>
          </Link>

          <Link
            href="/sell"
            className="w-full sm:w-auto px-9 py-4 rounded-xl glass-panel-dark border border-luxury-accent/50 text-white font-serif font-semibold text-xs uppercase tracking-[0.2em] hover:border-luxury-accent hover:bg-luxury-emerald/60 flex items-center justify-center gap-2.5 transition-all"
          >
            <Award className="w-4 h-4 text-luxury-accent" />
            <span>List An Estate</span>
          </Link>
        </div>

        {/* Trust Stats Bar */}
        <div className="mt-16 pt-8 border-t border-luxury-accent/20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-sans">
          <div>
            <span className="font-cinzel text-xl sm:text-2xl font-bold gold-gradient-text block">₹1,500+ Cr</span>
            <span className="text-[11px] text-gray-400 uppercase tracking-widest mt-1 block">Curated Portfolio Value</span>
          </div>

          <div>
            <span className="font-cinzel text-xl sm:text-2xl font-bold gold-gradient-text block">100%</span>
            <span className="text-[11px] text-gray-400 uppercase tracking-widest mt-1 block">Verified Title Deeds</span>
          </div>

          <div>
            <span className="font-cinzel text-xl sm:text-2xl font-bold gold-gradient-text block">5 Prime</span>
            <span className="text-[11px] text-gray-400 uppercase tracking-widest mt-1 block">Indian Destinations</span>
          </div>

          <div>
            <span className="font-cinzel text-xl sm:text-2xl font-bold gold-gradient-text block">Private</span>
            <span className="text-[11px] text-gray-400 uppercase tracking-widest mt-1 block">Advisory & Concierge</span>
          </div>
        </div>

      </div>
    </div>
  );
}
