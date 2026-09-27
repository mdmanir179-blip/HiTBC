import React from 'react';
import { 
  Gift, 
  Globe, 
  Palette, 
  ShoppingBag, 
  Clock, 
  User, 
  LogOut, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { CustomerUser } from '../types';
import { ScreenTheme } from '../types/theme';

interface NavbarProps {
  currentTab: 'customer' | 'admin';
  setCurrentTab: (tab: 'customer' | 'admin') => void;
  customerSubTab: 'offers' | 'tracker';
  setCustomerSubTab: (sub: 'offers' | 'tracker') => void;
  customerUser: CustomerUser | null;
  onOpenCustomerAuthModal: () => void;
  onCustomerLogout: () => void;
  onOpenThemeModal: () => void;
  currentTheme: ScreenTheme;
  lang: 'bn' | 'en';
  setLang: (lang: 'bn' | 'en') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  customerSubTab,
  setCustomerSubTab,
  customerUser,
  onOpenCustomerAuthModal,
  onCustomerLogout,
  onOpenThemeModal,
  currentTheme,
  lang,
  setLang,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => {
              setCurrentTab('customer');
              setCustomerSubTab('offers');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Gift className="w-5 h-5 text-indigo-400 group-hover:text-emerald-400 transition" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight">WMS</span>
                <span className="font-semibold text-indigo-400 text-sm">Cashback</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider hidden sm:inline-block">
                  Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {lang === 'bn' ? 'ক্যাশব্যাক ও রিওয়ার্ড পোর্টাল' : 'Cashback & Rewards Portal'}
              </p>
            </div>
          </div>

          {/* Clean Customer Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => {
                setCurrentTab('customer');
                setCustomerSubTab('offers');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentTab === 'customer' && customerSubTab === 'offers'
                  ? 'bg-slate-800 text-indigo-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'অফারসমূহ' : 'Cashback Deals'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('customer');
                setCustomerSubTab('tracker');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentTab === 'customer' && customerSubTab === 'tracker'
                  ? 'bg-slate-800 text-indigo-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'আমার ক্লেইমস' : 'Track Claims'}</span>
            </button>
          </nav>
        </div>

        {/* Right Actions: Color Theme, Language, Customer Login / Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Screen Color / Theme Switcher */}
          <button
            onClick={onOpenThemeModal}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition text-xs font-semibold flex items-center gap-1.5"
            title={lang === 'bn' ? 'স্ক্রিন কালার ও থিম পরিবর্তন' : 'Change Screen Color'}
          >
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline text-[11px] font-bold">
              {lang === 'bn' ? 'কালার' : 'Theme'}
            </span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition text-xs font-semibold flex items-center gap-1.5"
            title={lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span className="uppercase text-[11px] font-bold">{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Customer Login / Profile Button */}
          {customerUser?.isLoggedIn ? (
            /* Logged-in Customer Profile Pill */
            <div className="flex items-center gap-2 bg-slate-800/90 pl-1.5 pr-2.5 py-1 rounded-xl border border-slate-700/80 shadow-sm">
              <div className="relative">
                {customerUser.avatarUrl ? (
                  <img
                    src={customerUser.avatarUrl}
                    alt={customerUser.name}
                    className="w-7 h-7 rounded-lg object-cover border border-indigo-500/50"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {customerUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-slate-900" />
              </div>

              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-white block leading-tight line-clamp-1">
                  {customerUser.name}
                </span>
                <span className="text-[10px] text-emerald-400 block font-semibold">
                  {customerUser.upiId || 'Customer'}
                </span>
              </div>

              <button
                onClick={onCustomerLogout}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 transition ml-1"
                title={lang === 'bn' ? 'লগআউট' : 'Logout'}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Login / Register Trigger Button */
            <button
              onClick={onOpenCustomerAuthModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs flex items-center gap-2 transition shadow-md shadow-indigo-600/30 active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'লগইন / সাইনআপ' : 'Login / Register'}</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
