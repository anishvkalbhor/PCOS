"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie } from "@/lib/cookies";
import { 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  FileText, 
  Stethoscope, 
  UploadCloud, 
  BrainCircuit
} from "lucide-react";

type UserType = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const token = getCookie("pcos_token");
    const userData = getCookie("pcos_user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        
        // Check if user profile is complete
        checkProfileCompletion(token);
      } catch {
        console.warn("Invalid user data in cookie");
      }
    }
  }, []);

  async function checkProfileCompletion(token: string) {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const profile = await res.json();
        // Redirect to profile edit page if incomplete
        if (!profile.is_complete) {
          router.push("/profile/edit");
        }
      }
    } catch (err) {
      console.error("Error checking profile:", err);
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradient Blob */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-teal-50 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Zap size={14} fill="currentColor" />
            AI-Powered Diagnostics
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Early Detection for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
              Better Reproductive Health
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            A comprehensive screening tool combining clinical data and ultrasound imagery to assess PCOS risk with high precision.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => router.push("/assess")}
              className="w-full sm:w-auto px-8 py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition-all shadow-xl shadow-teal-200 flex items-center justify-center gap-2 group"
            >
              Take the Test
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <FileText size={20} />
              Read Research
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 border-t border-slate-100 pt-10">
            <Stat label="Accuracy Rate" value="96%" />
            <Stat label="Parameters Analyzed" value="25+" />
            <Stat label="Processing Time" value="< 2s" />
            <Stat label="Users Helped" value="10k+" />
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Our multi-modal approach analyzes both your physiological metrics and medical imaging for a holistic result.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-10" />

            <StepCard 
              step="01"
              icon={<FileText size={24} />}
              title="Enter Clinical Data"
              desc="Input your hormonal levels, cycle history, and body measurements into our secure form."
            />
            <StepCard 
              step="02"
              icon={<UploadCloud size={24} />}
              title="Upload Ultrasound"
              desc="Upload a clear image of your pelvic ultrasound. Our CV model scans for follicle patterns."
            />
            <StepCard 
              step="03"
              icon={<Activity size={24} />}
              title="Get Instant Analysis"
              desc="Receive a detailed risk report with probability scores and actionable insights."
            />
          </div>
        </div>
      </section>

      {/* ==================== FEATURES GRID ==================== */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Powered by Advanced <br /> 
                <span className="text-teal-600">Machine Learning</span>
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Traditional diagnosis can be subjective. Our system standardizes the assessment using a Random Forest classifier for tabular data and a Convolutional Neural Network (CNN) for image analysis.
              </p>
              
              <div className="space-y-6">
                <FeatureRow 
                  icon={<BrainCircuit className="text-teal-600" />}
                  title="Dual-Modal Analysis"
                  desc="Combines phenotype data with computer vision for maximum reliability."
                />
                <FeatureRow 
                  icon={<ShieldCheck className="text-teal-600" />}
                  title="Privacy First"
                  desc="Your medical data is processed locally where possible and never sold."
                />
                <FeatureRow 
                  icon={<Stethoscope className="text-teal-600" />}
                  title="Doctor Friendly"
                  desc="Outputs standard medical reports that you can share with your gynecologist."
                />
              </div>
            </div>
            
            {/* Visual Abstract / Decoration */}
            <div className="relative">
              <div className="absolute inset-0 bg-teal-600/5 rounded-3xl -rotate-3 transform" />
              <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 p-32 bg-teal-500/20 blur-3xl rounded-full pointer-events-none" />
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="font-mono text-sm text-teal-300">ANALYSIS_LOG_01</span>
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">COMPLETE</span>
                   </div>
                   <div className="space-y-3 font-mono text-sm opacity-80">
                      <p>{">"} Loading tabular parameters...</p>
                      <p>{">"} Normalizing LH/FSH ratios...</p>
                      <p>{">"} Scanning ROI in ultrasound.jpg...</p>
                      <p>{">"} Follicle count: 12 (Right Ovary)</p>
                      <p className="text-white font-bold mt-4">{">"} FINAL RISK SCORE: LOW (12%)</p>
                   </div>
                   <button className="w-full bg-teal-600 hover:bg-teal-500 py-3 rounded-lg font-semibold transition-colors mt-4">
                      View Full Report
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-20 bg-teal-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to check your health?</h2>
          <p className="text-teal-100 text-lg mb-10">
            It takes less than 5 minutes to complete the assessment. Get peace of mind today.
          </p>
          <button 
            onClick={() => router.push("/assess")}
            className="bg-white text-teal-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-teal-50 hover:scale-105 transition-all shadow-2xl"
          >
            Start Free Assessment
          </button>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
               <div className="bg-slate-900 p-2 rounded-lg text-white">
                  <Activity size={18} />
               </div>
               <span className="text-xl font-bold text-slate-800">PCOS<span className="text-teal-600">AI</span></span>
            </div>
            <div className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} PCOS AI Diagnostics. All rights reserved.
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center">
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">
              DISCLAIMER: This application is intended for educational and informational purposes only. It does not constitute medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ==================== SUB-COMPONENTS ==================== */

function Stat({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <div className="text-4xl font-extrabold text-slate-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function StepCard({ step, icon, title, desc }: any) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative z-10">
      <div className="text-6xl font-bold text-slate-100 absolute top-4 right-6 -z-10 select-none">
        {step}
      </div>
      <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureRow({ icon, title, desc }: any) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-1">
        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}