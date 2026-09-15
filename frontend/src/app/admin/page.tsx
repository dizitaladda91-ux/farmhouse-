"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import Card3D from "@/components/ui/Card3D";
import { fetchApi } from "@/lib/api";
import { Property, User } from "@/types";
import { ShieldCheck, CheckCircle2, XCircle, Users, Building2, Eye, Award, Sparkles } from "lucide-react";

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    try {
      const [analyticsData, pendingData] = await Promise.all([
        fetchApi<any>("/admin/analytics").catch(() => null),
        fetchApi<Property[]>("/admin/properties/pending").catch(() => [])
      ]);
      setAnalytics(analyticsData);
      setPendingProperties(pendingData || []);
    } catch (err) {
      console.error("Admin data error", err);
    } finally {
      setLoading(false);
    }
  }

  const handleVerify = async (propertyId: string, status: "VERIFIED" | "REJECTED") => {
    try {
      await fetchApi(`/admin/properties/${propertyId}/verify?status_choice=${status}`, {
        method: "POST"
      });
      loadAdminData();
    } catch (err) {
      console.error("Failed to verify property", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
      <Navbar />

      {/* HEADER BANNER */}
      <div className="bg-white border-b border-slate-200 py-10 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Platform Governance & Legal Moderation</span>
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-slate-900">
              Admin <span className="bosa-gradient-text">Verification Portal</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <Card3D intensity={6} depth={12}>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <Users className="w-6 h-6 text-emerald-800 mb-2" />
                <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Registered Users</span>
                <span className="font-heading text-3xl font-extrabold text-slate-900">{analytics.users?.total || 0}</span>
              </div>
            </Card3D>

            <Card3D intensity={6} depth={12}>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <Building2 className="w-6 h-6 text-emerald-800 mb-2" />
                <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Marketplace Listings</span>
                <span className="font-heading text-3xl font-extrabold text-slate-900">{analytics.properties?.total || 0}</span>
              </div>
            </Card3D>

            <Card3D intensity={6} depth={12}>
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-amber-600 mb-2" />
                <span className="text-xs text-amber-800 font-bold block uppercase tracking-wider">Pending Verification</span>
                <span className="font-heading text-3xl font-extrabold text-amber-800">{analytics.properties?.pending_verification || 0}</span>
              </div>
            </Card3D>

            <Card3D intensity={6} depth={12}>
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 shadow-sm">
                <Award className="w-6 h-6 text-emerald-700 mb-2" />
                <span className="text-xs text-emerald-800 font-bold block uppercase tracking-wider">Verified Estates</span>
                <span className="font-heading text-3xl font-extrabold text-emerald-800">{analytics.properties?.verified || 0}</span>
              </div>
            </Card3D>
          </div>
        )}

        {/* Verification Queue */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <h2 className="font-heading text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
            Pending Property Verification Queue
          </h2>

          {pendingProperties.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <p className="font-bold text-slate-900 text-sm">All Properties Processed</p>
              <p>There are no listings awaiting admin verification.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingProperties.map((prop) => (
                <div key={prop.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-emerald-800 uppercase font-mono tracking-wider font-bold">
                      {prop.property_type}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-slate-900">{prop.title}</h3>
                    <p className="text-xs text-slate-500">
                      Owner: {prop.owner_name || prop.owner_id} | Price: ₹ {(prop.price / 10000000).toFixed(2)} Cr
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleVerify(prop.id, "VERIFIED")}
                      className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-900 shadow-md transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                      <span>Approve & Verify</span>
                    </button>
                    <button
                      onClick={() => handleVerify(prop.id, "REJECTED")}
                      className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-300 transition-all"
                    >
                      <XCircle className="w-4 h-4 text-slate-500" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
}
