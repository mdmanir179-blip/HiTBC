import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC<{ lang: 'bn' | 'en' }> = ({ lang }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-full bg-amber-500/95 text-slate-950 px-4 py-2 text-xs font-bold shadow-2xl backdrop-blur-md border border-amber-400 animate-in slide-in-from-top duration-300">
      <WifiOff className="w-4 h-4 text-slate-950 animate-pulse" />
      <span>
        {lang === 'bn' 
          ? 'অফলাইন মোড — ক্যাশ করা ডাটা ব্যবহার করা হচ্ছে।' 
          : 'Offline Mode — Cached data is being used.'}
      </span>
    </div>
  );
};
