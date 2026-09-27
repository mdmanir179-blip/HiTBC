import React from 'react';
import { ShoppingBag, Search, PlusCircle, User, ShieldAlert } from 'lucide-react';
import { CustomerUser } from '../types';

interface MobileBottomNavProps {
  currentTab: 'customer' | 'admin';
  setCurrentTab: (tab: 'customer' | 'admin') => void;
  customerSubTab: 'offers' | 'tracker';
  setCustomerSubTab: (sub: 'offers' | 'tracker') => void;
  customerUser: CustomerUser | null;
  onOpenCustomerAuthModal: () => void;
  onOpenQuickClaim: () => void;
  lang: 'bn' | 'en';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  customerSubTab,
  setCustomerSubTab,
  customerUser,
  onOpenCustomerAuthModal,
  onOpenQuickClaim,
  lang,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl">
      <div className="flex items-center justify-around">
        
        {/* Tab 1: Deals */}
        <button
          onClick={() => {
            setCurrentTab('customer');
            setCustomerSubTab('offers');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            currentTab === 'customer' && customerSubTab === 'offers'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {currentTab === 'customer' && customerSubTab === 'offers' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500" />
            )}
          </div>
          <span className="text-[10px]">{lang === 'bn' ? 'অফারসমূহ' : 'Deals'}</span>
        </button>

        {/* Tab 2: Track Claims */}
        <button
          onClick={() => {
            setCurrentTab('customer');
            setCustomerSubTab('tracker');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            currentTab === 'customer' && customerSubTab === 'tracker'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Search className="w-5 h-5" />
            {currentTab === 'customer' && customerSubTab === 'tracker' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500" />
            )}
          </div>
          <span className="text-[10px]">{lang === 'bn' ? 'ট্র্যাকার' : 'Tracker'}</span>
        </button>

        {/* Tab 3: Center Action Button (Claim) */}
        <button
          onClick={onOpenQuickClaim}
          className="flex flex-col items-center -mt-5 group"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/30 group-active:scale-95 transition">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-white mt-1">
            {lang === 'bn' ? 'ক্লেইম' : 'Claim'}
          </span>
        </button>

        {/* Tab 4: Customer Account / Login */}
        <button
          onClick={onOpenCustomerAuthModal}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            customerUser?.isLoggedIn
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <User className="w-5 h-5" />
            {customerUser?.isLoggedIn && (
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-500 border border-slate-950" />
            )}
          </div>
          <span className="text-[10px]">
            {customerUser?.isLoggedIn 
              ? (lang === 'bn' ? 'প্রোফাইল' : 'Profile') 
              : (lang === 'bn' ? 'লগইন' : 'Login')}
          </span>
        </button>

      </div>
    </nav>
  );
};
