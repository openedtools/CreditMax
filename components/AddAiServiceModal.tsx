
import React, { useState, useEffect } from 'react';
import { X, Calendar, Check, BrainCircuit, Link as IconLink } from 'lucide-react';
import { AiUsageItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: AiUsageItem) => void;
  initialItem?: AiUsageItem | null;
}

export const AddAiServiceModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialItem }) => {
  const [serviceName, setServiceName] = useState('');
  const [planName, setPlanName] = useState('');
  const [loginUrl, setLoginUrl] = useState('');
  const [quotaName, setQuotaName] = useState('');
  const [quotaAmount, setQuotaAmount] = useState('');
  const [renewalDay, setRenewalDay] = useState('');
  const [frequency, setFrequency] = useState<'Monthly' | 'Daily'>('Monthly');
  const [autoPay, setAutoPay] = useState(true);

  useEffect(() => {
    if (initialItem) {
        setServiceName(initialItem.serviceName);
        setPlanName(initialItem.planName);
        setLoginUrl(initialItem.loginUrl || '');
        setQuotaName(initialItem.quotaName);
        setQuotaAmount(initialItem.quotaAmount.toString());
        setRenewalDay(initialItem.renewalDay.toString());
        setFrequency(initialItem.frequency);
        setAutoPay(initialItem.autoPay !== undefined ? initialItem.autoPay : true);
    } else {
        setServiceName('');
        setPlanName('');
        setLoginUrl('');
        setQuotaName('');
        setQuotaAmount('');
        setRenewalDay('');
        setFrequency('Monthly');
        setAutoPay(true);
    }
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !quotaName || !quotaAmount) return;

    const newItem: AiUsageItem = {
        id: initialItem?.id || `ai-${Date.now()}`,
        serviceName,
        planName,
        loginUrl,
        quotaName,
        quotaAmount: Number(quotaAmount),
        usedAmount: initialItem?.usedAmount || 0,
        renewalDay: Number(renewalDay) || 1,
        frequency,
        autoPay
    };

    onSave(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <BrainCircuit className="text-fuchsia-500" size={24} />
            {initialItem ? 'Edit Service' : 'Add AI Service'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">Service</label>
                    <input 
                        type="text" 
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        placeholder="e.g. ChatGPT"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">Plan Name</label>
                    <input 
                        type="text" 
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
                        placeholder="e.g. Team"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">Login URL</label>
                <div className="relative">
                    <input 
                        type="url" 
                        value={loginUrl}
                        onChange={(e) => setLoginUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-10 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                    <IconLink className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">Quota Name</label>
                    <input 
                        type="text" 
                        value={quotaName}
                        onChange={(e) => setQuotaName(e.target.value)}
                        placeholder="e.g. Credits"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">Max Amount</label>
                    <input 
                        type="number" 
                        value={quotaAmount}
                        onChange={(e) => setQuotaAmount(e.target.value)}
                        placeholder="100"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">Frequency</label>
                    <select 
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value as 'Monthly' | 'Daily')}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                    >
                        <option value="Monthly">Monthly</option>
                        <option value="Daily">Daily</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">Reset Day</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            min="1"
                            max="31"
                            value={renewalDay}
                            onChange={(e) => setRenewalDay(e.target.value)}
                            placeholder="1-31"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>
            
            <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer group p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${autoPay ? 'bg-emerald-600 border-emerald-600' : 'bg-slate-900 border-slate-600'}`}>
                        {autoPay && <Check size={14} className="text-white" />}
                    </div>
                    <input 
                        type="checkbox" 
                        className="hidden"
                        checked={autoPay}
                        onChange={(e) => setAutoPay(e.target.checked)}
                    />
                    <div>
                        <span className="block text-sm font-medium text-white">Autopay Enabled</span>
                        <span className="block text-xs text-slate-500">Is this subscription set to pay automatically?</span>
                    </div>
                </label>
            </div>

            <button 
                type="submit"
                className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-fuchsia-900/20"
            >
                <Check size={18} /> {initialItem ? 'Save Changes' : 'Add Service'}
            </button>
        </form>

      </div>
    </div>
  );
};
