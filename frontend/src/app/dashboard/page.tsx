"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import Card3D from "@/components/ui/Card3D";
import { useAuth } from "@/lib/auth";
import { fetchApi } from "@/lib/api";
import { Lead, SiteVisit, Property } from "@/types";
import { Building2, Eye, Phone, Calendar, ShieldCheck, MessageSquare, Plus, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSellerData() {
      try {
        const [leadsData, visitsData, propsData] = await Promise.all([
          fetchApi<Lead[]>("/leads/my").catch(() => []),
          fetchApi<SiteVisit[]>("/site-visits/my").catch(() => []),
          fetchApi<{ items: Property[] }>("/properties?limit=20").catch(() => ({ items: [] }))
        ]);
        setLeads(leadsData);
        setVisits(visitsData);
        setProperties(propsData.items || []);
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    }
    loadSellerData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
      <Navbar />

      {/* HEADER BANNER */}
      <div className="bg-white border-b border-slate-200 py-10 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Seller Advisory Management Suite</span>
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-slate-900">
              Welcome, <span className="bosa-gradient-text">{user?.full_name || "Seller"}</span>
            </h1>
          </div>

          <Link
            href="/sell"
            className="px-6 py-3 rounded-xl bosa-gradient-bg text-white font-heading font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>List New Property</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Analytics Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <Card3D intensity={6} depth={12}>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <Building2 className="w-6 h-6 text-emerald-800 mb-2" />
              <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Active Listings</span>
              <span className="font-heading text-3xl font-extrabold text-slate-900">{properties.length}</span>
            </div>
          </Card3D>

          <Card3D intensity={6} depth={12}>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <MessageSquare className="w-6 h-6 text-emerald-800 mb-2" />
              <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Total Enquiries</span>
              <span className="font-heading text-3xl font-extrabold text-slate-900">{leads.length}</span>
            </div>
          </Card3D>

          <Card3D intensity={6} depth={12}>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <Calendar className="w-6 h-6 text-emerald-800 mb-2" />
              <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Site Visits</span>
              <span className="font-heading text-3xl font-extrabold text-slate-900">{visits.length}</span>
            </div>
          </Card3D>

          <Card3D intensity={6} depth={12}>
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-700 mb-2" />
              <span className="text-xs text-emerald-800 font-bold block uppercase tracking-wider">Verified Badge</span>
              <span className="font-heading text-3xl font-extrabold text-emerald-800">Active</span>
            </div>
          </Card3D>
        </div>

        {/* Leads Table */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
          <h2 className="font-heading text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
            Recent Buyer Leads & Inquiries
          </h2>

          {leads.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No buyer enquiries received yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 font-bold">Buyer Name</th>
                    <th className="pb-3 font-bold">Property</th>
                    <th className="pb-3 font-bold">Interest</th>
                    <th className="pb-3 font-bold">Phone</th>
                    <th className="pb-3 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="py-3 font-bold text-slate-900">{l.name}</td>
                      <td className="py-3 text-emerald-800 font-bold">{l.property_title || "Estate"}</td>
                      <td className="py-3">{l.interest_type}</td>
                      <td className="py-3 font-mono">{l.phone}</td>
                      <td className="py-3 text-slate-400">{new Date(l.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
}
