import React from 'react';
import { CreditCard } from '../types';
import { CreditCard as IconCreditCard, Wifi, Gem } from 'lucide-react';

interface Props {
  card: CreditCard;
  small?: boolean;
}

export const CardVisual: React.FC<Props> = ({ card, small = false }) => {
  return (
    <div 
      className={`relative overflow-hidden rounded-xl shadow-xl bg-gradient-to-br ${card.colorFrom} ${card.colorTo} text-white transition-all duration-300
        ${small ? 'w-16 h-10 rounded-md' : 'w-full aspect-[1.586/1] p-6 flex flex-col justify-between group hover:scale-[1.01] border border-white/10'}
      `}
    >
      {!small && (
        <>
          {/* Background patterns */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-all"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-black/30 blur-2xl"></div>
          
          {/* Header: Issuer & Wifi */}
          <div className="flex justify-between items-start relative z-10">
            <span className="font-bold tracking-wider opacity-80 uppercase text-xs drop-shadow-sm">{card.issuer}</span>
            <Wifi className="w-6 h-6 opacity-70 rotate-90 drop-shadow-sm" />
          </div>

          {/* Chip & Name */}
          <div className="relative z-10 mt-2">
             <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-8 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md flex overflow-hidden shadow-inner border border-yellow-500/30">
                    <div className="w-1/2 h-full bg-white/20 border-r border-yellow-600/20"></div>
                    <div className="w-1/2 h-full relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border border-black/10 rounded-sm"></div>
                    </div>
                </div>
                <Wifi className="w-4 h-4 opacity-0" /> {/* Spacer */}
             </div>
             
             {/* Display Nickname if available, otherwise Card Name */}
             <div>
                 <h3 className="text-xl font-bold tracking-wide shadow-black drop-shadow-lg font-mono truncate pr-4">
                    {card.nickname || card.name}
                 </h3>
                 {card.nickname && (
                    <p className="text-[10px] opacity-70 uppercase tracking-widest mt-1 font-medium truncate">{card.name}</p>
                 )}
             </div>
          </div>

          {/* Footer: Last 4 & Logo */}
          <div className="flex justify-between items-end relative z-10">
            <div className="flex flex-col">
              <span className="text-[9px] opacity-75 uppercase mb-0.5">
                  {card.last4 ? `•••• •••• •••• ${card.last4}` : 'Card Number'}
              </span>
              <span className="text-xs font-medium tracking-widest uppercase opacity-90">Valued Member</span>
            </div>
            <div className="opacity-90 drop-shadow-md">
                {/* Simple Network Icon Logic */}
                {card.network?.toLowerCase().includes('amex') ? (
                    <span className="font-bold text-lg italic tracking-tighter border-2 border-white p-1 rounded-sm text-[10px] block leading-none">AMEX</span>
                ) : card.network?.toLowerCase().includes('visa') ? (
                     <span className="font-bold text-lg italic tracking-tighter">VISA</span>
                ) : (
                    <IconCreditCard className="w-8 h-8" />
                )}
            </div>
          </div>
        </>
      )}
      {small && (
         <div className="flex items-center justify-center h-full">
            <span className="font-bold text-[8px] opacity-50">{card.nickname ? card.nickname.substring(0,3) : card.issuer.substring(0,3)}</span>
         </div>
      )}
    </div>
  );
};