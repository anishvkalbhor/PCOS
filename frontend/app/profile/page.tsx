"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/cookies";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Droplet, 
  Ruler, 
  Weight,
  Edit,
  ArrowLeft,
  Loader2,
  AlertCircle
} from "lucide-react";

type ProfileData = {
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  address: string | null;
  blood_group: string | null;
  date_of_birth: string | null;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  profile_picture: string | null;
  is_complete: boolean;
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const token = getCookie("pcos_token");
      const res = await fetch("http://127.0.0.1:8000/api/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      setProfile(data);

      // If profile is incomplete, redirect to edit page
      if (!data.is_complete) {
        router.push("/profile/edit");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Calculate BMI
  const bmi = profile?.height_cm && profile?.weight_kg 
    ? (profile.weight_kg / Math.pow(profile.height_cm / 100, 2)).toFixed(1)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3 max-w-md">
          <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-900 font-semibold">Error Loading Profile</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-purple-50/30 py-12 px-4">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors mb-4 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-teal-600 to-purple-600 rounded-2xl text-white shadow-lg">
                <User size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-600 mt-1">Your personal and medical information</p>
              </div>
            </div>

            <button
              onClick={() => router.push("/profile/edit")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <Edit size={18} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Picture & Basic Info */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-8">
              <div className="flex items-center gap-6">
                {/* Profile Picture */}
                {profile.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt={`${profile.first_name} ${profile.last_name}`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-lg">
                    <User size={40} className="text-slate-600" />
                  </div>
                )}

                {/* Name & Email */}
                <div className="flex-1 text-white">
                  <h2 className="text-2xl font-bold">
                    {profile.first_name} {profile.last_name}
                  </h2>
                  <p className="text-slate-200 mt-1 flex items-center gap-2">
                    <Mail size={16} />
                    {profile.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <User size={24} />
                Personal Information
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date of Birth */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <Calendar size={16} className="text-teal-600" />
                    Date of Birth
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {profile.date_of_birth 
                      ? new Date(profile.date_of_birth).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : "Not provided"}
                  </p>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <Calendar size={16} className="text-teal-600" />
                    Age
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {profile.age ? `${profile.age} years` : "Not calculated"}
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <Phone size={16} className="text-teal-600" />
                    Phone Number
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {profile.phone || "Not provided"}
                  </p>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <MapPin size={16} className="text-teal-600" />
                    Address
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {profile.address || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Information Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Droplet size={24} />
                Medical Information
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Blood Group */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <Droplet size={16} className="text-purple-600" />
                    Blood Group
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {profile.blood_group || "Not provided"}
                  </p>
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <Ruler size={16} className="text-purple-600" />
                    Height
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {profile.height_cm ? `${profile.height_cm} cm` : "Not provided"}
                  </p>
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <Weight size={16} className="text-purple-600" />
                    Weight
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {profile.weight_kg ? `${profile.weight_kg} kg` : "Not provided"}
                  </p>
                </div>
              </div>

              {/* BMI Display */}
              {bmi && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-purple-900">Body Mass Index (BMI)</p>
                      <p className="text-xs text-purple-700 mt-1">Calculated from height and weight</p>
                    </div>
                    <div className="text-3xl font-bold text-purple-600">{bmi}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
