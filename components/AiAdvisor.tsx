
import React, { useState } from 'react';
import { CreditCard, Subscription, AiUsageItem } from '../types';
import { analyzeWalletOptimization } from '../services/gemini';
import { Sparkles, AlertTriangle, CheckCircle2, TrendingUp, Loader2, ArrowRight, Zap, BarChart3 } from 'lucide-react';

interface Props {
  cards: CreditCard[];
  subscriptions: Subscription[];
  aiItems: AiUsageItem[];
}

interface AnalysisResult {
  score: number;
  summary: string;
  actionItems: {
    title: string;
    description: string;
    impact: 'High' | 'Medium' | 'Low';
    type: 'Credit' | 'Subscription' | 'Optimization';
  }[];
  strengths: string[];
}

export const AiAdvisor: React.FC<Props> = ({ cards, subscriptions, aiItems }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await analyzeWalletOptimization(cards, subscriptions, aiItems);
      setResult(data);
    } catch (err) {
      setError('Failed to generate analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-rose-400 border-rose-900/50 bg-rose-950/20';
      case 'Medium': return 'text-amber-400 border-amber-900/50 bg-amber-950/20';
      case 'Low': return 'text-indigo-400 border-indigo-900/50 bg-indigo-950/20';
      default: return 'text-slate-400 border-slate-800 bg-slate-900';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles className="text-indigo-400" /> AI Advisor
          </h2>
          <p className="text-slate-400 mt-2 max-w-xl">
            Let Gemini analyze your entire wallet ecosystem to find missed credits, unoptimized subscriptions, and hidden value.
          </p>
        </div>
        {!loading && (
            <button 
                onClick={handleAnalyze}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-900/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
                {result ? <><Zap size={20} /> Re-Analyze Wallet</> : <><Sparkles size={20} /> Generate Analysis</>}
            </button>
        )}
      </div>

      {error && (
        <div className="bg-rose-950/30 border border-rose-900/50 p-4 rounded-xl flex items-center gap-3 text-rose-400">
            <AlertTriangle size={20} />
            {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-slate-900/50 border border-slate-800 rounded-3xl border-dashed">
            <Loader2 size={48} className="text-indigo-500 animate-spin mb-6" />
            <h3 className="text-xl font-semibold text-white">Analyzing your ecosystem...</h3>
            <p className="text-slate-500 mt-2">Checking {cards.length} cards, {subscriptions.length} subscriptions, and {aiItems.length} AI tools.</p>
        </div>
      ) : result ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Score & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
                    <h3 className="text-slate-400 uppercase tracking-wider text-xs font-bold mb-4 relative z-10">Optimization Score</h3>
                    <div className="relative z-10">
                        <svg className="w-40 h-40 transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                                className={`${result.score > 80 ? 'text-emerald-500' : result.score > 60 ? 'text-amber-500' : 'text-rose-500'} transition-all duration-1000 ease-out`}
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * result.score) / 100}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-4xl font-bold text-white">{result.score}</span>
                            <span className="text-xs text-slate-500">/ 100</span>
                        </div>
                    </div>
                </div>
                
                <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
                    <h3 className="text-indigo-400 font-semibold text-lg mb-3 flex items-center gap-2">
                        <BarChart3 size={20} /> Executive Summary
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-lg relative z-10">
                        {result.summary}
                    </p>
                </div>
            </div>

            {/* Action Items */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-amber-400" /> Opportunities & Action Items
                </h3>
                <div className="grid gap-4">
                    {result.actionItems.map((item, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between hover:border-indigo-500/30 transition-colors group">
                            <div className="flex items-start gap-4">
                                <div className={`px-3 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider mt-1 ${getImpactColor(item.impact)}`}>
                                    {item.impact} Priority
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-200 text-lg group-hover:text-indigo-300 transition-colors">{item.title}</h4>
                                    <p className="text-slate-400 mt-1">{item.description}</p>
                                </div>
                            </div>
                            <button className="text-indigo-400 hover:text-white flex items-center gap-2 text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Take Action <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Strengths */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-400" /> What You're Doing Well
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.strengths.map((strength, idx) => (
                        <div key={idx} className="bg-emerald-950/10 border border-emerald-900/30 p-4 rounded-xl flex items-center gap-3">
                            <div className="bg-emerald-900/30 p-2 rounded-full text-emerald-400 shrink-0">
                                <CheckCircle2 size={18} />
                            </div>
                            <span className="text-slate-300 font-medium">{strength}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
             <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                 <Sparkles size={40} className="text-indigo-400" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Ready to optimize?</h3>
             <p className="text-slate-400 max-w-md mx-auto mb-8">
                 Click the button above to let our AI analyze your unique setup and find ways to maximize your returns.
             </p>
             <button 
                onClick={handleAnalyze}
                className="text-indigo-400 hover:text-white font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
             >
                How does it work? <ArrowRight size={16} />
             </button>
        </div>
      )}
    </div>
  );
};
