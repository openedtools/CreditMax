import React from 'react';
import { CreditCard, Subscription, Frequency, AiUsageItem } from '../types';
import { TrendingUp, Calendar, Clock, Coins, BrainCircuit, CheckCircle2, ExternalLink } from 'lucide-react';
import { CardVisual } from './CardVisual';

interface Props {
  cards: CreditCard[];
  subscriptions: Subscription[];
  aiItems: AiUsageItem[];
}

export const Dashboard: React.FC<Props> = ({ cards, subscriptions, aiItems }) => {
  
  // Value Calculations
  const totalBenefitsValue = cards.reduce((sum, c) => sum + c.benefits.reduce((bSum, b) => bSum + (b.isHidden ? 0 : b.value), 0), 0);
  const totalBenefitsUsed = cards.reduce((sum, c) => sum + c.benefits.reduce((bSum, b) => bSum + (b.isHidden ? 0 : b.usedAmount), 0), 0);
  const valueRemaining = totalBenefitsValue - totalBenefitsUsed;
  const captureRate = totalBenefitsValue > 0 ? Math.round((totalBenefitsUsed / totalBenefitsValue) * 100) : 0;

  // Total Points
  const totalPoints = cards.reduce((sum, c) => sum + (c.points || 0), 0);

  // Upcoming Renewals logic
  const currentDay = new Date().getDate();
  const upcomingRenewals = [...subscriptions]
    .sort((a, b) => {
        const diffA = a.renewalDay - currentDay;
        const diffB = b.renewalDay - currentDay;
        return (diffA >= 0 ? diffA : diffA + 30) - (diffB >= 0 ? diffB : diffB + 30);
    })
    .slice(0, 3);

  // AI Pulse Logic
  const alertAiItems = aiItems
      .map(item => ({ ...item, percentage: (item.usedAmount / item.quotaAmount) * 100 }))
      .filter(item => item.percentage >= 0)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);

  const getNextResetDate = (day: number, freq: string) => {
    const now = new Date();
    const currentDay = now.getDate();
    const resetDate = new Date(now);

    if (freq === 'Daily') {
        resetDate.setDate(currentDay + 1);
    } else {
        if (currentDay > day) {
            resetDate.setMonth(now.getMonth() + 1);
        }
        resetDate.setDate(day);
    }
    return resetDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Enhanced Expiring Benefits Logic
  const now = new Date();
  const currentYear = now.getFullYear();

  const expiringBenefits = cards.flatMap(card => {
     return card.benefits
        .filter(b => b.value > 0 && b.usedAmount < b.value && b.frequency !== Frequency.MONTHLY && !b.isHidden)
        .map(b => {
            let expiryDate = new Date();
            
            if (b.resetType === 'calendar' || !b.resetType) {
                // Calendar year based - ALWAYS ends Dec 31
                expiryDate = new Date(currentYear, 11, 31);
                
                if (b.frequency === Frequency.SEMI_ANNUAL) {
                     const currentMonth = now.getMonth();
                     if (currentMonth < 6) { // First half (expires Jun 30)
                        expiryDate = new Date(currentYear, 5, 30);
                     }
                } else if (b.frequency === Frequency.QUARTERLY) {
                     const currentMonth = now.getMonth();
                     const qEndMonth = Math.floor(currentMonth / 3) * 3 + 2;
                     expiryDate = new Date(currentYear, qEndMonth + 1, 0);
                }
            } else {
                // Anniversary based logic
                if (card.renewalDate) {
                    const [y, m, d] = card.renewalDate.split('-').map(Number);
                    const thisYearRenewal = new Date(currentYear, m - 1, d);
                    
                    if (thisYearRenewal > now) {
                        expiryDate = new Date(thisYearRenewal);
                        expiryDate.setDate(expiryDate.getDate() - 1);
                    } else {
                        expiryDate = new Date(currentYear + 1, m - 1, d);
                        expiryDate.setDate(expiryDate.getDate() - 1);
                    }
                } else {
                     expiryDate = new Date(currentYear, 11, 31);
                }
            }
            
            // Calculate days remaining
            const diffTime = expiryDate.getTime() - now.getTime();
            const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return {
                ...b,
                cardName: card.nickname || card.name,
                card: card,
                expiryDate,
                daysRemaining
            };
        })
        .filter(b => b !== null && b.daysRemaining <= 60 && b.daysRemaining >= 0); 
  }).sort((a, b) => (a?.daysRemaining || 0) - (b?.daysRemaining || 0)).slice(0, 6);

  const getUrgencyColor = (days: number) => {
      if (days <= 15) return 'text-rose-500 bg-rose-950/30 border-rose-900/50';
      if (days <= 30) return 'text-amber-500 bg-amber-950/30 border-amber-900/50';
      return 'text-emerald-500 bg-emerald-950/30 border-emerald-900/50';
  };

  return (
    <div className="space-y-8">
      
      {/* HERO: Value Capture */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
              <div>
                  <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">Value Captured {currentYear}</h2>
                  <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-bold text-white font-mono tracking-tight">${totalBenefitsUsed.toLocaleString()}</span>
                      <span className="text-xl text-slate-400 font-medium">of ${totalBenefitsValue.toLocaleString()}</span>
                  </div>
                  <p className="text-emerald-400 text-sm mt-2 font-medium flex items-center gap-2">
                     <TrendingUp size={16} /> You are squeezing {captureRate}% of available value.
                  </p>
              </div>
              <div className="w-full md:w-1/2">
                  <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
                      <span>$0</span>
                      <span>${valueRemaining.toLocaleString()} Left to Claim</span>
                      <span>${totalBenefitsValue.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden shadow-inner border border-slate-800">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000 relative" 
                        style={{width: `${captureRate}%`}}
                      >
                          <div className="absolute right-0 top-0 h-full w-1 bg-white/50"></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN (2/3): Use It or Lose It */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
                <div className="p-6 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Clock className="text-amber-400" />
                        Use It or Lose It
                    </h3>
                    <span className="text-xs font-medium bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
                        Next 60 Days
                    </span>
                </div>

                {expiringBenefits.length > 0 ? (
                    <div className="divide-y divide-slate-800">
                        {expiringBenefits.map((b: any, idx) => {
                            const urgencyClass = getUrgencyColor(b.daysRemaining);
                            const dateStr = b.expiryDate.toLocaleDateString(undefined, {month:'short', day:'numeric'});

                            return (
                                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-800/30 transition-colors group gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="hidden sm:block mt-1">
                                            {b.card.loginUrl ? (
                                                 <a href={b.card.loginUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity block" title={`Login to ${b.card.issuer}`}>
                                                    <CardVisual card={b.card} small />
                                                 </a>
                                            ) : (
                                                <CardVisual card={b.card} small />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-200 text-sm group-hover:text-white transition-colors">{b.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-700 px-1.5 rounded bg-slate-950">
                                                    {b.frequency}
                                                </span>
                                                <span className="text-xs text-slate-400">{b.cardName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between sm:justify-end gap-6 min-w-[200px]">
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 uppercase tracking-wider">Value at Risk</p>
                                            <p className="text-lg font-mono font-bold text-white">${b.value - b.usedAmount}</p>
                                        </div>
                                        <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex flex-col items-center min-w-[70px] ${urgencyClass}`}>
                                            <span className="text-lg leading-none">{b.daysRemaining}</span>
                                            <span className="text-[8px] uppercase">Days Left</span>
                                            <span className="text-[8px] opacity-75 mt-0.5">({dateStr})</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
                        <CheckCircle2 size={48} className="text-emerald-900 mb-4" />
                        <p className="text-lg font-medium text-slate-400">All caught up!</p>
                        <p className="text-sm">No major expiring benefits in the next 60 days.</p>
                    </div>
                )}
                {expiringBenefits.length > 0 && (
                    <div className="bg-slate-950/50 p-3 text-center border-t border-slate-800">
                        <p className="text-xs text-slate-500">Don't forget to manually mark these as used in the Wallet tab once redeemed.</p>
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT COLUMN (1/3): Ecosystem Widgets */}
        <div className="space-y-6">
            
            {/* AI Pulse Widget */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <BrainCircuit size={16} className="text-fuchsia-500" /> AI Pulse
                </h3>
                {alertAiItems.length > 0 ? (
                    <div className="space-y-3">
                        {alertAiItems.map(item => {
                            const percentage = item.percentage;
                            const nextReset = getNextResetDate(item.renewalDay, item.frequency);
                            
                            return (
                            <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4 relative group hover:border-slate-700 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        {item.loginUrl ? (
                                            <a href={item.loginUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-200 hover:text-fuchsia-400 flex items-center gap-1.5 transition-colors">
                                                {item.serviceName} <ExternalLink size={12} className="opacity-50" />
                                            </a>
                                        ) : (
                                            <p className="text-sm font-bold text-slate-200">{item.serviceName}</p>
                                        )}
                                        <div className="flex items-center gap-2 mt-1">
                                             <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 uppercase tracking-wider">{item.quotaName}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-medium text-slate-500 block mb-0.5">Resets {nextReset}</span>
                                        <span className={`text-lg font-mono font-bold leading-none ${percentage >= 90 ? 'text-rose-500' : percentage >= 75 ? 'text-amber-500' : 'text-emerald-400'}`}>
                                            {item.usedAmount}<span className="text-xs text-slate-600 font-sans"> / {item.quotaAmount}</span>
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${percentage >= 90 ? 'bg-rose-500' : percentage >= 75 ? 'bg-amber-500' : 'bg-fuchsia-500'}`} 
                                        style={{width: `${Math.min(percentage, 100)}%`}}
                                    ></div>
                                </div>
                            </div>
                        )})}
                    </div>
                ) : (
                    <div className="flex items-center gap-3 text-slate-500 text-sm p-2">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span>No active usage to track.</span>
                    </div>
                )}
                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                     <span className="text-xs text-slate-500">{aiItems.length} Services Active</span>
                </div>
            </div>

            {/* Points Stash */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <Coins size={16} className="text-amber-400" /> Points Stash
                </h3>
                <div className="flex items-center justify-between">
                     <div>
                        <p className="text-3xl font-mono font-bold text-white">{totalPoints.toLocaleString()}</p>
                        <p className="text-xs text-slate-500 mt-1">Total Points Across Wallet</p>
                     </div>
                     <div className="bg-amber-950/20 p-3 rounded-full">
                         <Coins size={24} className="text-amber-500/50" />
                     </div>
                </div>
            </div>

            {/* Renewal Radar */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg">
                 <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <Calendar size={16} className="text-indigo-400" /> Renewal Radar
                </h3>
                <div className="space-y-3">
                    {upcomingRenewals.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between text-sm">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 text-center bg-slate-950 rounded border border-slate-800 py-0.5">
                                     <span className="text-[8px] block text-slate-500 uppercase">Day</span>
                                     <span className="font-bold text-white leading-none">{sub.renewalDay}</span>
                                 </div>
                                 <span className="text-slate-300 truncate max-w-[100px]">{sub.name}</span>
                             </div>
                             <span className="font-mono text-slate-400">${sub.cost}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
