"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getCookie, deleteCookie } from "@/lib/cookies";
import {
  Activity,
  LayoutDashboard,
  FileText,
  User,
  Zap,
  LogOut,
  Menu,
  X,
  Clock,
  ChevronDown,
} from "lucide-react";

type UserType = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserType | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const token = getCookie("pcos_token");
    const userData = getCookie("pcos_user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        console.warn("Invalid user data in cookie");
      }
    }
  }, [pathname]); // Re-check on route changes

  function logout() {
    deleteCookie("pcos_token");
    deleteCookie("pcos_user");
    setUser(null);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const navLinks = user ? [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/assess", label: "Assessment", icon: Zap },
    { href: "/history", label: "History", icon: Clock },
    { href: "/profile", label: "Profile", icon: User },
  ] : [];

  const isActive = (href: string) => pathname === href;
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-purple-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-teal-600 to-purple-600 p-2.5 rounded-xl text-white transition-transform group-hover:scale-105">
                <Activity size={20} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900">
                PCOS<span className="bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">AI</span>
              </span>
            </div>
          </button>

          {user ? (
            <>
              {/* Desktop Navigation - Logged In */}
              <div className="hidden md:flex items-center gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => router.push(link.href)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      isActive(link.href)
                        ? "bg-gradient-to-r from-teal-50 to-purple-50 text-teal-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <link.icon size={18} strokeWidth={2} />
                    <span>{link.label}</span>
                  </button>
                ))}
              </div>

              {/* User Menu (Desktop) */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    {user.first_name[0]}{user.last_name[0]}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900">
                      {user.first_name} {user.last_name}
                    </p>
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0" onClick={() => setUserMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                      <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200">
                        <p className="text-sm font-semibold text-slate-900">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                      </div>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 transition-colors font-medium text-sm"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Button - Logged In */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X size={24} className="text-slate-700" />
                ) : (
                  <Menu size={24} className="text-slate-700" />
                )}
              </button>
            </>
          ) : (
            <>
              {/* Desktop - Not Logged In */}
              <div className="hidden md:flex items-center gap-3">
                {!isAuthPage && (
                  <>
                    <button
                      onClick={() => router.push("/login")}
                      className="px-5 py-2 text-slate-700 font-semibold text-sm hover:text-slate-900 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => router.push("/register")}
                      className="px-5 py-2 bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 text-white rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>

              {/* Mobile - Not Logged In */}
              <div className="md:hidden flex items-center gap-2">
                {!isAuthPage && (
                  <>
                    <button
                      onClick={() => router.push("/login")}
                      className="px-4 py-2 text-slate-700 font-semibold text-sm"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => router.push("/register")}
                      className="px-4 py-2 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-lg font-semibold text-sm shadow-md"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu - Logged In */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            {/* User Info */}
            <div className="px-4 py-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl mb-3 border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                  {user.first_name[0]}{user.last_name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => {
                  router.push(link.href);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                  isActive(link.href)
                    ? "bg-gradient-to-r from-teal-50 to-purple-50 text-teal-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <link.icon size={20} strokeWidth={2} />
                <span>{link.label}</span>
              </button>
            ))}

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-medium text-sm transition-all mt-3 border border-rose-200"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

