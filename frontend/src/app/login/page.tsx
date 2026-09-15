"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import Card3D from "@/components/ui/Card3D";
import { useAuth } from "@/lib/auth";
import { fetchApi } from "@/lib/api";
import { Building2, Lock, Mail, User as UserIcon, Phone, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("admin@farmhousemarketplace.in");
  const [password, setPassword] = useState("AdminPass123!");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"BUYER" | "SELLER">("BUYER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await fetchApi("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            phone,
            role
          })
        });
      }

      const res = await fetchApi<{ access_token: string; user_id: string; role: string; full_name: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      login(res.access_token, {
        id: res.user_id,
        email,
        full_name: res.full_name,
        role: res.role as any,
        is_verified: true,
        created_at: new Date().toISOString()
      });

      router.push(res.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col justify-between">
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-16 w-full">
        <Card3D intensity={6} depth={15}>
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bosa-gradient-bg p-0.5 mx-auto mb-3 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#D4AF37]" />
                </div>
              </div>
              <h1 className="font-heading text-2xl font-bold text-slate-900">
                {isRegister ? "Create Your Account" : "Sign In to Marketplace"}
              </h1>
              <p className="text-xs text-slate-500">
                {isRegister ? "Join as a Buyer or Seller to access luxury listings" : "Access your saved properties and seller inquiries"}
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              {isRegister && (
                <>
                  <div>
                    <label className="text-slate-800 font-bold block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Vikramaditya Singh"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-800 font-bold block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-800 font-bold block mb-1">Account Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none"
                    >
                      <option value="BUYER">Property Buyer / Investor</option>
                      <option value="SELLER">Property Owner / Seller</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="text-slate-800 font-bold block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@farmhousemarketplace.in"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-800 font-bold block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bosa-gradient-bg text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all mt-4"
              >
                <span>{loading ? "Authenticating..." : isRegister ? "Create Account" : "Sign In"}</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <span className="font-bold text-emerald-800 block">Quick Demo Credentials:</span>
              <p>Admin: <code className="text-slate-900 font-mono font-bold">admin@farmhousemarketplace.in</code> / <code className="text-slate-900 font-mono font-bold">AdminPass123!</code></p>
              <p>Seller: <code className="text-slate-900 font-mono font-bold">vikram.singh@royalestates.in</code> / <code className="text-slate-900 font-mono font-bold">SellerPass123!</code></p>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-emerald-800 font-bold hover:underline"
              >
                {isRegister ? "Already have an account? Sign In" : "Don't have an account? Create One"}
              </button>
            </div>

          </div>
        </Card3D>
      </div>

      <Footer />
    </div>
  );
}
