"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Activity, AlertCircle, CheckCircle2, Shield } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Password strength calculation
  function getPasswordStrength(password: string) {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 33, label: "Weak", color: "bg-red-500" };
    if (strength <= 3) return { strength: 66, label: "Medium", color: "bg-amber-500" };
    return { strength: 100, label: "Strong", color: "bg-emerald-500" };
  }

  const passwordStrength = getPasswordStrength(form.password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md relative">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-40 h-40 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-purple-600 via-teal-600 to-slate-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Shield size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
              <p className="text-purple-100 text-sm mt-1">Join us for personalized PCOS care</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 animate-shake">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-900 font-semibold text-sm">Registration Failed</p>
                <p className="text-red-700 text-sm mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Inputs Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <User size={16} className="text-purple-600" />
                  First Name
                </label>
                <input
                  name="first_name"
                  type="text"
                  placeholder="John"
                  value={form.first_name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('first_name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 text-slate-900 placeholder:text-slate-400 bg-white ${
                    focusedField === 'first_name' ? 'scale-[1.02]' : ''
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <User size={16} className="text-purple-600" />
                  Last Name
                </label>
                <input
                  name="last_name"
                  type="text"
                  placeholder="Doe"
                  value={form.last_name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('last_name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 text-slate-900 placeholder:text-slate-400 bg-white ${
                    focusedField === 'last_name' ? 'scale-[1.02]' : ''
                  }`}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Mail size={16} className="text-purple-600" />
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
                  className="w-full px-4 py-3.5 pl-11 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 text-slate-900 placeholder:text-slate-400 bg-white"
                />
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                  focusedField === 'email' ? 'text-purple-600' : 'text-slate-400'
                }`} size={18} />
              </div>
            </div>

            {/* Password Input with Strength Meter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Lock size={16} className="text-purple-600" />
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
                  className="w-full px-4 py-3.5 pl-11 pr-11 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 text-slate-900 placeholder:text-slate-400 bg-white"
                />
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                  focusedField === 'password' ? 'text-purple-600' : 'text-slate-400'
                }`} size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors p-1 rounded-lg hover:bg-purple-50"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {form.password && (
                <div className="space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Password Strength</span>
                    <span className={`font-bold ${
                      passwordStrength.label === 'Strong' ? 'text-emerald-600' :
                      passwordStrength.label === 'Medium' ? 'text-amber-600' :
                      'text-red-600'
                    }`}>{passwordStrength.label}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
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
              <span className="px-4 bg-white text-slate-500 font-medium">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <a
            href="/login"
            className="block w-full text-center py-3.5 rounded-xl border-2 border-slate-200 hover:border-purple-500 text-slate-700 hover:text-purple-700 font-semibold transition-all duration-200 hover:bg-purple-50 group"
          >
            <span className="flex items-center justify-center gap-2">
              Sign In Instead
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
