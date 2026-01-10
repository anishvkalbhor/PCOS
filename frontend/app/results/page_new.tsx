"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Apple,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Download,
  Dumbbell,
  FileText,
  Heart,
  Info,
  Lightbulb,
  Moon,
  Pill,
  Printer,
  RefreshCw,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  User,
  Zap,
  BarChart3,
  Shield,
  Eye,
  LineChart,
} from "lucide-react";
import { getCookie } from "@/lib/cookies";
import { getResult } from "@/lib/storage";

type PCOSResult = {
  status?: string;
  tabular_risk: number;
  ultrasound_risk: number;
  final_pcos_probability: number;
  risk_level: "LOW" | "MODERATE" | "HIGH";
  prediction?: string;
  confidence?: number;
  assessment_id?: number;
  input_data?: any;
  assessment_date?: string;
  gradcam_visualization?: {
    heatmap_overlay: string;
    heatmap_only: string;
    predicted_class: string;
    pcos_probability: number;
    non_pcos_probability: number;
    confidence: number;
    class_index: number;
  };
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
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'recommendations' | 'history' | 'learn'>('overview');
  const [heatmapView, setHeatmapView] = useState<'overlay' | 'only'>('overlay');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
    loadHistory();
  }, []);

  function loadResults() {
    console.log("🔍 Loading result from sessionStorage...");
    
    const data = getResult();
    console.log("📊 Retrieved result data:", data);

    if (!data) {
      console.error("❌ No result data found!");
      router.push("/assess");
      return;
    }

    if (!data.final_pcos_probability || !data.risk_level) {
      console.error("❌ Invalid result data structure:", data);
      router.push("/assess");
      return;
    }
    
    console.log("✅ Result loaded successfully");
    setResult({
      ...data,
      assessment_date: data.assessment_date || new Date().toISOString()
    });
    setLoading(false);
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
        setHistory(data.slice(0, 5));
      }
    } catch (err) {
      console.error("Error loading history:", err);
    }
  }

  async function handlePrint() {
    window.print();
  }

  async function handleDownloadPDF() {
    window.print();
  }

  if (loading || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-teal-400/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-6"></div>
            <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Analyzing Your Assessment</h3>
          <p className="text-slate-400">Generating comprehensive diagnostic report...</p>
        </div>
      </div>
    );
  }

  const theme = getTheme(result.risk_level);
  const recommendations = getRecommendations(result.risk_level);
  const educationalContent = getEducationalContent(result.risk_level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 print:bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden -z-10 print:hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '75ms'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '150ms'}}></div>
      </div>

      <div className="max-w-[1800px] mx-auto p-4 space-y-4 h-screen flex flex-col">
        {/* COMPACT HEADER */}
        <div className="flex items-center justify-between bg-slate-800/50 backdrop-blur-xl rounded-xl px-6 py-4 border border-slate-700/50 print:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-slate-300 hover:text-teal-400 transition-colors group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Home</span>
            </button>
            <div className="h-6 w-px bg-slate-600"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/20 rounded-lg">
                <FileText className="text-teal-400" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">PCOS Diagnostic Report</h1>
                <p className="text-xs text-slate-400">
                  {new Date(result.assessment_date || new Date()).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white rounded-lg transition-all"
            >
              <Printer size={16} />
              <span className="text-sm">Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all shadow-lg"
            >
              <Download size={16} />
              <span className="text-sm">Download</span>
            </button>
          </div>
        </div>

        {/* MAIN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden">
          {/* LEFT PANEL - Risk Score & Quick Stats */}
          <div className="lg:col-span-3 space-y-4 overflow-y-auto">
            {/* MAIN RISK CARD */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
              <div className="p-6 text-center">
                <div className="inline-block p-3 bg-white/10 rounded-2xl mb-3">
                  {theme.icon}
                </div>
                
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Risk Assessment
                </p>
                <h2 className={`text-6xl font-bold ${theme.color} mb-2`}>
                  {result.risk_level}
                </h2>
                
                <div className="relative inline-block mb-4">
                  <div className="text-3xl font-bold text-white">
                    {(result.final_pcos_probability * 100).toFixed(1)}%
                  </div>
                  <span className="text-xs text-slate-400 ml-1">probability</span>
                </div>
                
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${theme.bar} transition-all duration-1000 relative overflow-hidden`} 
                    style={{ width: `${result.final_pcos_probability * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900/50 px-6 py-4 border-t border-slate-700">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {getInterpretation(result.risk_level, result.final_pcos_probability).substring(0, 150)}...
                </p>
              </div>
            </div>

            {/* COMPONENT SCORES */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-5 space-y-3">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <BarChart3 size={16} className="text-teal-400" />
                Model Scores
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-300">Clinical Data</span>
                    <span className="text-xs font-bold text-teal-400">{(result.tabular_risk * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-teal-600" 
                      style={{ width: `${result.tabular_risk * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-300">Ultrasound</span>
                    <span className="text-xs font-bold text-purple-400">{(result.ultrasound_risk * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600" 
                      style={{ width: `${result.ultrasound_risk * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-5 print:hidden">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Target size={16} className="text-teal-400" />
                Quick Actions
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/assess")}
                  className="w-full flex items-center gap-2 p-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg transition-all text-sm font-medium"
                >
                  <RefreshCw size={16} />
                  New Assessment
                </button>
                
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full flex items-center gap-2 p-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white rounded-lg transition-all text-sm font-medium"
                >
                  <User size={16} />
                  Update Profile
                </button>
              </div>
            </div>
          </div>

          {/* CENTER PANEL - Main Content with Tabs */}
          <div className="lg:col-span-6 space-y-4 flex flex-col overflow-hidden">
            {/* TAB NAVIGATION */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-2 flex gap-2 overflow-x-auto print:hidden">
              {[
                { id: 'overview', icon: <Eye size={16} />, label: 'Overview' },
                { id: 'analysis', icon: <LineChart size={16} />, label: 'Analysis' },
                { id: 'recommendations', icon: <Lightbulb size={16} />, label: 'Recommendations' },
                { id: 'history', icon: <Clock size={16} />, label: 'History' },
                { id: 'learn', icon: <BookOpen size={16} />, label: 'Learn' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-teal-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <div className="bg-slate-800/30 backdrop-blur-xl rounded-xl border border-slate-700 overflow-hidden flex-1">
              <div className="h-full overflow-y-auto">
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="p-6 space-y-6">
                    {/* Clinical Interpretation */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Stethoscope size={20} className="text-teal-400" />
                        Clinical Interpretation
                      </h3>
                      <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
                        <p className="text-slate-300 leading-relaxed text-sm">
                          {getInterpretation(result.risk_level, result.final_pcos_probability)}
                        </p>
                      </div>
                    </div>

                    {/* Risk Factors Grid */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Shield size={20} className="text-teal-400" />
                        Key Metrics
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-teal-900/40 to-teal-800/40 rounded-xl p-4 border border-teal-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-teal-300 uppercase font-bold">Final Risk</span>
                            <Activity size={16} className="text-teal-400" />
                          </div>
                          <div className="text-2xl font-bold text-white">{(result.final_pcos_probability * 100).toFixed(1)}%</div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-xl p-4 border border-purple-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-purple-300 uppercase font-bold">Risk Level</span>
                            <TrendingUp size={16} className="text-purple-400" />
                          </div>
                          <div className="text-2xl font-bold text-white">{result.risk_level}</div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-xl p-4 border border-blue-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-blue-300 uppercase font-bold">Clinical Score</span>
                            <Heart size={16} className="text-blue-400" />
                          </div>
                          <div className="text-2xl font-bold text-white">{(result.tabular_risk * 100).toFixed(1)}%</div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-pink-900/40 to-pink-800/40 rounded-xl p-4 border border-pink-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-pink-300 uppercase font-bold">Ultrasound</span>
                            <Zap size={16} className="text-pink-400" />
                          </div>
                          <div className="text-2xl font-bold text-white">{(result.ultrasound_risk * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps Compact */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <AlertCircle size={20} className="text-teal-400" />
                        Immediate Next Steps
                      </h3>
                      <div className="space-y-2">
                        {[
                          'Consult with a healthcare professional within 2-4 weeks',
                          'Share this report with your doctor',
                          'Track your symptoms and menstrual cycle',
                          'Begin implementing lifestyle recommendations'
                        ].map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </div>
                            <p className="text-sm text-slate-300 flex-1">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ANALYSIS TAB */}
                {activeTab === 'analysis' && (
                  <div className="p-6 space-y-6">
                    {/* Component Analysis */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Activity size={20} className="text-teal-400" />
                        Multimodal Analysis Breakdown
                      </h3>
                      <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700 mb-4">
                        <p className="text-sm text-slate-300 mb-4">
                          The final prediction combines multiple AI models analyzing different aspects of your health data:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-800/50 border-2 border-teal-600/50 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-3">
                              <div className="p-2 bg-teal-600/20 rounded-lg">
                                <Heart size={20} className="text-teal-400" />
                              </div>
                              <span className="text-2xl font-bold text-teal-400">{(result.tabular_risk * 100).toFixed(1)}%</span>
                            </div>
                            <h4 className="font-bold text-white mb-2">Clinical & Lab Data</h4>
                            <p className="text-xs text-slate-400">Analysis of hormones, BMI, cycle history & symptoms.</p>
                          </div>
                          
                          <div className="bg-slate-800/50 border-2 border-purple-600/50 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-3">
                              <div className="p-2 bg-purple-600/20 rounded-lg">
                                <Zap size={20} className="text-purple-400" />
                              </div>
                              <span className="text-2xl font-bold text-purple-400">{(result.ultrasound_risk * 100).toFixed(1)}%</span>
                            </div>
                            <h4 className="font-bold text-white mb-2">Ultrasound Analysis</h4>
                            <p className="text-xs text-slate-400">Evaluation of ovarian morphology and follicle patterns.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grad-CAM Visualization */}
                    {result.gradcam_visualization && (
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <Brain size={20} className="text-purple-400" />
                          AI Explainability - Grad-CAM Heatmap
                        </h3>
                        
                        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-700/50 mb-4">
                          <p className="text-xs text-purple-200">
                            This visualization shows which regions of your ultrasound image the AI focused on when making its prediction. 
                            Warmer colors (red/yellow) indicate areas of high importance.
                          </p>
                        </div>

                        <div className="flex items-center justify-center gap-2 bg-slate-900/50 rounded-lg p-2 mb-4 border border-slate-700">
                          <button
                            onClick={() => setHeatmapView('overlay')}
                            className={`flex-1 py-2 px-4 rounded-lg transition-all text-sm font-medium ${
                              heatmapView === 'overlay'
                                ? 'bg-purple-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800'
                            }`}
                          >
                            Overlay
                          </button>
                          <button
                            onClick={() => setHeatmapView('only')}
                            className={`flex-1 py-2 px-4 rounded-lg transition-all text-sm font-medium ${
                              heatmapView === 'only'
                                ? 'bg-purple-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800'
                            }`}
                          >
                            Heatmap Only
                          </button>
                        </div>

                        <div className="relative rounded-xl overflow-hidden border-2 border-purple-700/50">
                          <img
                            src={heatmapView === 'overlay' 
                              ? result.gradcam_visualization.heatmap_overlay 
                              : result.gradcam_visualization.heatmap_only}
                            alt="Grad-CAM Heatmap"
                            className="w-full h-auto"
                          />
                        </div>

                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 mt-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">Predicted Class:</span>
                              <div className="font-bold text-white mt-1">{result.gradcam_visualization.predicted_class}</div>
                            </div>
                            <div>
                              <span className="text-slate-400">Model Confidence:</span>
                              <div className="font-bold text-white mt-1">{(result.gradcam_visualization.confidence * 100).toFixed(1)}%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* RECOMMENDATIONS TAB */}
                {activeTab === 'recommendations' && (
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Lightbulb size={20} className="text-teal-400" />
                      Personalized Health Recommendations
                    </h3>
                    
                    {recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden">
                        <div className={`${rec.color} p-4 flex items-center gap-3`}>
                          <div className="p-2 bg-white/20 rounded-lg">
                            {rec.icon}
                          </div>
                          <div className="flex-1 text-white">
                            <h4 className="font-bold text-lg">{rec.title}</h4>
                            <p className="text-sm text-white/80">{rec.description}</p>
                          </div>
                        </div>
                        <div className="p-5">
                          <ul className="space-y-2">
                            {rec.tips.map((tip, tipIdx) => (
                              <li key={tipIdx} className="flex items-start gap-2 text-sm text-slate-300">
                                <CheckCircle2 size={16} className="text-teal-400 mt-0.5 flex-shrink-0" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* HISTORY TAB */}
                {activeTab === 'history' && (
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Clock size={20} className="text-teal-400" />
                      Assessment History
                    </h3>
                    
                    {history.length > 0 ? (
                      <div className="space-y-3">
                        {history.map((item, idx) => (
                          <div key={idx} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 hover:border-teal-600/50 transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-teal-600/20 rounded-lg">
                                  <FileText size={16} className="text-teal-400" />
                                </div>
                                <div>
                                  <div className="font-medium text-white">{new Date(item.date).toLocaleDateString()}</div>
                                  <div className="text-xs text-slate-400">Assessment #{item.id}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-sm font-bold ${
                                  item.risk_level === 'HIGH' ? 'text-rose-400' :
                                  item.risk_level === 'MODERATE' ? 'text-amber-400' :
                                  'text-emerald-400'
                                }`}>
                                  {item.risk_level}
                                </div>
                                <div className="text-xs text-slate-400">{(item.probability * 100).toFixed(1)}%</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-400">
                        <Clock size={48} className="mx-auto mb-3 opacity-30" />
                        <p>No previous assessments found</p>
                      </div>
                    )}
                  </div>
                )}

                {/* LEARN TAB */}
                {activeTab === 'learn' && (
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <BookOpen size={20} className="text-teal-400" />
                      Educational Resources
                    </h3>
                    
                    {educationalContent.map((item, idx) => (
                      <div key={idx} className="bg-slate-900/50 rounded-xl p-5 border border-slate-700 hover:border-teal-600/50 transition-all group">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-teal-600/20 transition-all">
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white mb-2">{item.title}</h4>
                            <p className="text-sm text-slate-300 mb-3 leading-relaxed">{item.content}</p>
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-xs text-teal-400 hover:text-teal-300 transition-colors"
                            >
                              Learn More →
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Medical Disclaimer & Additional Info */}
          <div className="lg:col-span-3 space-y-4 overflow-y-auto">
            {/* Medical Disclaimer */}
            <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 backdrop-blur-xl rounded-xl border-2 border-amber-700/50 p-5">
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle className="text-amber-400 shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-amber-300 text-lg mb-2">Medical Disclaimer</h4>
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    This AI-generated report is a decision support tool and should not be considered a definitive medical diagnosis. 
                    Please consult a certified healthcare provider for official diagnosis and treatment planning.
                  </p>
                </div>
              </div>
            </div>

            {/* Assessment Info */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Info size={16} className="text-teal-400" />
                Assessment Details
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="text-white font-medium">
                    {new Date(result.assessment_date || new Date()).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ID:</span>
                  <span className="text-white font-medium">#{result.assessment_id || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-medium">Complete</span>
                </div>
              </div>
            </div>

            {/* Model Info */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Brain size={16} className="text-purple-400" />
                AI Model Info
              </h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400">Tabular Model:</span>
                  <span className="text-teal-400 font-medium">CatBoost</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400">Vision Model:</span>
                  <span className="text-purple-400 font-medium">ResNet50</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400">Explainability:</span>
                  <span className="text-pink-400 font-medium">Grad-CAM</span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-teal-900/40 to-blue-900/40 backdrop-blur-xl rounded-xl border border-teal-700/50 p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-teal-400" />
                Pro Tips
              </h3>
              
              <ul className="space-y-2 text-xs text-teal-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-teal-400 mt-0.5 flex-shrink-0" />
                  <span>Download this report for your medical records</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-teal-400 mt-0.5 flex-shrink-0" />
                  <span>Track changes over time with regular assessments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-teal-400 mt-0.5 flex-shrink-0" />
                  <span>Share results with your healthcare provider</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-slate-500 py-2 print:hidden">
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
        color: "text-rose-400",
        bg: "bg-rose-900/40",
        border: "border-rose-700",
        bar: "bg-gradient-to-r from-rose-500 to-rose-600",
        icon: <AlertTriangle size={32} className="text-rose-400" />,
      };
    case "MODERATE":
      return {
        color: "text-amber-400",
        bg: "bg-amber-900/40",
        border: "border-amber-700",
        bar: "bg-gradient-to-r from-amber-500 to-amber-600",
        icon: <Info size={32} className="text-amber-400" />,
      };
    default:
      return {
        color: "text-emerald-400",
        bg: "bg-emerald-900/40",
        border: "border-emerald-700",
        bar: "bg-gradient-to-r from-emerald-500 to-emerald-600",
        icon: <CheckCircle2 size={32} className="text-emerald-400" />,
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
