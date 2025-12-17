
import React from 'react';
import { AiUsageItem } from '../types';
import { BrainCircuit, ExternalLink, Plus, Check, X, Edit2, Trash2, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

interface Props {
    items: AiUsageItem[];
    onUpdateUsage: (id: string, newUsage: number) => void;
    onEdit: (item: AiUsageItem) => void;
    onDelete: (id: string) => void;
    onReorder: (id: string, direction: 'up' | 'down') => void;
    onAdd: () => void;
}

export const AiUsageTracker: React.FC<Props> = ({ items, onUpdateUsage, onEdit, onDelete, onReorder, onAdd }) => {

    const calculateNextReset = (renewalDay: number, freq: string) => {
        const now = new Date();
        const currentDay = now.getDate();
        const resetDate = new Date(now);

        if (freq === 'Daily') {
            resetDate.setDate(currentDay + 1);
            resetDate.setHours(0,0,0,0);
        } else {
            // Monthly Logic
            if (currentDay > renewalDay) {
                resetDate.setMonth(now.getMonth() + 1);
            }
            resetDate.setDate(renewalDay);
        }
        
        const diffTime = resetDate.getTime() - now.getTime();
        const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
            dateStr: resetDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            daysUntil
        };
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <BrainCircuit className="text-fuchsia-500" /> AI Usage Hub
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Track quotas, manage limits, and organize your AI subscriptions.</p>
                </div>
                <button 
                    onClick={onAdd}
                    className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-fuchsia-900/20 transition-all"
                >
                    <Plus size={16} /> Add Service
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase text-slate-400 tracking-wider">
                                <th className="p-4 font-medium w-12"></th>
                                <th className="p-4 font-medium">Service & Plan</th>
                                <th className="p-4 font-medium">Quota Type</th>
                                <th className="p-4 font-medium text-center">Next Reset</th>
                                <th className="p-4 font-medium">Usage Progress</th>
                                <th className="p-4 font-medium text-right">Remaining</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {items.map((item, idx) => {
                                const { dateStr, daysUntil } = calculateNextReset(item.renewalDay, item.frequency);
                                const percentage = (item.usedAmount / item.quotaAmount) * 100;
                                const remaining = item.quotaAmount - item.usedAmount;
                                const isNearLimit = percentage >= 80;

                                return (
                                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                                        <td className="p-4 align-top">
                                            <div className="flex flex-col gap-1 mt-1">
                                                <button 
                                                    onClick={() => onReorder(item.id, 'up')}
                                                    disabled={idx === 0}
                                                    className="text-slate-600 hover:text-indigo-400 disabled:opacity-30 disabled:hover:text-slate-600"
                                                >
                                                    <ArrowUp size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => onReorder(item.id, 'down')}
                                                    disabled={idx === items.length - 1}
                                                    className="text-slate-600 hover:text-indigo-400 disabled:opacity-30 disabled:hover:text-slate-600"
                                                >
                                                    <ArrowDown size={14} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-lg font-bold text-white border border-slate-600/50 relative shrink-0">
                                                    {item.serviceName.charAt(0)}
                                                    {item.autoPay && (
                                                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center" title="Autopay On">
                                                            <Check size={8} className="text-white" strokeWidth={4} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="max-w-[200px]">
                                                    {item.loginUrl ? (
                                                        <a href={item.loginUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-slate-200 hover:text-fuchsia-400 hover:underline flex items-center gap-1 whitespace-normal">
                                                            {item.serviceName} <ExternalLink size={12} className="opacity-50 shrink-0" />
                                                        </a>
                                                    ) : (
                                                        <span className="font-medium text-slate-200 whitespace-normal block">{item.serviceName}</span>
                                                    )}
                                                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                                        <span className="text-xs text-slate-500 block whitespace-normal">{item.planName}</span>
                                                        {item.autoPay && <span className="text-[9px] bg-emerald-900/30 text-emerald-500 px-1 rounded border border-emerald-900/50 whitespace-nowrap">Autopay</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <span className="text-sm text-slate-300 font-medium block whitespace-normal max-w-[150px]">{item.quotaName}</span>
                                            <span className="text-xs text-slate-500">{item.frequency} Reset</span>
                                        </td>
                                        <td className="p-4 text-center align-top">
                                            <div className="inline-flex flex-col items-center">
                                                <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                                    {dateStr}
                                                </span>
                                                <span className="text-[10px] text-fuchsia-400/80 mt-1 font-medium">
                                                    {daysUntil} days left
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="w-48">
                                                <div className="flex justify-between text-xs mb-1.5">
                                                     <span className="text-slate-400">{item.usedAmount} used</span>
                                                     <span className="text-slate-500">{item.quotaAmount} limit</span>
                                                </div>
                                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative group-hover:ring-1 ring-white/5">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-500 ${isNearLimit ? 'bg-rose-500' : 'bg-fuchsia-500'}`} 
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="mt-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => onUpdateUsage(item.id, item.usedAmount + 1)}
                                                        className="bg-slate-800 hover:bg-slate-700 text-xs px-2 py-1 rounded text-slate-300 border border-slate-700 flex-1"
                                                    >
                                                        +1
                                                    </button>
                                                    <button 
                                                        onClick={() => onUpdateUsage(item.id, item.usedAmount - 1)}
                                                        className="bg-slate-800 hover:bg-slate-700 text-xs px-2 py-1 rounded text-slate-300 border border-slate-700 flex-1"
                                                    >
                                                        -1
                                                    </button>
                                                    <button 
                                                        onClick={() => onUpdateUsage(item.id, 0)}
                                                        className="bg-slate-800 hover:bg-rose-900/30 text-xs px-2 py-1 rounded text-slate-300 hover:text-rose-400 border border-slate-700"
                                                        title="Reset to 0"
                                                    >
                                                        <RefreshCw size={10} />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right align-top">
                                            <span className={`font-mono text-lg font-bold ${remaining === 0 ? 'text-slate-600' : isNearLimit ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                {remaining}
                                            </span>
                                            <span className="text-xs text-slate-500 block uppercase tracking-wider">Units Left</span>
                                        </td>
                                        <td className="p-4 text-right align-top">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => onEdit(item)}
                                                    className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                                                    title="Edit Service"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if(confirm(`Are you sure you want to delete ${item.serviceName} - ${item.quotaName}?`)) {
                                                            onDelete(item.id)
                                                        }
                                                    }}
                                                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
                                                    title="Delete Service"
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
        </div>
    );
};
