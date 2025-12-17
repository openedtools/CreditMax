
import React, { useState } from 'react';
import { Benefit, CreditCard, Frequency } from '../types';
import { CheckCircle2, Circle, ArrowUpDown, Search, Calendar, Filter } from 'lucide-react';
import { CardVisual } from './CardVisual';

interface Props {
  cards: CreditCard[];
  onUpdateBenefit: (cardId: string, benefitId: string, usedAmount: number) => void;
}

export const BenefitsList: React.FC<Props> = ({ cards, onUpdateBenefit }) => {
  const [filterText, setFilterText] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string>('all');
  const [sortField, setSortField] = useState<'value' | 'date' | 'title'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Flatten monetary benefits from all cards
  const allBenefits = cards.flatMap(card => 
    card.benefits
      .filter(b => b.value > 0 && !b.isHidden) // Only show visible monetary benefits
      .map(benefit => ({
        ...benefit,
        cardId: card.id,
        cardName: card.nickname || card.name,
        card: card,
        nextReset: calculateNextReset(benefit.frequency, card.renewalDate)
      }))
  );

  // Filter
  const filteredBenefits = allBenefits.filter(b => {
    const textMatch = b.title.toLowerCase().includes(filterText.toLowerCase()) || 
                      b.category?.toLowerCase().includes(filterText.toLowerCase());
    const cardMatch = selectedCardId === 'all' || b.cardId === selectedCardId;
    return textMatch && cardMatch;
  });

  // Sort
  const sortedBenefits = [...filteredBenefits].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'value') {
        comparison = a.value - b.value;
    } else if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
    } else if (sortField === 'date') {
        // Rough date comparison
        comparison = a.nextReset.getTime() - b.nextReset.getTime();
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: 'value' | 'date' | 'title') => {
      if (sortField === field) {
          setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
          setSortField(field);
          setSortDirection('asc');
      }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Monetary Benefits</h2>
            <p className="text-slate-400 text-sm mt-1">Track and redeem {sortedBenefits.length} credits across your wallet.</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
              {/* Card Filter */}
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <select 
                    value={selectedCardId}
                    onChange={(e) => setSelectedCardId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-8 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none"
                >
                    <option value="all">All Cards</option>
                    {cards.map(card => (
                        <option key={card.id} value={card.id}>{card.nickname || card.name}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                     <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>

              {/* Search */}
              <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                      type="text" 
                      placeholder="Search..." 
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
              </div>
          </div>
       </div>

       <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                      <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase text-slate-400 tracking-wider">
                          <th className="p-4 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('title')}>
                              <div className="flex items-center gap-1">Benefit <ArrowUpDown size={12} /></div>
                          </th>
                          <th className="p-4 font-medium text-center">Status</th>
                          <th className="p-4 font-medium">Card</th>
                          <th className="p-4 font-medium text-right cursor-pointer hover:text-white" onClick={() => handleSort('value')}>
                              <div className="flex items-center justify-end gap-1">Value <ArrowUpDown size={12} /></div>
                          </th>
                          <th className="p-4 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('date')}>
                              <div className="flex items-center gap-1">Next Reset <ArrowUpDown size={12} /></div>
                          </th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                      {sortedBenefits.map((benefit, idx) => {
                          const isMaxed = benefit.usedAmount >= benefit.value;
                          const resetString = benefit.nextReset.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: benefit.frequency === Frequency.ANNUAL ? 'numeric' : undefined });
                          
                          return (
                              <tr key={`${benefit.cardId}-${benefit.id}-${idx}`} className="hover:bg-slate-800/40 transition-colors group">
                                  <td className="p-4">
                                      <div>
                                          <span className={`font-medium block ${isMaxed ? 'text-slate-500 line-through decoration-slate-600' : 'text-slate-200'}`}>
                                              {benefit.title}
                                          </span>
                                          <span className="text-xs text-slate-500 line-clamp-1 max-w-xs mt-0.5" title={benefit.description}>
                                              {benefit.description}
                                          </span>
                                      </div>
                                  </td>
                                  <td className="p-4 text-center">
                                      <button 
                                            onClick={() => onUpdateBenefit(benefit.cardId, benefit.id, isMaxed ? 0 : benefit.value)}
                                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                                isMaxed 
                                                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/50' 
                                                : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                                            }`}
                                        >
                                            {isMaxed ? (
                                                <>Redeemed <CheckCircle2 size={14} /></>
                                            ) : (
                                                <>Available <Circle size={14} /></>
                                            )}
                                        </button>
                                  </td>
                                  <td className="p-4">
                                      <div className="flex items-center gap-3">
                                          <CardVisual card={benefit.card} small />
                                          <div>
                                              <div className="text-xs text-slate-300 font-medium">{benefit.cardName}</div>
                                              <div className="text-[10px] text-slate-500 uppercase">{benefit.card.issuer}</div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="p-4 text-right">
                                      <span className={`font-mono ${isMaxed ? 'text-slate-500 line-through' : 'text-emerald-400'}`}>${benefit.value}</span>
                                  </td>
                                  <td className="p-4">
                                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                                          {isMaxed ? (
                                              <span className="text-slate-600">Resets {resetString}</span>
                                          ) : (
                                              <>
                                                <Calendar size={14} className="text-indigo-400" />
                                                <span className="text-slate-300">{resetString}</span>
                                              </>
                                          )}
                                      </div>
                                  </td>
                              </tr>
                          );
                      })}
                      {sortedBenefits.length === 0 && (
                          <tr>
                              <td colSpan={5} className="p-8 text-center text-slate-500">
                                  No benefits found matching your search.
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
       </div>
    </div>
  );
};

// Helper to estimate next reset date
function calculateNextReset(freq: Frequency, renewalDateStr?: string): Date {
    const now = new Date();
    const next = new Date(now);

    // If renewal date is set, parse it for annual logic
    let renewalDate: Date | null = null;
    if (renewalDateStr) {
        const [y, m, d] = renewalDateStr.split('-').map(Number);
        renewalDate = new Date(y, m - 1, d);
    }

    switch (freq) {
        case Frequency.MONTHLY:
            next.setMonth(now.getMonth() + 1);
            next.setDate(1);
            break;
        case Frequency.QUARTERLY:
            const currentMonth = now.getMonth();
            const nextQuarterMonth = currentMonth + (3 - (currentMonth % 3));
            next.setMonth(nextQuarterMonth);
            next.setDate(1);
            break;
        case Frequency.SEMI_ANNUAL:
            // Simplified: Jan 1 or Jul 1
            const m = now.getMonth();
            if (m < 6) {
                next.setMonth(6); // July
                next.setDate(1);
            } else {
                next.setFullYear(now.getFullYear() + 1);
                next.setMonth(0); // Jan
                next.setDate(1);
            }
            break;
        case Frequency.ANNUAL:
            if (renewalDate) {
                // Logic: find next occurrence of renewal month/day
                next.setMonth(renewalDate.getMonth());
                next.setDate(renewalDate.getDate());
                if (next < now) {
                    next.setFullYear(now.getFullYear() + 1);
                } else {
                    next.setFullYear(now.getFullYear());
                }
            } else {
                next.setFullYear(now.getFullYear() + 1);
                next.setMonth(0); // Jan 1
                next.setDate(1);
            }
            break;
        case Frequency.ONE_TIME:
            next.setFullYear(now.getFullYear() + 10); // Far future
            break;
    }
    return next;
}
