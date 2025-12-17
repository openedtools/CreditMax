
import React from 'react';
import { CreditCard } from '../types';
import { Coins, CreditCard as CardIcon, PieChart } from 'lucide-react';
import { CardVisual } from './CardVisual';

interface Props {
  cards: CreditCard[];
}

export const PointsTracker: React.FC<Props> = ({ cards }) => {
  
  // Group points by program
  const pointsByProgram: Record<string, { total: number, cards: CreditCard[] }> = {};

  cards.forEach(card => {
      if (card.pointsName && card.points !== undefined) {
          if (!pointsByProgram[card.pointsName]) {
              pointsByProgram[card.pointsName] = { total: 0, cards: [] };
          }
          pointsByProgram[card.pointsName].total += card.points;
          pointsByProgram[card.pointsName].cards.push(card);
      }
  });

  const totalPointsAcrossAll = Object.values(pointsByProgram).reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-8">
         <div className="flex justify-between items-end">
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Coins className="text-amber-400" /> Points Tracker
                </h2>
                <p className="text-slate-400 text-sm mt-1">Track your accumulated rewards across different ecosystems.</p>
            </div>
            <div className="text-right bg-slate-900 p-3 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Total Points Stashed</p>
                <p className="text-2xl font-mono font-bold text-amber-400">{totalPointsAcrossAll.toLocaleString()}</p>
            </div>
         </div>

         {Object.keys(pointsByProgram).length === 0 ? (
             <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
                 <Coins size={40} className="mx-auto text-slate-600 mb-4" />
                 <h3 className="text-white font-medium">No points tracked yet</h3>
                 <p className="text-slate-500 text-sm mt-2">Go to "My Wallet" and edit your cards to add point balances.</p>
             </div>
         ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {Object.entries(pointsByProgram).map(([program, data]) => (
                     <div key={program} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                         <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
                         
                         <div className="flex justify-between items-start mb-6 relative z-10">
                             <h3 className="font-bold text-lg text-white">{program}</h3>
                             <span className="bg-amber-950/30 text-amber-400 border border-amber-900/50 px-3 py-1 rounded-full font-mono font-medium">
                                 {data.total.toLocaleString()} pts
                             </span>
                         </div>

                         <div className="space-y-3 relative z-10">
                             {data.cards.map(card => (
                                 <div key={card.id} className="flex items-center justify-between bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                                     <div className="flex items-center gap-3">
                                         <CardVisual card={card} small />
                                         <span className="text-sm text-slate-300 font-medium">{card.nickname || card.name}</span>
                                     </div>
                                     <span className="text-sm font-mono text-slate-400">{(card.points || 0).toLocaleString()}</span>
                                 </div>
                             ))}
                         </div>
                     </div>
                 ))}
             </div>
         )}
    </div>
  );
};
