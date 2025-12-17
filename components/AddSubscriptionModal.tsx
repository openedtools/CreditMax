
import React, { useState, useEffect } from 'react';
import { X, Calendar, Check } from 'lucide-react';
import { Subscription, Frequency } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sub: Subscription) => void;
  initialData?: Subscription | null;
  onAdd?: (sub: Subscription) => void; // Backwards compatibility mostly, but we use onSave now
}

export const AddSubscriptionModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [renewalDay, setRenewalDay] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [autoPay, setAutoPay] = useState(true);

  useEffect(() => {
      if (initialData) {
          setName(initialData.name);
          setCost(initialData.cost.toString());
          setRenewalDay(initialData.renewalDay.toString());
          setCategory(initialData.category);
          setAutoPay(initialData.autoPay !== undefined ? initialData.autoPay : true);
      } else {
          setName('');
          setCost('');
          setRenewalDay('');
          setCategory('Entertainment');
          setAutoPay(true);
      }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cost || !renewalDay) return;

    const newSub: Subscription = {
        id: initialData ? initialData.id : `sub-${Date.now()}`,
        name,
        cost: parseFloat(cost),
        frequency: Frequency.MONTHLY,
        renewalDay: parseInt(renewalDay),
        category,
        linkedCardId: initialData?.linkedCardId || '',
        autoPay
    };

    onSave(newSub);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">{initialData ? 'Edit Subscription' : 'Add Subscription'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">Service Name</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Netflix, Spotify"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">Monthly Cost ($)</label>
                    <input 
                        type="number" 
                        step="0.01"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">Renewal Day</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            min="1"
                            max="31"
                            value={renewalDay}
                            onChange={(e) => setRenewalDay(e.target.value)}
                            placeholder="1-31"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                            required
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                >
                    <option value="Entertainment">Entertainment</option>
                    <option value="Music">Music</option>
                    <option value="Shopping">Shopping</option>
                    <option value="AI">AI Tool</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Travel">Travel</option>
                </select>
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
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-indigo-900/20"
            >
                <Check size={18} /> {initialData ? 'Save Changes' : 'Add Subscription'}
            </button>
        </form>

      </div>
    </div>
  );
};
