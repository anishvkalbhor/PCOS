"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Activity, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await res.json();

      /**
       * Expected backend response:
       * {
       *   access_token: string,
       *   user: { id, email, first_name, last_name }
       * }
       */
      login(data.access_token, data.user);

      router.push("/"); // home/dashboard
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md relative">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-40 h-40 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Activity size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
              <p className="text-teal-100 text-sm mt-1">Sign in to continue your health journey</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 animate-shake">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-900 font-semibold text-sm">Authentication Failed</p>
                <p className="text-red-700 text-sm mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Mail size={16} className="text-teal-600" />
                Email Address
              </label>
              <div className={`relative group transition-all duration-300 ${
                focusedField === 'email' ? 'scale-[1.02]' : ''
              }`}>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full px-4 py-3.5 pl-11 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all duration-200 text-slate-900 placeholder:text-slate-400 bg-white"
                />
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                  focusedField === 'email' ? 'text-teal-600' : 'text-slate-400'
                }`} size={18} />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Lock size={16} className="text-teal-600" />
                Password
              </label>
              <div className={`relative group transition-all duration-300 ${
                focusedField === 'password' ? 'scale-[1.02]' : ''
              }`}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full px-4 py-3.5 pl-11 pr-11 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all duration-200 text-slate-900 placeholder:text-slate-400 bg-white"
                />
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                  focusedField === 'password' ? 'text-teal-600' : 'text-slate-400'
                }`} size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors p-1 rounded-lg hover:bg-teal-50"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-teal-600/30 hover:shadow-xl hover:shadow-teal-600/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500 font-medium">New to PCOS Care?</span>
            </div>
          </div>

          {/* Register Link */}
          <a
            href="/register"
            className="block w-full text-center py-3.5 rounded-xl border-2 border-slate-200 hover:border-teal-500 text-slate-700 hover:text-teal-700 font-semibold transition-all duration-200 hover:bg-teal-50 group"
          >
            <span className="flex items-center justify-center gap-2">
              Create New Account
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
