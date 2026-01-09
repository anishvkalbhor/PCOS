"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/cookies";
import { 
  Activity, 
  FileText, 
  RefreshCw, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  ChevronRight
} from "lucide-react";

type PCOSResult = {
  tabular_risk: number;
  ultrasound_risk: number;
  final_pcos_probability: number;
  risk_level: "LOW" | "MODERATE" | "HIGH";
};

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<PCOSResult | null>(null);

  useEffect(() => {
    const stored = getCookie("pcos_result");

    if (!stored) {
      router.push("/assess");
      return;
    }

    try {
      setResult(JSON.parse(stored));
    } catch {
      console.warn("Invalid result data in cookie");
      router.push("/assess");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <Activity className="animate-spin mb-4 text-teal-600" size={48} />
        <p className="font-medium">Generating Diagnostic Report...</p>
      </div>
    );
  }

  // Dynamic Styling based on Risk Level
  const getTheme = (level: string) => {
    switch (level) {
      case "HIGH":
        return {
          color: "text-rose-700",
          bg: "bg-rose-50",
          border: "border-rose-200",
          bar: "bg-rose-500",
          icon: <AlertTriangle size={32} className="text-rose-600" />,
          title: "High Probability Detected"
        };
      case "MODERATE":
        return {
          color: "text-amber-700",
          bg: "bg-amber-50",
          border: "border-amber-200",
          bar: "bg-amber-500",
          icon: <Info size={32} className="text-amber-600" />,
          title: "Moderate Risk Factors"
        };
      default:
        return {
          color: "text-emerald-700",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          bar: "bg-emerald-500",
          icon: <CheckCircle2 size={32} className="text-emerald-600" />,
          title: "Low Probability"
        };
    }
  };

  const theme = getTheme(result.risk_level);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* HEADER */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Activity className="text-teal-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">Diagnostic Report</h1>
              <p className="text-slate-400 text-xs uppercase tracking-wider">AI-Powered Assessment</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium opacity-80">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="p-8">
          {/* MAIN RESULT CARD */}
          <div className={`rounded-xl p-6 mb-8 border ${theme.border} ${theme.bg}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${theme.color} opacity-70`}>Risk Assessment Level</p>
                <h2 className={`text-3xl font-bold ${theme.color} flex items-center gap-3`}>
                  {result.risk_level} RISK
                </h2>
              </div>
              <div className="bg-white p-3 rounded-full shadow-sm">
                {theme.icon}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-slate-600">
                <span>Confidence Score</span>
                <span>{(result.final_pcos_probability * 100).toFixed(1)}%</span>
              </div>
              <div className="h-4 bg-white rounded-full overflow-hidden shadow-inner border border-slate-100">
                <div 
                  className={`h-full ${theme.bar} transition-all duration-1000 ease-out`} 
                  style={{ width: `${result.final_pcos_probability * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* DETAILED BREAKDOWN */}
          <h3 className="text-slate-800 font-bold text-lg mb-4 flex items-center gap-2">
            <Activity size={20} className="text-teal-600" />
            Component Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Clinical Data Card */}
            <ScoreCard 
              title="Clinical & Lab Data" 
              score={result.tabular_risk} 
              desc="Derived from hormones, BMI, cycle history & symptoms."
            />
            
            {/* Ultrasound Card */}
            <ScoreCard 
              title="Ultrasound Analysis" 
              score={result.ultrasound_risk} 
              desc="Based on ovarian morphology and follicle count."
            />
          </div>

          {/* GUIDANCE SECTION */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
            <h3 className="text-slate-800 font-bold text-lg mb-3">Clinical Interpretation</h3>
            <div className="text-slate-600 space-y-2 text-sm leading-relaxed">
              {result.risk_level === "LOW" && (
                <p>
                  The AI model analysis suggests a <strong className="text-emerald-700">low likelihood</strong> of Polycystic Ovary Syndrome based on the provided parameters. 
                  Standard annual checkups and a balanced lifestyle are recommended.
                </p>
              )}
              {result.risk_level === "MODERATE" && (
                <p>
                  Results indicate a <strong className="text-amber-700">moderate risk profile</strong>. While not definitive, there are indicators consistent with PCOS. 
                  It is advisable to monitor symptoms (cycle regularity, weight changes) and consult a healthcare provider for a confirmatory diagnosis.
                </p>
              )}
              {result.risk_level === "HIGH" && (
                <p>
                  The analysis has identified a <strong className="text-rose-700">high probability</strong> of PCOS. 
                  Key markers (Hormonal or Morphological) are elevated. A formal consultation with a gynecologist or endocrinologist is strongly recommended for further evaluation and management.
                </p>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
            <button
              onClick={() => router.push("/assess")}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={18} />
              New Assessment
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all"
            >
              <Download size={18} />
              Save Report
            </button>
          </div>
          
          {/* DISCLAIMER */}
          <p className="text-xs text-slate-400 mt-8 text-center leading-relaxed max-w-lg mx-auto">
            Disclaimer: This AI-generated report is a decision support tool and is not a substitute for professional medical diagnosis. 
            Please consult a certified medical practitioner for official diagnosis and treatment.
          </p>

        </div>
      </div>
    </div>
  );
}

// Reusable Component for the small breakdown cards
function ScoreCard({ title, score, desc }: { title: string, score: number, desc: string }) {
  const percentage = (score * 100).toFixed(1);
  // Color logic for sub-scores
  const barColor = score > 0.6 ? "bg-rose-500" : score > 0.3 ? "bg-amber-500" : "bg-emerald-500";
  const textColor = score > 0.6 ? "text-rose-700" : score > 0.3 ? "text-amber-700" : "text-emerald-700";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-slate-700">{title}</h4>
        <span className={`text-xl font-bold ${textColor}`}>{percentage}%</span>
      </div>
      
      {/* Mini Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
        <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${percentage}%` }}></div>
      </div>
      
      <p className="text-xs text-slate-500 leading-snug">
        {desc}
      </p>
    </div>
  );
}