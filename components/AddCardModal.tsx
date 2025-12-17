import React, { useState } from 'react';
import { X, Search, Loader2, Check, AlertCircle, Palette } from 'lucide-react';
import { fetchCardBenefits } from '../services/gemini';
import { CreditCard, Benefit, Frequency } from '../types';
import { CardVisual } from './CardVisual';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: CreditCard) => void;
}

export const AddCardModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundCard, setFoundCard] = useState<Partial<CreditCard> | null>(null);
  
  // Customization State
  const [nickname, setNickname] = useState('');
  const [last4, setLast4] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setFoundCard(null);
    setNickname('');
    setLast4('');

    try {
      const data = await fetchCardBenefits(query);
      
      const newBenefits: Benefit[] = data.benefits.map((b: any, idx: number) => ({
        id: `new-b-${idx}-${Date.now()}`,
        title: b.title,
        description: b.description,
        value: b.value || 0,
        frequency: b.frequency as Frequency,
        usedAmount: 0,
        isCredit: b.isCredit,
        category: b.category
      }));

      const newCard: Partial<CreditCard> = {
        id: `c-${Date.now()}`,
        name: query,
        issuer: data.issuer,
        network: data.network,
        annualFee: data.annualFee,
        benefits: newBenefits,
        colorFrom: 'from-slate-700',
        colorTo: 'to-slate-900' 
      };

      setFoundCard(newCard);
      setNickname(query); // Default nickname to query
    } catch (err) {
      setError('Failed to fetch card details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (foundCard && foundCard.id) {
      onAdd({
        ...foundCard as CreditCard,
        name: foundCard.name || query, // Ensure name is set
        nickname: nickname || foundCard.name || query,
        last4: last4 || undefined
      });
      onClose();
      setQuery('');
      setFoundCard(null);
      setNickname('');
      setLast4('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
          <h2 className="text-xl font-semibold text-white">Add New Card</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          
          {/* Search Input */}
          <div className={`transition-all duration-300 ${foundCard ? 'opacity-50 pointer-events-none' : ''}`}>
            <label className="text-sm text-slate-400 font-medium mb-2 block">Which card do you have?</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Amex Gold, Chase Sapphire Preferred..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                disabled={loading || !query}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-6 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-900/20"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                <span className="hidden sm:inline">Find Benefits</span>
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm mt-2 bg-red-950/30 p-3 rounded-lg border border-red-900/50">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>

          {/* Results Preview */}
          {foundCard && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 border-t border-slate-800 pt-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                  {/* Left: Visual & Customization */}
                  <div className="space-y-4">
                      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Preview & Customize</h3>
                      
                      <CardVisual card={{...foundCard as CreditCard, nickname, last4}} />

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                         <div>
                            <label className="text-xs text-slate-500 block mb-1">Nickname (Optional)</label>
                            <input 
                                type="text" 
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="e.g. Wife's Card"
                                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                            />
                         </div>
                         <div>
                            <label className="text-xs text-slate-500 block mb-1">Last 4 Digits (Optional)</label>
                            <input 
                                type="text" 
                                maxLength={4}
                                value={last4}
                                onChange={(e) => setLast4(e.target.value.replace(/\D/g,''))}
                                placeholder="e.g. 1234"
                                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                            />
                         </div>
                      </div>
                  </div>

                  {/* Right: Benefits Found */}
                  <div className="flex flex-col h-full">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <Check className="text-emerald-500" size={20} />
                      {foundCard.benefits?.length} Benefits Found
                    </h3>
                    
                    <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
                        <div className="overflow-y-auto p-2 custom-scrollbar flex-1 max-h-[300px]">
                             {foundCard.benefits?.map((benefit, idx) => (
                                <div key={idx} className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/50 mb-2 last:mb-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-indigo-300 text-sm">{benefit.title}</h4>
                                    {benefit.value > 0 && <span className="text-emerald-400 text-xs font-mono whitespace-nowrap">+${benefit.value}</span>}
                                </div>
                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3 justify-end">
                        <button 
                            onClick={() => setFoundCard(null)}
                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                        onClick={handleConfirm}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20"
                        >
                        Save Card
                        </button>
                    </div>
                  </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};