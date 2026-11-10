import React, { useState, useEffect } from 'react';
import { Target, Plus, Minus, X } from 'lucide-react';
import { Language } from '../types';
import { I18N } from '../data/translations';
import { sound } from '../utils/audio';
import { haptic } from '../utils/haptics';

interface TargetModalProps {
  isOpen: boolean;
  mode: 'calorie' | 'weight' | null;
  currentValue: number;
  onSave: (val: number) => void;
  onClose: () => void;
  lang: Language;
  soundEnabled: boolean;
  hapticsEnabled?: boolean;
}

export const TargetModal: React.FC<TargetModalProps> = ({
  isOpen,
  mode,
  currentValue,
  onSave,
  onClose,
  lang,
  soundEnabled,
  hapticsEnabled = true,
}) => {
  const [val, setVal] = useState<string>('');
  const t = I18N[lang];

  useEffect(() => {
    if (isOpen) {
      setVal(String(currentValue));
    }
  }, [isOpen, currentValue]);

  if (!isOpen || !mode) return null;

  const isCalorie = mode === 'calorie';

  const step = (delta: number) => {
    sound.playTick(soundEnabled);
    haptic.light(hapticsEnabled);
    const curr = parseFloat(val) || 0;
    const next = Math.max(0, curr + delta);
    setVal(isCalorie ? String(Math.round(next)) : next.toFixed(1));
  };

  const handleSave = () => {
    const parsed = parseFloat(val);
    if (isCalorie) {
      if (parsed >= 1000 && parsed <= 6000) {
        sound.playSuccess(soundEnabled);
        haptic.weightLogged(hapticsEnabled);
        onSave(Math.round(parsed));
        onClose();
      } else {
        alert(lang === 'tr' ? 'Lütfen 1000 ile 6000 arasında geçerli bir kalori girin.' : 'Please enter calories between 1000 and 6000.');
      }
    } else {
      if (parsed >= 35 && parsed <= 250) {
        sound.playSuccess(soundEnabled);
        haptic.weightLogged(hapticsEnabled);
        onSave(parseFloat(parsed.toFixed(1)));
        onClose();
      } else {
        alert(lang === 'tr' ? 'Lütfen 35 ile 250 kg arasında geçerli bir kilo girin.' : 'Please enter weight between 35 and 250 kg.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#101926] border-2 border-[#759667] rounded-3xl p-6 shadow-2xl text-[#d4dde8]">
        <div className="flex items-center justify-between pb-3 border-b border-[#1a273b]">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#759667]" />
            <h2 className="text-base font-black text-[#e2eaf4]">
              {isCalorie ? (lang === 'tr' ? "Hedef Kalori Ayarla" : "Set Target Calories") : (lang === 'tr' ? "Hedef Kilo Ayarla" : "Set Target Weight")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#7e91ac] hover:text-white rounded-xl bg-[#0b121b] border border-[#1a273b]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#7e91ac] mt-3 mb-4">
          {isCalorie
            ? (lang === 'tr' ? "Günlük almak istediğiniz kalori miktarını (kcal) girin:" : "Enter your daily caloric goal (kcal):")
            : (lang === 'tr' ? "Ulaşmak istediğiniz hedef kilonuzu (kg) girin:" : "Enter your target weight (kg):")}
        </p>

        {/* Stepper container */}
        <div className="flex items-center bg-[#0b121b] border-2 border-[#759667]/50 rounded-2xl overflow-hidden mb-5">
          <button
            type="button"
            onClick={() => step(isCalorie ? -50 : -0.5)}
            className="w-14 h-14 flex items-center justify-center text-[#759667] hover:bg-[#759667]/15 active:bg-[#759667] active:text-[#060a0f] transition text-xl font-bold"
          >
            <Minus className="w-5 h-5" />
          </button>

          <input
            type="number"
            step={isCalorie ? "10" : "0.1"}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="flex-1 bg-transparent text-center text-2xl font-black text-[#759667] outline-none"
          />

          <button
            type="button"
            onClick={() => step(isCalorie ? 50 : 0.5)}
            className="w-14 h-14 flex items-center justify-center text-[#759667] hover:bg-[#759667]/15 active:bg-[#759667] active:text-[#060a0f] transition text-xl font-bold"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#1a273b] hover:border-[#7e91ac] text-xs font-bold text-[#7e91ac] transition"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#759667] hover:bg-[#92b683] text-[#060a0f] text-xs font-black transition active:scale-95 shadow-md shadow-[#759667]/20"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};
