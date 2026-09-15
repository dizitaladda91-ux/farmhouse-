"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import { Property } from "@/types";
import { fetchApi } from "@/lib/api";
import { Heart, Sparkles } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const data = await fetchApi<Property[]>("/favorites/my");
        setFavorites(data || []);
      } catch (err) {
        console.error("Failed to load favorites", err);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
      <Navbar />

      {/* HEADER BANNER */}
      <div className="bg-white border-b border-slate-200 py-12 px-4 shadow-sm text-center">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Buyer Saved Collection</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Saved <span className="bosa-gradient-text">Farmhouses & Estates</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-normal">
            Your saved private collection of verified farmhouses, villas, and luxury bungalows.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-white animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-slate-200 shadow-sm my-8">
            <Heart className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">No Saved Properties</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the heart icon on any farmhouse or bungalow card to save it to your private collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((prop) => (
              <PropertyCard key={prop.id} property={prop} isFavorite={true} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
