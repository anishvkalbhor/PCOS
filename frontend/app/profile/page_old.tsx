"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/cookies";

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    blood_group: "",
  });

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const token = getCookie("pcos_token");
    const res = await fetch("http://127.0.0.1:8000/api/profile/me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/assess");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg space-y-4"
      >
        <h1 className="text-2xl font-bold">Complete Your Profile</h1>

        <input name="first_name" placeholder="First Name" required onChange={handleChange} />
        <input name="last_name" placeholder="Last Name" required onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="address" placeholder="Address" onChange={handleChange} />

        <select name="blood_group" onChange={handleChange}>
          <option value="">Blood Group</option>
          {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(bg =>
            <option key={bg} value={bg}>{bg}</option>
          )}
        </select>

        <button className="bg-teal-600 text-white w-full py-3 rounded-lg font-bold">
          Save Profile
        </button>
      </form>
    </div>
  );
}
