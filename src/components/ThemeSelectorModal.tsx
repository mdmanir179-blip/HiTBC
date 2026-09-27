import React from 'react';
import { X, Check, Palette, Sparkles, Sun, Moon, Smartphone } from 'lucide-react';
import { ScreenTheme, THEME_OPTIONS, ThemeOption } from '../types/theme';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ScreenTheme;
  onSelectTheme: (theme: ScreenTheme) => void;
  lang: 'bn' | 'en';
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Palette className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {lang === 'bn' ? 'স্ক্রিন কালার ও থিম পরিবর্তন' : 'Screen Color & Theme Settings'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'আপনার পছন্দের স্ক্রিন কালার ও ব্যাকগ্রাউন্ড বেছে নিন' : 'Customize background, cards, and accent colors'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Theme Grid */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {lang === 'bn' ? 'থিম প্যালেটসমূহ (৭টি প্রিমিয়াম কালার):' : 'Available Palettes (7 Premium Colors):'}
            </span>
            <span className="text-[11px] text-indigo-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === 'bn' ? 'রিয়েল-টাইম প্রিভিউ' : 'Instant Live Preview'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {THEME_OPTIONS.map((theme: ThemeOption) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => onSelectTheme(theme.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg scale-[1.01]'
                      : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                  style={{
                    backgroundColor: theme.bgColor,
                  }}
                >
                  <div className="space-y-2.5 w-full">
                    
                    {/* Top Row: Swatch & Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Circle Swatch */}
                        <div
                          className="w-5 h-5 rounded-full border-2 border-white/40 shadow-sm shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: theme.primaryColor }}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                        </div>
                        <span className={`font-bold text-sm ${theme.isLight ? 'text-slate-900' : 'text-white'}`}>
                          {lang === 'bn' ? theme.nameBn : theme.name}
                        </span>
                      </div>

                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${theme.primaryColor}25`,
                          color: theme.primaryColor,
                          border: `1px solid ${theme.primaryColor}40`,
                        }}
                      >
                        {theme.badge}
                      </span>
                    </div>

                    {/* Subtitle / Description */}
                    <p className={`text-[11px] line-clamp-1 ${theme.isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {lang === 'bn' ? theme.descriptionBn : theme.description}
                    </p>

                    {/* Mini UI Card Preview Simulation */}
                    <div
                      className="p-2.5 rounded-xl border flex items-center justify-between"
                      style={{
                        backgroundColor: theme.cardColor,
                        borderColor: isSelected ? theme.primaryColor : 'rgba(255,255,255,0.1)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <div className="space-y-1">
                          <div
                            className="w-16 h-1.5 rounded-full"
                            style={{ backgroundColor: theme.isLight ? '#94a3b8' : '#475569' }}
                          />
                          <div
                            className="w-10 h-1 rounded-full"
                            style={{ backgroundColor: theme.isLight ? '#cbd5e1' : '#334155' }}
                          />
                        </div>
                      </div>

                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: theme.primaryColor,
                          color: theme.isLight ? '#ffffff' : '#000000',
                        }}
                      >
                        100%
                      </span>
                    </div>

                  </div>

                </button>
              );
            })}
          </div>

          {/* Quick Helper Tips */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              {lang === 'bn' ? 'স্বয়ংক্রিয় সেভ ও মোবাইল ম্যাচিং:' : 'Auto-Save & Mobile Matching:'}
            </p>
            <p>
              {lang === 'bn'
                ? 'আপনার নির্বাচিত স্ক্রিন কালার ব্রাউজার এবং ইনস্টল করা মোবাইল অ্যাপে স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকবে।'
                : 'Your chosen screen color will persist across reloads and synchronize with your installed mobile app title bar.'}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {lang === 'bn' ? 'বর্তমান কালার:' : 'Active Color:'}{' '}
            <strong className="text-white capitalize">{currentTheme}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/30"
          >
            {lang === 'bn' ? 'প্রয়োগ সম্পন্ন' : 'Apply & Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
