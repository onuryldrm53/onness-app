import React from 'react';
import { Settings, Globe, WifiOff } from 'lucide-react';
import { Language } from '../types';
import { I18N } from '../data/translations';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  onOpenSettings: () => void;
  onNavigateHome: () => void;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  onOpenSettings,
  onNavigateHome,
  isOnline,
}) => {
  const t = I18N[lang];

  return (
    <header className="sticky top-0 z-40 bg-[#060a0f]/95 backdrop-blur-xl border-b border-[#1b281d] px-3 sm:px-4 py-2.5 safe-top transition-all">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div
          onClick={onNavigateHome}
          className="cursor-pointer select-none flex items-center gap-0.5 group shrink-0"
        >
          <span className="text-lg sm:text-xl font-black tracking-widest text-[#e2eaf4] group-hover:text-white transition">
            ONNESS
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#759667] leading-none drop-shadow-[0_0_8px_rgba(117,150,103,0.5)]">
            .
          </span>
        </div>

        {/* Right Actions - Mobile optimized with shrink protection */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Offline warning */}
          {!isOnline && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold">
              <WifiOff className="w-3 h-3" />
              <span>Offline</span>
            </div>
          )}

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[#0b121b] border border-[#1a273b] hover:border-[#759667] text-[#e2eaf4] text-[11px] sm:text-xs font-black transition active:scale-95"
            title="Dili Değiştir / Change Language"
          >
            <Globe className="w-3 h-3 text-[#759667] shrink-0" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl bg-[#0b121b] border border-[#1a273b] hover:border-[#759667] text-[#7e91ac] hover:text-[#e2eaf4] transition active:scale-95 shrink-0"
            title={t.settings}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
