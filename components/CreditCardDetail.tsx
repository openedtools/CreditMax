
import React from 'react';
import { CreditCard, Benefit } from '../types';
import { CardVisual } from './CardVisual';
import { CheckSquare, Square, Settings, Shield, RefreshCw, Sparkles, Plus, ExternalLink, Coins, Check } from 'lucide-react';

interface Props {
  card: CreditCard;
  onUpdateBenefit: (cardId: string, benefitId: string, usedAmount: number) => void;
  onEdit: (card: CreditCard) => void;
  onRefresh?: (card: CreditCard) => void;
  isRefreshing?: boolean;
}

export const CreditCardDetail: React.FC<Props> = ({ card, onUpdateBenefit, onEdit, onRefresh, isRefreshing }) => {
  
  // Calculate simple stats - exclude hidden benefits
  const monetaryBenefits = card.benefits.filter(b => b.value > 0 && !b.isHidden);
  const protectionBenefits = card.benefits.filter(b => b.value === 0 && !b.isHidden);

  const totalUsed = monetaryBenefits.reduce((sum, b) => sum + b.usedAmount, 0);
  const netValue = totalUsed - card.annualFee;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6 shadow-lg shadow-black/20">
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Card Visual & Key Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative group cursor-pointer" onClick={() => onEdit(card)}>
             <CardVisual card={card} />
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="bg-black/50 text-white p-2 rounded-full backdrop-blur-md hover:bg-black/70">
                     <Settings size={16} />
                 </button>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Realized Value</p>
              <p className={`text-2xl font-mono font-bold ${netValue >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {netValue >= 0 ? '+' : ''}${netValue}
              </p>
              <p className="text-[10px] text-slate-600 mt-1">After ${card.annualFee} fee</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
               <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Points Balance</p>
               <p className="text-xl font-mono font-bold text-amber-400 truncate">
                   {card.points ? card.points.toLocaleString() : '0'}
               </p>
               <p className="text-[10px] text-slate-500 mt-1 truncate">{card.pointsName || 'Rewards'}</p>
               <Coins className="absolute right-2 bottom-2 text-amber-900/20" size={40} />
            </div>
          </div>

          <div className="flex gap-2">
             {card.loginUrl ? (
                 <a 
                    href={card.loginUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 py-2 rounded-lg transition-colors text-sm font-medium"
                 >
                    <ExternalLink size={16} /> Log In
                 </a>
             ) : (
                <button 
                    onClick={() => onEdit(card)}
                    className="flex-1 flex items-center justify-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800 py-2 rounded-lg transition-colors text-sm border border-slate-800 hover:border-slate-700"
                >
                    <Settings size={16} /> Manage
                </button>
             )}
            
            {onRefresh && (
                <button 
                    onClick={() => onRefresh(card)}
                    disabled={isRefreshing}
                    className="flex-1 flex items-center justify-center gap-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/20 py-2 rounded-lg transition-colors text-sm border border-indigo-900/30 hover:border-indigo-500/50 disabled:opacity-50"
                >
                    <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                    {isRefreshing ? 'Scanning...' : 'AI Scan'}
                </button>
            )}
          </div>
          
          {card.autoPay && (
             <div className="flex items-center justify-center gap-2 text-emerald-500 text-xs font-medium bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/30">
                 <Check size={12} strokeWidth={3} /> Autopay Enabled
             </div>
          )}
          
        </div>

        {/* Right Column: Benefits List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Monetary Credits */}
          <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    Credits & Value
                    <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full">{monetaryBenefits.length}</span>
                </h3>
                {isRefreshing && <span className="text-xs text-indigo-400 flex items-center gap-1 animate-pulse"><Sparkles size={12} /> Finding hidden perks...</span>}
              </div>
              <div className="space-y-3">
                {monetaryBenefits.map(benefit => (
                  <BenefitItem 
                    key={benefit.id} 
                    benefit={benefit} 
                    onUpdate={(amount) => onUpdateBenefit(card.id, benefit.id, amount)}
                  />
                ))}
                {monetaryBenefits.length === 0 && (
                    <p className="text-slate-500 text-sm italic">No visible credits found. Click Manage to add or unhide benefits.</p>
                )}
                <button 
                    onClick={() => onEdit(card)}
                    className="w-full py-3 mt-2 border border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl text-slate-500 hover:text-indigo-400 hover:bg-slate-800/30 transition-all flex items-center justify-center gap-2 text-sm"
                >
                    <Plus size={14} /> Manage List
                </button>
              </div>
          </div>

          {/* Protections & Perks */}
          {protectionBenefits.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    Protections & Perks
                    <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full">{protectionBenefits.length}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {protectionBenefits.map(benefit => (
                        <div key={benefit.id} className="bg-slate-950/50 border border-slate-800/50 p-3 rounded-lg flex items-start gap-3">
                            <div className="mt-0.5 text-indigo-400"><Shield size={16} /></div>
                            <div>
                                <h4 className="text-slate-300 text-sm font-medium">{benefit.title}</h4>
                                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
          )}
        </div>

      </div>
    </div>
  );
};

const BenefitItem: React.FC<{ benefit: Benefit; onUpdate: (val: number) => void }> = ({ benefit, onUpdate }) => {
  const isMaxed = benefit.usedAmount >= benefit.value;

  return (
    <div className={`bg-slate-900 border rounded-xl p-4 transition-all flex items-center justify-between gap-4 group ${isMaxed ? 'border-slate-800/50' : 'border-slate-800 hover:border-indigo-500/30'}`}>
      <div className="flex items-start gap-4">
         <button 
            onClick={() => onUpdate(isMaxed ? 0 : benefit.value)}
            className={`mt-0.5 shrink-0 transition-all ${isMaxed ? 'text-emerald-500' : 'text-slate-600 hover:text-emerald-500'}`}
         >
             {isMaxed ? <CheckSquare size={20} /> : <Square size={20} />}
         </button>
         <div>
            <h4 className={`font-medium text-sm ${isMaxed ? 'text-slate-500 line-through decoration-slate-600' : 'text-white'}`}>{benefit.title}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{benefit.description}</p>
            <div className="flex gap-2 mt-1.5">
                <span className="text-[10px] uppercase tracking-wider bg-slate-950 text-slate-500 px-1.5 py-0.5 rounded border border-slate-800">{benefit.frequency}</span>
                {benefit.category && <span className="text-[10px] uppercase tracking-wider bg-slate-950 text-slate-500 px-1.5 py-0.5 rounded border border-slate-800">{benefit.category}</span>}
            </div>
         </div>
      </div>
      
      <div className="text-right shrink-0">
          {isMaxed ? (
             <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-950/30 text-emerald-500 border border-emerald-900/50">
                Redeemed
             </span>
          ) : (
             <div className="flex flex-col items-end">
                <span className="font-mono font-medium text-emerald-400 text-lg">${benefit.value}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Value</span>
             </div>
          )}
      </div>
    </div>
  );
}
