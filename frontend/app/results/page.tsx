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
  ChevronRight,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Calendar,
  Heart,
  Zap,
  Brain,
  Clock,
  User,
  Stethoscope,
  BookOpen,
  Printer,
  ChevronLeft,
  Lightbulb,
  Target,
  Apple,
  Dumbbell,
  Moon,
  Pill,
  AlertCircle,
  ExternalLink
} from "lucide-react";

type PCOSResult = {
  tabular_risk: number;
  ultrasound_risk: number;
  final_pcos_probability: number;
  risk_level: "LOW" | "MODERATE" | "HIGH";
  input_data?: any;
  assessment_date?: string;
};

type AssessmentHistory = {
  id: number;
  date: string;
  risk_level: string;
  probability: number;
};

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<PCOSResult | null>(null);
  const [history, setHistory] = useState<AssessmentHistory[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
    loadHistory();
  }, []);

  function loadResults() {
    const stored = getCookie("pcos_result");

    if (!stored) {
      router.push("/assess");
      return;
    }

    try {
      const data = JSON.parse(stored);
      setResult({
        ...data,
        assessment_date: new Date().toISOString()
      });
      setLoading(false);
    } catch {
      console.warn("Invalid result data in cookie");
      router.push("/assess");
    }
  }

  async function loadHistory() {
    try {
      const token = getCookie("pcos_token");
      if (!token) return;

      const res = await fetch("http://127.0.0.1:8000/api/assessments/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setHistory(data.slice(0, 5)); // Show last 5 assessments
      }
    } catch (err) {
      console.error("Error loading history:", err);
    }
  }

  async function handlePrint() {
    window.print();
  }

  async function handleDownloadPDF() {
    // For now, use browser print to PDF functionality
    window.print();
  }

  if (loading || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/30 to-purple-50/30">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-6"></div>
            <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Your Assessment</h3>
          <p className="text-slate-600">Generating comprehensive diagnostic report...</p>
        </div>
      </div>
    );
  }

  const theme = getTheme(result.risk_level);
  const recommendations = getRecommendations(result.risk_level);
  const educationalContent = getEducationalContent(result.risk_level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-purple-50/30 py-8 px-4 print:bg-white">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl -z-10 print:hidden"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl -z-10 print:hidden"></div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors print:hidden group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>

        {/* HEADER CARD */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden print:shadow-none">
          <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                  <FileText className="text-teal-400" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">PCOS Diagnostic Report</h1>
                  <p className="text-slate-300 text-sm flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date(result.assessment_date || Date.now()).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider">AI-Powered Clinical Assessment</p>
                </div>
              </div>
              
              <div className="flex gap-3 print:hidden">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-lg transition-all"
                >
                  <Printer size={18} />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all shadow-lg"
                >
                  <Download size={18} />
                  <span className="hidden sm:inline">Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* RISK ASSESSMENT CARD */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
              <div className={`${theme.bg} border-b ${theme.border} p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      {theme.icon}
                    </div>
                    <div>
                      <p className={`text-sm font-bold uppercase tracking-wider ${theme.color} opacity-70 mb-1`}>
                        Risk Assessment Level
                      </p>
                      <h2 className={`text-4xl font-bold ${theme.color}`}>
                        {result.risk_level} RISK
                      </h2>
                    </div>
                  </div>
                  
                  {/* Probability Circle */}
                  <div className="hidden sm:block">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-white"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.final_pcos_probability)}`}
                          className={theme.color.replace('text-', 'text-').replace('-700', '-600')}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xl font-bold ${theme.color}`}>
                          {(result.final_pcos_probability * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                    <span>Confidence Score</span>
                    <span>{(result.final_pcos_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner border border-white/50">
                    <div 
                      className={`h-full ${theme.bar} transition-all duration-1000 ease-out`} 
                      style={{ width: `${result.final_pcos_probability * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Clinical Interpretation */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Stethoscope size={20} className="text-teal-600" />
                  Clinical Interpretation
                </h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-slate-600 leading-relaxed">
                    {getInterpretation(result.risk_level, result.final_pcos_probability)}
                  </p>
                </div>
              </div>
            </div>

            {/* COMPONENT ANALYSIS */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Activity size={20} className="text-teal-600" />
                Component Analysis
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ScoreCard 
                  title="Clinical & Lab Data" 
                  score={result.tabular_risk}
                  icon={<Heart size={20} />}
                  desc="Derived from hormones, BMI, cycle history & symptoms."
                />
                
                <ScoreCard 
                  title="Ultrasound Analysis" 
                  score={result.ultrasound_risk}
                  icon={<Zap size={20} />}
                  desc="Based on ovarian morphology and follicle count."
                />
              </div>
            </div>

            {/* DETAILED PARAMETERS (Expandable) */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden print:hidden">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
              >
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FileText size={20} className="text-teal-600" />
                  Detailed Parameters
                </h3>
                {showDetails ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>
              
              {showDetails && result.input_data && (
                <div className="px-6 pb-6 border-t border-slate-100">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {Object.entries(result.input_data).map(([key, value]) => (
                      <div key={key} className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                          {key.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {typeof value === 'number' ? value.toFixed(2) : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PERSONALIZED RECOMMENDATIONS */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
              <button
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors print:bg-transparent"
              >
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Lightbulb size={20} className="text-teal-600" />
                  Personalized Recommendations
                </h3>
                <ChevronDown size={20} className={`transform transition-transform print:hidden ${showRecommendations ? 'rotate-180' : ''}`} />
              </button>
              
              {showRecommendations && (
                <div className="px-6 pb-6 space-y-4">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-gradient-to-r from-teal-50 to-purple-50 rounded-xl border border-teal-100">
                      <div className={`p-2 ${rec.color} rounded-lg h-fit`}>
                        {rec.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 mb-1">{rec.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{rec.description}</p>
                        {rec.tips && (
                          <ul className="mt-2 space-y-1">
                            {rec.tips.map((tip, i) => (
                              <li key={i} className="text-xs text-slate-500 flex items-start gap-2">
                                <ChevronRight size={14} className="text-teal-600 mt-0.5 shrink-0" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* QUICK ACTIONS */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 p-6 print:hidden">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Target size={20} className="text-teal-600" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/assess")}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  <RefreshCw size={18} />
                  <span className="font-semibold">New Assessment</span>
                </button>
                
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full flex items-center gap-3 p-3 border-2 border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 text-slate-700 rounded-lg transition-all"
                >
                  <User size={18} />
                  <span className="font-semibold">Update Profile</span>
                </button>
                
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center gap-3 p-3 border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-slate-700 rounded-lg transition-all"
                >
                  <Clock size={18} />
                  <span className="font-semibold">View History</span>
                </button>
              </div>
            </div>

            {/* ASSESSMENT HISTORY */}
            {showHistory && history.length > 0 && (
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 p-6 print:hidden">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-teal-600" />
                  Assessment History
                </h3>
                
                <div className="space-y-3">
                  {history.map((item, idx) => {
                    const isLatest = idx === 0;
                    const trend = idx > 0 ? 
                      (item.probability > history[idx - 1].probability ? 'up' : 
                       item.probability < history[idx - 1].probability ? 'down' : 'same') 
                      : 'same';
                    
                    return (
                      <div key={item.id} className={`p-3 rounded-lg border ${isLatest ? 'bg-teal-50 border-teal-200' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-500">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                          {trend !== 'same' && (
                            <span className={`flex items-center gap-1 text-xs ${trend === 'up' ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            item.risk_level === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                            item.risk_level === 'MODERATE' ? 'bg-amber-100 text-amber-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {item.risk_level}
                          </span>
                          <span className="text-sm font-semibold text-slate-700">
                            {(item.probability * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EDUCATIONAL CONTENT */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
              <button
                onClick={() => setShowEducation(!showEducation)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors print:bg-transparent"
              >
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen size={20} className="text-teal-600" />
                  Learn More
                </h3>
                <ChevronDown size={20} className={`transform transition-transform print:hidden ${showEducation ? 'rotate-180' : ''}`} />
              </button>
              
              {showEducation && (
                <div className="px-6 pb-6 space-y-4">
                  {educationalContent.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        {item.icon}
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2">
                        {item.content}
                      </p>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1 font-medium">
                          Read more <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* NEXT STEPS */}
            <div className="bg-gradient-to-br from-teal-600 to-purple-600 text-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <AlertCircle size={20} />
                Next Steps
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="mt-0.5 shrink-0" />
                  <span>Consult with a healthcare professional</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="mt-0.5 shrink-0" />
                  <span>Schedule follow-up tests if recommended</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="mt-0.5 shrink-0" />
                  <span>Monitor symptoms and lifestyle changes</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="mt-0.5 shrink-0" />
                  <span>Reassess in 3-6 months or as advised</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 flex gap-4">
          <AlertTriangle className="text-amber-600 shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-amber-900 mb-2">Medical Disclaimer</h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              This AI-generated report is a decision support tool and should not be considered a definitive medical diagnosis. 
              The results are based on the information provided and algorithmic analysis. Please consult a certified healthcare provider 
              (gynecologist or endocrinologist) for official diagnosis, interpretation, and treatment planning. Individual medical conditions 
              may vary and require professional evaluation.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-sm text-slate-500 pb-4">
          <p>Generated by PCOS AI Assessment Platform • {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

// Helper function for theme
function getTheme(level: string) {
  switch (level) {
    case "HIGH":
      return {
        color: "text-rose-700",
        bg: "bg-rose-50",
        border: "border-rose-200",
        bar: "bg-rose-500",
        icon: <AlertTriangle size={32} className="text-rose-600" />,
      };
    case "MODERATE":
      return {
        color: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        bar: "bg-amber-500",
        icon: <Info size={32} className="text-amber-600" />,
      };
    default:
      return {
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        bar: "bg-emerald-500",
        icon: <CheckCircle2 size={32} className="text-emerald-600" />,
      };
  }
}

// Helper function for interpretation
function getInterpretation(level: string, probability: number): string {
  const percentage = (probability * 100).toFixed(1);
  
  switch (level) {
    case "HIGH":
      return `The comprehensive AI analysis indicates a ${percentage}% probability of Polycystic Ovary Syndrome (PCOS). This assessment suggests significant markers consistent with PCOS pathophysiology. Key hormonal, metabolic, or morphological indicators show patterns commonly associated with this condition. We strongly recommend scheduling a consultation with a board-certified gynecologist or endocrinologist for clinical correlation, confirmatory testing (including comprehensive hormone panels and transvaginal ultrasound), and development of an appropriate treatment plan.`;
    
    case "MODERATE":
      return `The assessment reveals a ${percentage}% probability of PCOS, indicating moderate risk factors. While not definitive, several parameters suggest patterns that warrant clinical attention. Some hormonal imbalances, irregular menstrual patterns, or morphological features may be present. We recommend monitoring your symptoms closely (menstrual regularity, hirsutism, weight changes, acne) and consulting with a healthcare provider for further evaluation. Additional diagnostic tests may be beneficial to confirm or rule out PCOS.`;
    
    default:
      return `The analysis suggests a ${percentage}% probability of PCOS, which falls within the low-risk category. The assessed parameters do not strongly indicate PCOS at this time. However, continue to maintain healthy lifestyle practices including balanced nutrition, regular physical activity, and stress management. Annual wellness checkups with your healthcare provider are recommended to monitor your reproductive and metabolic health. If you experience changes in menstrual patterns, unexplained weight gain, or other concerning symptoms, consult with a medical professional.`;
  }
}

// Helper function for recommendations
function getRecommendations(level: string) {
  const commonRecs = [
    {
      icon: <Apple className="text-white" size={20} />,
      color: "bg-emerald-600",
      title: "Nutrition & Diet",
      description: "Adopt a balanced, anti-inflammatory diet to support hormonal balance.",
      tips: [
        "Focus on whole foods: vegetables, fruits, lean proteins, whole grains",
        "Limit refined carbohydrates and sugary foods",
        "Include omega-3 rich foods (fish, flaxseeds, walnuts)",
        "Consider a low glycemic index (GI) diet"
      ]
    },
    {
      icon: <Dumbbell className="text-white" size={20} />,
      color: "bg-blue-600",
      title: "Physical Activity",
      description: "Regular exercise improves insulin sensitivity and hormonal balance.",
      tips: [
        "Aim for 150 minutes of moderate exercise weekly",
        "Combine cardio with strength training",
        "Try yoga or pilates for stress reduction",
        "Stay consistent with physical activity"
      ]
    },
    {
      icon: <Moon className="text-white" size={20} />,
      color: "bg-indigo-600",
      title: "Stress & Sleep",
      description: "Quality sleep and stress management are crucial for hormone regulation.",
      tips: [
        "Maintain 7-9 hours of sleep per night",
        "Practice stress-reduction techniques (meditation, deep breathing)",
        "Establish consistent sleep schedule",
        "Limit screen time before bed"
      ]
    }
  ];

  if (level === "HIGH") {
    return [
      {
        icon: <Stethoscope className="text-white" size={20} />,
        color: "bg-rose-600",
        title: "Immediate Medical Consultation",
        description: "Schedule an appointment with a gynecologist or endocrinologist within 2-4 weeks.",
        tips: [
          "Bring this report and any previous medical records",
          "Prepare a list of symptoms and their duration",
          "Discuss family history of PCOS, diabetes, or hormonal disorders",
          "Ask about comprehensive hormone panel and ultrasound"
        ]
      },
      ...commonRecs,
      {
        icon: <Pill className="text-white" size={20} />,
        color: "bg-purple-600",
        title: "Potential Treatments",
        description: "Discuss treatment options with your healthcare provider (this is informational only).",
        tips: [
          "Birth control pills for menstrual regulation",
          "Metformin for insulin resistance",
          "Anti-androgen medications for hirsutism/acne",
          "Fertility treatments if planning pregnancy"
        ]
      }
    ];
  } else if (level === "MODERATE") {
    return [
      {
        icon: <Brain className="text-white" size={20} />,
        color: "bg-amber-600",
        title: "Medical Follow-up",
        description: "Consult with a healthcare provider for further evaluation and monitoring.",
        tips: [
          "Schedule appointment within 4-6 weeks",
          "Track menstrual cycles and symptoms",
          "Consider hormone level testing",
          "Discuss preventive strategies"
        ]
      },
      ...commonRecs
    ];
  }

  return commonRecs;
}

// Helper function for educational content
function getEducationalContent(level: string) {
  return [
    {
      icon: <Brain size={16} className="text-teal-600" />,
      title: "What is PCOS?",
      content: "Polycystic Ovary Syndrome is a hormonal disorder affecting reproductive-aged women, characterized by irregular periods, excess androgen levels, and polycystic ovaries.",
      link: "https://www.mayoclinic.org/diseases-conditions/pcos/symptoms-causes/syc-20353439"
    },
    {
      icon: <Heart size={16} className="text-rose-600" />,
      title: "Common Symptoms",
      content: "Irregular periods, excessive hair growth, acne, weight gain, hair thinning, and darkening of skin are common PCOS symptoms. Not all women experience all symptoms.",
      link: "https://www.womenshealth.gov/a-z-topics/polycystic-ovary-syndrome"
    },
    {
      icon: <Zap size={16} className="text-amber-600" />,
      title: "Long-term Health",
      content: "PCOS can increase risk of type 2 diabetes, heart disease, and endometrial cancer. Early diagnosis and management significantly reduce these risks.",
      link: "https://www.nichd.nih.gov/health/topics/pcos"
    }
  ];
}

// Score Card Component
function ScoreCard({ title, score, icon, desc }: { title: string, score: number, icon: React.ReactNode, desc: string }) {
  const percentage = (score * 100).toFixed(1);
  const barColor = score > 0.6 ? "bg-rose-500" : score > 0.3 ? "bg-amber-500" : "bg-emerald-500";
  const textColor = score > 0.6 ? "text-rose-700" : score > 0.3 ? "text-amber-700" : "text-emerald-700";
  const bgColor = score > 0.6 ? "bg-rose-50" : score > 0.3 ? "bg-amber-50" : "bg-emerald-50";

  return (
    <div className="bg-white border-2 border-slate-100 rounded-xl p-5 hover:shadow-lg transition-all hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 ${bgColor} rounded-lg`}>
          <div className={textColor}>
            {icon}
          </div>
        </div>
        <span className={`text-2xl font-bold ${textColor}`}>{percentage}%</span>
      </div>
      
      <h4 className="font-bold text-slate-800 mb-2">{title}</h4>
      
      <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3">
        <div 
          className={`h-2.5 rounded-full ${barColor} transition-all duration-1000`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-slate-500 leading-snug">
        {desc}
      </p>
    </div>
  );
}
