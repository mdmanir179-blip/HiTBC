import React, { useState } from 'react';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  lang: 'bn' | 'en';
  variant?: 'nav' | 'banner' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ lang, variant = 'nav' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running inside standalone app mode
  if (isInstalled) {
    if (variant === 'nav') {
      return (
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px]">{lang === 'bn' ? 'অ্যাপ মোড' : 'App Active'}</span>
        </div>
      );
    }
    return null;
  }

  // Handle click: either trigger native prompt or show iOS guide or generic guide
  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Browser hasn't triggered beforeinstallprompt yet or already dismissed
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'banner' ? (
        <button
          onClick={handleClick}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition active:scale-95"
        >
          <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          <span>{lang === 'bn' ? 'মোবাইলে অ্যাপ ইনস্টল করুন' : 'Install Mobile App'}</span>
        </button>
      ) : variant === 'card' ? (
        <button
          onClick={handleClick}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition active:scale-95"
        >
          <Smartphone className="w-4 h-4" />
          <span>{lang === 'bn' ? 'ইনস্টল' : 'Install'}</span>
        </button>
      ) : (
        <button
          onClick={handleClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold transition shadow-sm active:scale-95 group"
          title={lang === 'bn' ? 'আপনার ফোনে বা কম্পিউটারে অ্যাপটি ইনস্টল করুন' : 'Install this app on your phone or PC'}
        >
          <Smartphone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">
            {lang === 'bn' ? 'অ্যাপ ইনস্টল' : 'Install App'}
          </span>
        </button>
      )}

      {/* iOS / Browser Installation Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4 text-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <img src="/pwa-192x192.png" alt="App Icon" className="w-8 h-8 rounded-lg shadow" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {lang === 'bn' ? 'মোবাইল অ্যাপ ইনস্টল করুন' : 'Install CashbackPro App'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Android, iPhone, iPad, PC</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <p className="font-semibold text-emerald-400">
                {lang === 'bn' ? 'আইফোন / আইপ্যাড (iPhone / Safari):' : 'For iPhone / Safari Users:'}
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                  <span>
                    Safari ব্রাউজারের নিচের <Share2 className="w-3.5 h-3.5 inline mx-1 text-indigo-400" /> <strong>Share</strong> বাটনে চাপ দিন।
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                  <span>
                    নিচে স্ক্রল করে <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" /> <strong>Add to Home Screen</strong> চাপুন।
                  </span>
                </div>
              </div>

              <p className="font-semibold text-indigo-400 pt-1">
                {lang === 'bn' ? 'অ্যান্ড্রয়েড বা ক্রোম (Android / Chrome):' : 'For Android / Chrome Users:'}
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p>
                  ব্রাউজারের ৩ ডট মেনু (<strong className="text-white">⋮</strong>) চাপুন এবং <strong className="text-white">"Install app"</strong> অথবা <strong className="text-white">"Add to Home screen"</strong> সিলেক্ট করুন।
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              {lang === 'bn' ? 'বুঝেছি / বন্ধ করুন' : 'Got it / Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
