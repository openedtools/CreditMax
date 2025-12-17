
import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Trash2, Calendar, Plus, Link as IconLink, Coins, Check, Edit2, Eye, EyeOff, GripVertical, DollarSign } from 'lucide-react';
import { CreditCard, Benefit, Frequency } from '../types';
import { CardVisual } from './CardVisual';

interface Props {
  isOpen: boolean;
  card: CreditCard | null;
  onClose: () => void;
  onSave: (updatedCard: CreditCard) => void;
  onDelete: (cardId: string) => void;
}

const COLOR_THEMES = [
    { from: 'from-slate-400', to: 'to-slate-600', label: 'Platinum' },
    { from: 'from-blue-800', to: 'to-indigo-900', label: 'Sapphire' },
    { from: 'from-amber-200', to: 'to-yellow-500', label: 'Gold' },
    { from: 'from-emerald-700', to: 'to-teal-900', label: 'Green' },
    { from: 'from-red-700', to: 'to-rose-900', label: 'Red' },
    { from: 'from-slate-800', to: 'to-black', label: 'Black' },
    { from: 'from-violet-600', to: 'to-fuchsia-800', label: 'Purple' },
];

export const EditCardModal: React.FC<Props> = ({ isOpen, card, onClose, onSave, onDelete }) => {
  const [editedCard, setEditedCard] = useState<CreditCard | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'benefits'>('details');
  const [hasChanges, setHasChanges] = useState(false);
  
  // Benefit Form State
  const [isAddingBenefit, setIsAddingBenefit] = useState(false);
  const [editingBenefitId, setEditingBenefitId] = useState<string | null>(null);
  const [newBenefit, setNewBenefit] = useState<Partial<Benefit>>({
    title: '',
    description: '',
    value: 0,
    frequency: Frequency.MONTHLY,
    category: 'Other',
    isCredit: true,
    isHidden: false
  });

  // Drag and Drop Refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    if (card) {
        setEditedCard({ ...card });
        setActiveTab('details');
        setIsAddingBenefit(false);
        setEditingBenefitId(null);
        setHasChanges(false);
    }
  }, [card]);

  if (!isOpen || !editedCard) return null;

  const handleSave = () => {
    onSave(editedCard);
    setHasChanges(false);
    onClose();
  };

  const markChanged = () => setHasChanges(true);

  const handleToggleHidden = (benefitId: string) => {
      setEditedCard({
          ...editedCard,
          benefits: editedCard.benefits.map(b => 
              b.id === benefitId ? { ...b, isHidden: !b.isHidden } : b
          )
      });
      markChanged();
  };

  const handleValueChange = (benefitId: string, newValue: number) => {
      setEditedCard({
          ...editedCard,
          benefits: editedCard.benefits.map(b => 
              b.id === benefitId ? { ...b, value: newValue } : b
          )
      });
      markChanged();
  };

  const handleSort = () => {
      if (dragItem.current === null || dragOverItem.current === null) return;
      const _benefits = [...editedCard.benefits];
      const draggedItemContent = _benefits.splice(dragItem.current, 1)[0];
      _benefits.splice(dragOverItem.current, 0, draggedItemContent);
      setEditedCard({ ...editedCard, benefits: _benefits });
      dragItem.current = null;
      dragOverItem.current = null;
      markChanged();
  };

  const handleRemoveBenefit = (id: string) => {
      setEditedCard({
          ...editedCard,
          benefits: editedCard.benefits.filter(b => b.id !== id)
      });
      markChanged();
  };

  const handleSaveNewBenefit = () => {
      if (!newBenefit.title) return;
      const benefitToAdd: Benefit = {
          id: editingBenefitId || `custom-${Date.now()}`,
          title: newBenefit.title!,
          description: newBenefit.description || '',
          value: Number(newBenefit.value) || 0,
          frequency: newBenefit.frequency || Frequency.ONE_TIME,
          usedAmount: 0,
          isCredit: newBenefit.isCredit || false,
          category: newBenefit.category || 'Other',
          isHidden: newBenefit.isHidden || false
      };

      if (editingBenefitId) {
          setEditedCard({
              ...editedCard,
              benefits: editedCard.benefits.map(b => b.id === editingBenefitId ? benefitToAdd : b)
          });
      } else {
          setEditedCard({
              ...editedCard,
              benefits: [...editedCard.benefits, benefitToAdd]
          });
      }

      setIsAddingBenefit(false);
      setEditingBenefitId(null);
      markChanged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh]">
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-semibold text-white">Edit Card</h2>
            {hasChanges && <span className="text-xs text-amber-400">● Unsaved changes</span>}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-slate-800">
            <button 
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'details' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
                Card Details
            </button>
            <button 
                onClick={() => setActiveTab('benefits')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'benefits' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
                Manage Benefits ({editedCard.benefits.length})
            </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
           {activeTab === 'details' && (
               <div className="space-y-6">
                    <div className="flex justify-center"><div className="w-64"><CardVisual card={editedCard} /></div></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Nickname</label>
                            <input type="text" value={editedCard.nickname || ''} onChange={(e) => {setEditedCard({...editedCard, nickname: e.target.value}); markChanged();}} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Last 4</label>
                            <input type="text" maxLength={4} value={editedCard.last4 || ''} onChange={(e) => {setEditedCard({...editedCard, last4: e.target.value.replace(/\D/g,'')}); markChanged();}} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white font-mono" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Theme</label>
                        <div className="flex flex-wrap gap-2">
                            {COLOR_THEMES.map((theme, idx) => (
                                <button key={idx} onClick={() => {setEditedCard({...editedCard, colorFrom: theme.from, colorTo: theme.to}); markChanged();}} className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.from} ${theme.to} border-2 ${editedCard.colorFrom === theme.from ? 'border-white scale-110' : 'border-transparent opacity-60'}`} />
                            ))}
                        </div>
                    </div>
               </div>
           )}

           {activeTab === 'benefits' && (
               <div className="space-y-4">
                   {!isAddingBenefit ? (
                       <>
                           <div className="space-y-2">
                               {editedCard.benefits.map((benefit, idx) => (
                                   <div 
                                        key={benefit.id} 
                                        draggable
                                        onDragStart={() => { dragItem.current = idx; }}
                                        onDragEnter={(e) => { dragOverItem.current = idx; e.preventDefault(); }}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDragEnd={handleSort}
                                        className={`flex items-center justify-between bg-slate-950 p-3 rounded-xl border transition-all ${benefit.isHidden ? 'opacity-40 border-slate-800' : 'border-slate-800 hover:border-indigo-500/30'}`}
                                   >
                                       <div className="cursor-grab active:cursor-grabbing p-1 text-slate-600 hover:text-indigo-400"><GripVertical size={20} /></div>
                                       <div className="flex-1 px-4 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm text-white truncate">{benefit.title}</span>
                                                <span className="text-[10px] bg-slate-900 border border-slate-800 px-1.5 rounded text-slate-500">{benefit.category}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <DollarSign size={10} className="text-emerald-500" />
                                                <input 
                                                    type="number" 
                                                    value={benefit.value} 
                                                    onChange={(e) => handleValueChange(benefit.id, Number(e.target.value))}
                                                    className="bg-transparent border-none p-0 text-xs font-mono text-emerald-400 w-16 focus:ring-0"
                                                />
                                                <span className="text-[10px] text-slate-600">/ {benefit.frequency}</span>
                                            </div>
                                       </div>
                                       <div className="flex gap-1">
                                            <button onClick={() => handleToggleHidden(benefit.id)} className={`p-2 rounded-lg ${benefit.isHidden ? 'text-slate-500 hover:text-white' : 'text-indigo-400 bg-indigo-900/20'}`}>
                                                {benefit.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <button onClick={() => {setNewBenefit(benefit); setEditingBenefitId(benefit.id); setIsAddingBenefit(true);}} className="p-2 text-slate-500 hover:text-white"><Edit2 size={16} /></button>
                                            <button onClick={() => handleRemoveBenefit(benefit.id)} className="p-2 text-slate-500 hover:text-rose-400"><Trash2 size={16} /></button>
                                       </div>
                                   </div>
                               ))}
                           </div>
                           <button onClick={() => {setNewBenefit({title:'', description:'', value:0, frequency:Frequency.MONTHLY, category:'Other', isCredit:true, isHidden:false}); setEditingBenefitId(null); setIsAddingBenefit(true);}} className="w-full py-4 border-2 border-dashed border-slate-800 rounded-xl text-slate-400 hover:text-indigo-400 flex items-center justify-center gap-2 text-sm font-medium mt-4 transition-all">
                               <Plus size={18} /> Add Custom Benefit
                           </button>
                       </>
                   ) : (
                       <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                           <input type="text" placeholder="Benefit Title" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white" value={newBenefit.title} onChange={e => setNewBenefit({...newBenefit, title: e.target.value})} />
                           <textarea placeholder="Description" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white h-24" value={newBenefit.description} onChange={e => setNewBenefit({...newBenefit, description: e.target.value})} />
                           <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Value ($)" className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white" value={newBenefit.value} onChange={e => setNewBenefit({...newBenefit, value: Number(e.target.value)})} />
                                <select className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white" value={newBenefit.frequency} onChange={e => setNewBenefit({...newBenefit, frequency: e.target.value as Frequency})}>
                                    {Object.values(Frequency).map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                           </div>
                           <div className="flex gap-3">
                               <button onClick={() => setIsAddingBenefit(false)} className="flex-1 bg-slate-800 py-2 rounded-lg text-white">Cancel</button>
                               <button onClick={handleSaveNewBenefit} className="flex-1 bg-indigo-600 py-2 rounded-lg text-white">Save Benefit</button>
                           </div>
                       </div>
                   )}
               </div>
           )}

           <div className="flex justify-between pt-6 border-t border-slate-800 mt-6">
               <button onClick={() => {if(confirm("Delete card?")) {onDelete(editedCard.id); onClose();}}} className="text-rose-400 hover:text-rose-300 text-sm flex items-center gap-2"><Trash2 size={16} /> Delete Card</button>
               <div className="flex gap-3">
                   <button onClick={onClose} className="px-6 py-2 text-slate-400">Cancel</button>
                   <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-indigo-900/30 transition-all active:scale-95">Save Changes</button>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};
