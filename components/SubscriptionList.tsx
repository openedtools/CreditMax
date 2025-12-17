
import React from 'react';
import { Subscription, CreditCard } from '../types';
import { CreditCard as CardIcon, Zap, Calendar, Check, Edit2, Trash2 } from 'lucide-react';

interface Props {
  subscriptions: Subscription[];
  cards: CreditCard[];
  onLinkCard: (subId: string, cardId: string) => void;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionList: React.FC<Props> = ({ subscriptions, cards, onLinkCard, onEdit, onDelete }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-xs uppercase text-slate-400 tracking-wider">
                    <th className="p-4 font-medium">Service</th>
                    <th className="p-4 font-medium">Renewal</th>
                    <th className="p-4 font-medium">Cost</th>
                    <th className="p-4 font-medium">Payment Method</th>
                    <th className="p-4 font-medium text-right">AI Optimization</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
                {subscriptions.map(sub => {
                    const linkedCard = cards.find(c => c.id === sub.linkedCardId);
                    const isAiPlan = sub.category === 'AI';

                    return (
                        <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors group">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold relative ${isAiPlan ? 'bg-gradient-to-br from-pink-500 to-violet-600 shadow-lg shadow-violet-900/30' : 'bg-slate-800 border border-slate-700'} text-white`}>
                                        {sub.name.charAt(0)}
                                        {sub.autoPay && (
                                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center" title="Autopay On">
                                                <Check size={8} className="text-white" strokeWidth={4} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-medium text-slate-200 block">{sub.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500">{sub.category}</span>
                                            {sub.autoPay && <span className="text-[9px] bg-emerald-900/30 text-emerald-500 px-1 rounded border border-emerald-900/50">Autopay</span>}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Calendar size={14} />
                                    <span>Day {sub.renewalDay}</span>
                                </div>
                            </td>
                            <td className="p-4 font-mono text-slate-300">${sub.cost} <span className="text-slate-600 text-xs">/mo</span></td>
                            <td className="p-4">
                                <div className="relative">
                                    <select 
                                        className="bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none pr-8 w-48 truncate"
                                        value={sub.linkedCardId || ''}
                                        onChange={(e) => onLinkCard(sub.id, e.target.value)}
                                    >
                                        <option value="">Select Payment Card...</option>
                                        {cards.map(card => (
                                            <option key={card.id} value={card.id}>
                                                {card.nickname || card.name} ({card.last4 ? `...${card.last4}` : '***'})
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                {linkedCard ? (
                                    <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs bg-emerald-950/30 px-2.5 py-1 rounded-full border border-emerald-900/50">
                                        <CardIcon size={12} />
                                        Covered by {linkedCard.nickname || linkedCard.issuer}
                                    </div>
                                ) : (
                                    <span className="text-slate-600 text-xs italic opacity-50">No benefit linked</span>
                                )}
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => onEdit(sub)}
                                        className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                                        title="Edit Subscription"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (confirm('Are you sure you want to remove this subscription?')) {
                                                onDelete(sub.id);
                                            }
                                        }}
                                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
                                        title="Delete Subscription"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>
    </div>
  );
};
