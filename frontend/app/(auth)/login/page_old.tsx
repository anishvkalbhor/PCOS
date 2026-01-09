"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-2xl font-bold text-center mb-6">
        Welcome Back
      </h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="input"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="input"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-teal-600 text-white py-2 rounded-lg font-semibold transition disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <a
          href="/register"
          className="text-teal-600 hover:underline"
        >
          Create one
        </a>
      </p>
    </div>
  );
}
