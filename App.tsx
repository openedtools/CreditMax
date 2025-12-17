import React, { useState, useEffect } from 'react';
import { CreditCard, Subscription, ViewState, Benefit, Frequency, AiUsageItem } from './types.ts';
import { MOCK_CARDS, MOCK_SUBSCRIPTIONS, MOCK_AI_ITEMS } from './constants.ts';
import { Dashboard } from './components/Dashboard.tsx';
import { CreditCardDetail } from './components/CreditCardDetail.tsx';
import { SubscriptionList } from './components/SubscriptionList.tsx';
import { BenefitsList } from './components/BenefitsList.tsx';
import { PerksList } from './components/PerksList.tsx';
import { AddCardModal } from './components/AddCardModal.tsx';
import { EditCardModal } from './components/EditCardModal.tsx';
import { AddSubscriptionModal } from './components/AddSubscriptionModal.tsx';
import { AiUsageTracker } from './components/AiUsageTracker.tsx';
import { AddAiServiceModal } from './components/AddAiServiceModal.tsx';
import { PointsTracker } from './components/PointsTracker.tsx';
import { AiAdvisor } from './components/AiAdvisor.tsx';
import { Settings } from './components/Settings.tsx';
import { fetchCardBenefits } from './services/gemini.ts';
import { LayoutDashboard, CreditCard as IconCard, Repeat, Plus, ChevronRight, Gift, ArrowLeft, ShieldCheck, BrainCircuit, Coins, Lightbulb, Sparkles, Settings as IconSettings } from 'lucide-react';
import { CardVisual } from './components/CardVisual.tsx';

const TIPS = [
    "Linking your ChatGPT subscription to a card with digital credits can save you up to $20/mo.",
    "Amex Platinum's Saks credit resets on July 1st. Don't forget to use your first $50!",
    "The Chase Sapphire Reserve travel credit of $300 applies automatically to travel purchases.",
    "Check your Bilt Rent Day double points cap (max 1,000 bonus points).",
    "Use your Uber Cash credits by the end of the month—they don't roll over!",
    "Walmart+ includes Paramount+ Essential. Don't pay for both separately.",
    "Enable 'Autopay' tracking to ensure you never miss a bill payment date."
];

