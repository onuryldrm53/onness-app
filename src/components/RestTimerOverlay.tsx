import React, { useEffect } from 'react';
import { Timer, Plus, Minus, X } from 'lucide-react';
import { sound, SoundTheme } from '../utils/audio';
import { haptic } from '../utils/haptics';
import { Language } from '../types';
import { I18N } from '../data/translations';
import { SoundWaveVisualizer } from './SoundWaveVisualizer';

interface RestTimerOverlayProps {
  isOpen: boolean;
  secondsRemaining: number;
  onModify: (delta: number) => void;
  onClose: () => void;
  lang: Language;
  soundEnabled: boolean;
  soundTheme?: SoundTheme;
  hapticsEnabled?: boolean;
}

export const RestTimerOverlay: React.FC<RestTimerOverlayProps> = ({
  isOpen,
  secondsRemaining,
  onModify,
  onClose,
  lang,
  soundEnabled,
  soundTheme = 'ios',
  hapticsEnabled = true,
}) => {
  const t = I18N[lang];

  useEffect(() => {
    if (!isOpen) return;
    if (secondsRemaining <= 3 && secondsRemaining > 0) {
      sound.playCountdownWarning(soundEnabled, soundTheme);
      haptic.light(hapticsEnabled);
    } else if (secondsRemaining === 0) {
      sound.playRestDone(soundEnabled, soundTheme);
      haptic.restTimerDone(hapticsEnabled);
    }
  }, [isOpen, secondsRemaining, soundEnabled, soundTheme, hapticsEnabled]);

  if (!isOpen) return null;

  const m = Math.floor(secondsRemaining / 60);
  const s = secondsRemaining % 60;
  const timeStr = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;

  return (
    <div className="fixed bottom-20 sm:bottom-24 left-3 right-3 sm:left-4 sm:right-4 z-40 max-w-md mx-auto bg-[#0a1122]/95 border-2 border-[#759667] rounded-2xl p-3 sm:p-4 shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_24px_rgba(117,150,103,0.25)] backdrop-blur-xl flex items-center justify-between animate-slideUp">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#759667]/20 border border-[#759667] flex items-center justify-center text-[#759667] shrink-0 relative overflow-hidden">
          <Timer className="w-5 h-5 relative z-10" />
          <div className="absolute inset-0 bg-[#759667]/15 animate-ping" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#7e91ac]">
              {t.restTimerLabel}
            </span>
            {soundEnabled && (
              <SoundWaveVisualizer size="sm" barColor="bg-[#759667]" />
            )}
          </div>
          <span className="text-xl sm:text-2xl font-black text-[#759667] tracking-wider font-mono leading-none">
            {timeStr}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => {
            sound.playTick(soundEnabled, soundTheme);
            onModify(-15);
          }}
          className="p-2 rounded-lg bg-[#0b121b] border border-[#1a273b] hover:border-[#759667] text-[#e2eaf4] text-xs font-bold transition active:scale-90"
          title="-15s"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            sound.playTick(soundEnabled, soundTheme);
            onModify(15);
          }}
          className="p-2 rounded-lg bg-[#0b121b] border border-[#1a273b] hover:border-[#759667] text-[#e2eaf4] text-xs font-bold transition active:scale-90"
          title="+15s"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            sound.playTick(soundEnabled, soundTheme);
            onClose();
          }}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-lg bg-[#ef4444] text-white text-xs font-black hover:bg-[#dc2626] transition active:scale-95 shadow-md shadow-[#ef4444]/20"
        >
          <X className="w-3.5 h-3.5" />
          <span>{t.finishRest}</span>
        </button>
      </div>
    </div>
  );
};
