import React, { useState } from 'react';
import { X, Sparkles, Smartphone, Download, Star } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const MobileAppInstallBanner: React.FC<{ lang: 'bn' | 'en' }> = ({ lang }) => {
  const { isInstalled } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) return null;

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950/60 border border-indigo-500/30 p-4 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        
        {/* App Icon & Info */}
        <div className="flex items-center gap-3">
          <img
            src="/pwa-192x192.png"
            alt="CashbackPro App"
            className="w-12 h-12 rounded-xl shadow-lg border border-indigo-500/40 shrink-0"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-white text-sm">CashbackPro App</h4>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {lang === 'bn' 
                ? 'হোম স্ক্রিনে ইনস্টল করে ১-ক্লিকে ক্লেইম ও নোটিফিকেশন পান' 
                : 'Install on Home Screen for instant claim tracking & offline mode'}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
              <span className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                ))}
              </span>
              <span className="text-slate-400">(4.9/5 • 10K+ Claims)</span>
            </div>
          </div>
        </div>

        {/* Action Button & Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton lang={lang} variant="card" />
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