const TipsWidget = () => {
    const [tipIndex, setTipIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTipIndex(prev => (prev + 1) % TIPS.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gradient-to-b from-indigo-900/20 to-slate-900 rounded-xl p-4 border border-indigo-500/20 hidden lg:block transition-all duration-500">
            <h4 className="text-sm font-semibold text-indigo-300 mb-1 flex items-center gap-2">
                <Lightbulb size={14} className="text-yellow-400" /> Did you know?
            </h4>
            <p className="text-xs text-indigo-400/70 leading-relaxed min-h-[3rem] animate-in fade-in duration-500">
                {TIPS[tipIndex]}
            </p>
        </div>
    );
};

// Helper for LocalStorage
const usePersistentState = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [state, setState] = useState<T>(() => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : initialValue;
        } catch (e) {
            return initialValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
};

const App: React.FC = () => {
  const [cards, setCards] = usePersistentState<CreditCard[]>('creditmax_cards', MOCK_CARDS);
  const [subscriptions, setSubscriptions] = usePersistentState<Subscription[]>('creditmax_subscriptions', MOCK_SUBSCRIPTIONS);
  const [aiItems, setAiItems] = usePersistentState<AiUsageItem[]>('creditmax_ai_items', MOCK_AI_ITEMS);
  
  const [view, setView] = useState<ViewState>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSubModalOpen, setIsAddSubModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [editingAiItem, setEditingAiItem] = useState<AiUsageItem | null>(null);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [refreshingCardId, setRefreshingCardId] = useState<string | null>(null);

  const handleAddCard = (newCard: CreditCard) => {
    setCards(prev => [...prev, newCard]);
    setView('cards');
  };

  const handleSaveSubscription = (sub: Subscription) => {
    if (editingSubscription) {
        setSubscriptions(prev => prev.map(s => s.id === sub.id ? sub : s));
    } else {
        setSubscriptions(prev => [...prev, sub]);
    }
    setIsAddSubModalOpen(false);
    setEditingSubscription(null);
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  };

  const openSubscriptionEdit = (sub: Subscription) => {
      setEditingSubscription(sub);
      setIsAddSubModalOpen(true);
  };

  const handleUpdateCard = (updatedCard: CreditCard) => {
      setCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
  };

  const handleDeleteCard = (cardId: string) => {
      setCards(prev => prev.filter(c => c.id !== cardId));
      if (selectedCardId === cardId) setSelectedCardId(null);
  };

  const openEditModal = (card: CreditCard) => {
      setEditingCard(card);
      setIsEditModalOpen(true);
  };

  const handleUpdateBenefit = (cardId: string, benefitId: string, usedAmount: number) => {
    setCards(prevCards => prevCards.map(card => {
      if (card.id !== cardId) return card;
      return {
        ...card,
        benefits: card.benefits.map(benefit => {
          if (benefit.id !== benefitId) return benefit;
          return { ...benefit, usedAmount };
        })
      };
    }));
  };

  const handleSaveAiItem = (item: AiUsageItem) => {
      if (editingAiItem) {
          setAiItems(prev => prev.map(i => i.id === item.id ? item : i));
      } else {
          setAiItems(prev => [...prev, item]);
      }
      setIsAiModalOpen(false);
      setEditingAiItem(null);
  };

  const handleDeleteAiItem = (id: string) => {
      setAiItems(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateAiUsage = (id: string, newUsage: number) => {
    setAiItems(prev => prev.map(item => 
        item.id === id ? { ...item, usedAmount: Math.min(Math.max(0, newUsage), item.quotaAmount) } : item
    ));
  };

  const handleReorderAiItem = (id: string, direction: 'up' | 'down') => {
      setAiItems(prev => {
          const idx = prev.findIndex(i => i.id === id);
          if (idx === -1) return prev;
          const newItems = [...prev];
          if (direction === 'up' && idx > 0) {
              [newItems[idx], newItems[idx - 1]] = [newItems[idx - 1], newItems[idx]];
          } else if (direction === 'down' && idx < newItems.length - 1) {
              [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
          }
          return newItems;
      });
  };

  const openAiAddModal = () => {
      setEditingAiItem(null);
      setIsAiModalOpen(true);
  };

  const openAiEditModal = (item: AiUsageItem) => {
      setEditingAiItem(item);
      setIsAiModalOpen(true);
  };

  const handleRefreshBenefits = async (card: CreditCard) => {
    setRefreshingCardId(card.id);
    try {
        const data = await fetchCardBenefits(card.name);
        const newBenefits: Benefit[] = data.benefits.map((b: any, idx: number) => ({
            id: `refreshed-${card.id}-${idx}-${Date.now()}`,
            title: b.title,
            description: b.description,
            value: b.value || 0,
            frequency: b.frequency as Frequency,
            usedAmount: 0,
            isCredit: b.isCredit,
            category: b.category,
            resetType: 'calendar'
        }));
        const mergedBenefits = newBenefits.map(newB => {
            const existing = card.benefits.find(oldB => oldB.title.toLowerCase() === newB.title.toLowerCase());
            if (existing) {
                return { ...newB, usedAmount: existing.usedAmount, id: existing.id, resetType: existing.resetType }; 
            }
            return newB;
        });
        handleUpdateCard({ ...card, benefits: mergedBenefits });
    } catch (error) {
        alert("Failed to refresh benefits. Please try again.");
    } finally {
        setRefreshingCardId(null);
    }
  };

  const handleLinkCardToSub = (subId: string, cardId: string) => {
      setSubscriptions(prev => prev.map(sub => {
          if (sub.id !== subId) return sub;
          return { ...sub, linkedCardId: cardId };
      }));
  };

  const handleExportData = () => {
      const data = { cards, subscriptions, aiItems, exportDate: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `creditmax_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handleImportData = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const json = JSON.parse(e.target?.result as string);
              if (json.cards && Array.isArray(json.cards)) setCards(json.cards);
              if (json.subscriptions && Array.isArray(json.subscriptions)) setSubscriptions(json.subscriptions);
              if (json.aiItems && Array.isArray(json.aiItems)) setAiItems(json.aiItems);
              alert('Data imported successfully!');
          } catch (err) {
              alert('Failed to parse import file.');
          }
      };
      reader.readAsText(file);
  };

  const handleResetData = () => {
      setCards(MOCK_CARDS);
      setSubscriptions(MOCK_SUBSCRIPTIONS);
      setAiItems(MOCK_AI_ITEMS);
      localStorage.removeItem('creditmax_cards');
      localStorage.removeItem('creditmax_subscriptions');
      localStorage.removeItem('creditmax_ai_items');
      window.location.reload();
  };

  const renderWalletView = () => {
      if (selectedCardId) {
          const card = cards.find(c => c.id === selectedCardId);
          if (!card) return <div>Card not found</div>;
          return (
              <div>
                  <button onClick={() => setSelectedCardId(null)} className="mb-6 text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
                      <ArrowLeft size={16} /> Back to Wallet
                  </button>
                  <CreditCardDetail 
                        card={card} 
                        onUpdateBenefit={handleUpdateBenefit}
                        onEdit={openEditModal}
                        onRefresh={handleRefreshBenefits}
                        isRefreshing={refreshingCardId === card.id}
                    />
              </div>
          );
      }
      return (
          <div className="space-y-6">
              {cards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {cards.map(card => {
                          const monetaryBenefits = card.benefits.filter(b => b.value > 0);
                          const totalValue = monetaryBenefits.reduce((sum, b) => sum + b.value, 0);
                          const totalUsed = monetaryBenefits.reduce((sum, b) => sum + b.usedAmount, 0);
                          const utilization = totalValue > 0 ? Math.round((totalUsed / totalValue) * 100) : 0;
                          return (
                            <div key={card.id} onClick={() => setSelectedCardId(card.id)} className="group bg-slate-900 rounded-2xl p-4 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer shadow-lg shadow-black/20 hover:shadow-indigo-900/10">
                                <div className="mb-4 pointer-events-none">
                                    <CardVisual card={card} />
                                </div>
                                <div className="flex justify-between items-end px-1">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Utilization</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-white">{utilization}%</span>
                                            <span className="text-xs text-slate-400">of credits used</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Value</p>
                                        <p className="text-lg font-mono font-medium text-emerald-400">${totalUsed} <span className="text-slate-600 text-sm">/ ${totalValue}</span></p>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full transition-all duration-1000" style={{width: `${utilization}%`}}></div>
                                </div>
                            </div>
                          );
                      })}
                      <button onClick={() => setIsAddModalOpen(true)} className="flex flex-col items-center justify-center h-full min-h-[200px] rounded-2xl border-2 border-dashed border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/50 transition-all group gap-3">
                          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:border-indigo-500/50">
                              <Plus className="text-slate-400 group-hover:text-indigo-400" />
                          </div>
                          <span className="text-sm font-medium text-slate-400 group-hover:text-indigo-300">Add Another Card</span>
                      </button>
                  </div>
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <IconCard size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-white">No cards added yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">Add your first credit card to start tracking benefits.</p>
                    <button onClick={() => setIsAddModalOpen(true)} className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-center gap-2">
                        <Plus size={16} /> Add your first card
                    </button>
                </div>
              )}
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <div className="flex min-h-screen">
        <aside className="w-20 lg:w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex-shrink-0 fixed h-full z-20 flex flex-col justify-between">
          <div>
            <div className="p-6 flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
                <span className="font-bold text-white text-lg">C</span>
                </div>
                <span className="hidden lg:block font-bold text-xl tracking-tight text-white">CreditMax</span>
            </div>
            <nav className="px-3 space-y-1">
                <NavItem active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard size={20} />} label="Overview" />
                <NavItem active={view === 'advisor'} onClick={() => setView('advisor')} icon={<Sparkles size={20} />} label="AI Advisor" />
                <NavItem active={view === 'cards'} onClick={() => { setView('cards'); setSelectedCardId(null); }} icon={<IconCard size={20} />} label="My Wallet" />
                <NavItem active={view === 'points'} onClick={() => setView('points')} icon={<Coins size={20} />} label="Points Tracker" />
                <NavItem active={view === 'benefits'} onClick={() => setView('benefits')} icon={<Gift size={20} />} label="Monetary Benefits" />
                <NavItem active={view === 'perks'} onClick={() => setView('perks')} icon={<ShieldCheck size={20} />} label="Perks & Status" />
                <NavItem active={view === 'subscriptions'} onClick={() => setView('subscriptions')} icon={<Repeat size={20} />} label="Subscriptions" />
                <NavItem active={view === 'ai-hub'} onClick={() => setView('ai-hub')} icon={<BrainCircuit size={20} />} label="AI Usage Hub" />
            </nav>
          </div>
          <div className="p-4 space-y-4">
            <TipsWidget />
            <NavItem active={view === 'settings'} onClick={() => setView('settings')} icon={<IconSettings size={20} />} label="Settings" />
          </div>
        </aside>
        <main className="flex-1 ml-20 lg:ml-64 p-6 lg:p-10 max-w-7xl mx-auto w-full relative">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <span>Home</span>
                        <ChevronRight size={12} />
                        <span className="text-slate-300 capitalize">{view}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white capitalize tracking-tight">
                        {view === 'cards' ? (selectedCardId ? 'Card Details' : 'My Wallet') : view}
                    </h1>
                </div>
                {view === 'cards' && !selectedCardId && (
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-900/30 flex items-center gap-2 transition-all hover:scale-105">
                        <Plus size={18} />
                        <span className="hidden sm:inline font-medium">Add New Card</span>
                    </button>
                )}
            </header>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                {view === 'dashboard' && <Dashboard cards={cards} subscriptions={subscriptions} aiItems={aiItems} />}
                {view === 'cards' && renderWalletView()}
                {view === 'advisor' && <AiAdvisor cards={cards} subscriptions={subscriptions} aiItems={aiItems} />}
                {view === 'benefits' && <BenefitsList cards={cards} onUpdateBenefit={handleUpdateBenefit} />}
                {view === 'perks' && <PerksList cards={cards} />}
                {view === 'subscriptions' && <SubscriptionList subscriptions={subscriptions} cards={cards} onLinkCard={handleLinkCardToSub} onEdit={openSubscriptionEdit} onDelete={handleDeleteSubscription} />}
                {view === 'ai-hub' && <AiUsageTracker items={aiItems} onUpdateUsage={handleUpdateAiUsage} onEdit={openAiEditModal} onDelete={handleDeleteAiItem} onReorder={handleReorderAiItem} onAdd={openAiAddModal} />}
                {view === 'points' && <PointsTracker cards={cards} />}
                {view === 'settings' && <Settings onExport={handleExportData} onImport={handleImportData} onReset={handleResetData} />}
            </div>
        </main>
      </div>
      <AddCardModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddCard} />
      <EditCardModal isOpen={isEditModalOpen} card={editingCard} onClose={() => { setIsEditModalOpen(false); setEditingCard(null); }} onSave={handleUpdateCard} onDelete={handleDeleteCard} />
      <AddSubscriptionModal isOpen={isAddSubModalOpen} onClose={() => { setIsAddSubModalOpen(false); setEditingSubscription(null); }} onSave={handleSaveSubscription} initialData={editingSubscription} />
      <AddAiServiceModal isOpen={isAiModalOpen} onClose={() => { setIsAiModalOpen(false); setEditingAiItem(null); }} onSave={handleSaveAiItem} initialItem={editingAiItem} />
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: any) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
        <div className={`transition-transform group-hover:scale-110 ${active ? '' : 'opacity-70 group-hover:opacity-100'}`}>
            {icon}
        </div>
        <span className="hidden lg:block font-medium text-sm">{label}</span>
    </button>
);

export default App;