
import React, { useState } from 'react';
import { CreditCard } from '../types';
import { Shield, Crown, Plane, Sparkles, Filter, Search } from 'lucide-react';
import { CardVisual } from './CardVisual';

interface Props {
  cards: CreditCard[];
}

const CATEGORIES = ['All', 'Insurance', 'Status', 'Travel', 'Other'];

export const PerksList: React.FC<Props> = ({ cards }) => {
  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Flatten non-monetary benefits (value = 0)
  const allPerks = cards.flatMap(card => 
    card.benefits
      .filter(b => b.value === 0) 
      .map(benefit => ({
        ...benefit,
        cardId: card.id,
        cardName: card.nickname || card.name,
        card: card,
        // Determine grouping category
        categoryGroup: determineCategory(benefit.title, benefit.category)
      }))
  );

  const filteredPerks = allPerks.filter(p => {
      const textMatch = p.title.toLowerCase().includes(filterText.toLowerCase()) || 
                        p.description.toLowerCase().includes(filterText.toLowerCase());
      const catMatch = selectedCategory === 'All' || p.categoryGroup === selectedCategory;
      return textMatch && catMatch;
  });

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white">Perks & Status</h2>
                <p className="text-slate-400 text-sm mt-1">Insurance, elite status, and access privileges.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                <div className="relative min-w-[160px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-8 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none"
                    >
                        {CATEGORIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                         <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                </div>
                <div className="relative flex-1 md:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search perks..." 
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPerks.map((perk, idx) => (
                <div key={`${perk.cardId}-${idx}`} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/30 transition-all group shadow-md">
                    <div className="flex items-start gap-4">
                        <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getIconStyle(perk.categoryGroup)}`}>
                            {getIcon(perk.categoryGroup)}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-slate-200 text-sm">{perk.title}</h3>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider border border-slate-800 px-1.5 py-0.5 rounded bg-slate-950">
                                    {perk.categoryGroup}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{perk.description}</p>
                            
                            <div className="mt-3 pt-3 border-t border-slate-800/50 flex items-center gap-2">
                                <CardVisual card={perk.card} small />
                                <span className="text-xs text-slate-500">{perk.cardName}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {filteredPerks.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                    <p className="text-slate-500">No perks found matching your filters.</p>
                </div>
            )}
        </div>
    </div>
  );
};

function determineCategory(title: string, originalCat?: string): string {
    const t = title.toLowerCase();
    
    // PRIORITY 1: If the manually set category matches one of our main buckets, use it directly.
    if (originalCat === 'Insurance') return 'Insurance';
    if (originalCat === 'Status') return 'Status';
    if (originalCat === 'Travel') return 'Travel';
    if (originalCat === 'Other') return 'Other';

    // PRIORITY 2: Heuristics for Insurance
    if (t.includes('insurance') || t.includes('protection') || t.includes('warranty') || t.includes('assurance') || t.includes('liability') || t.includes('damage')) {
        return 'Insurance';
    }

    // PRIORITY 3: Heuristics for Status
    if (t.includes('status') || t.includes('elite') || t.includes('membership') || t.includes('president') || t.includes('platinum') || t.includes('diamond') || t.includes('gold')) {
        return 'Status';
    }

    // PRIORITY 4: Heuristics for Travel
    if (t.includes('lounge') || t.includes('club') || t.includes('entry') || t.includes('tsa') || t.includes('clear') || t.includes('global') || t.includes('bag') || t.includes('boarding') || t.includes('concierge')) {
        return 'Travel';
    }
    
    return 'Other';
}

function getIcon(category: string) {
    switch (category) {
        case 'Insurance': return <Shield size={20} />;
        case 'Status': return <Crown size={20} />;
        case 'Travel': return <Plane size={20} />;
        default: return <Sparkles size={20} />;
    }
}

function getIconStyle(category: string) {
    switch (category) {
        case 'Insurance': return 'bg-emerald-900/30 text-emerald-400';
        case 'Status': return 'bg-amber-900/30 text-amber-400';
        case 'Travel': return 'bg-indigo-900/30 text-indigo-400';
        default: return 'bg-slate-800 text-slate-400';
    }
}
