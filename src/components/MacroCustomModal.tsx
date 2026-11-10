import React, { useState, useEffect } from 'react';
import { PieChart, Plus, Minus, Check, X, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Language, MacroSplit } from '../types';
import { I18N } from '../data/translations';
import { sound } from '../utils/audio';
import {
  MACRO_PRESETS,
  calculateMacroGramTargets,
  calculateMacroCalories,
  autoBalanceMacroSplit,
} from '../utils/macroCalculator';

interface MacroCustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCalories: number;
  currentSplit: MacroSplit;
  onSave: (split: MacroSplit) => void;
  lang: Language;
  soundEnabled: boolean;
}

export const MacroCustomModal: React.FC<MacroCustomModalProps> = ({
  isOpen,
  onClose,
  targetCalories,
  currentSplit,
  onSave,
  lang,
  soundEnabled,
}) => {
  const [split, setSplit] = useState<MacroSplit>(currentSplit);
  const t = I18N[lang];

  useEffect(() => {
    if (isOpen) {
      setSplit(currentSplit);
    }
  }, [isOpen, currentSplit]);

  if (!isOpen) return null;

  const totalPercentage = split.protein + split.carbs + split.fat;
  const isSumValid = totalPercentage === 100;
  const grams = calculateMacroGramTargets(targetCalories, split);
  const calories = calculateMacroCalories(targetCalories, split);

  const stepMacro = (key: keyof MacroSplit, delta: number) => {
    sound.playTick(soundEnabled);
    setSplit(prev => {
      const nextVal = Math.max(0, Math.min(100, prev[key] + delta));
      return { ...prev, [key]: nextVal };
    });
  };

  const setRangeVal = (key: keyof MacroSplit, val: number) => {
    setSplit(prev => ({ ...prev, [key]: val }));
  };

  const handleApplyPreset = (presetSplit: MacroSplit) => {
    sound.playSuccess(soundEnabled);
    setSplit(presetSplit);
  };

  const handleAutoBalance = () => {
    sound.playTick(soundEnabled);
    // Adjust carbs or fat to balance out to 100%
    setSplit(prev => autoBalanceMacroSplit(prev, 'carbs'));
  };

  const handleSave = () => {
    if (!isSumValid) {
      alert(t.mustEqual100);
      return;
    }
    sound.playSuccess(soundEnabled);
    onSave(split);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md max-h-[92vh] flex flex-col bg-[#101926] border-2 border-[#759667] rounded-3xl p-4 sm:p-6 shadow-2xl text-[#d4dde8] custom-scroll overflow-y-auto touch-pan-y overscroll-contain">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1a273b]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#759667]/20 border border-[#759667] flex items-center justify-center text-[#759667] shrink-0">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#e2eaf4]">
                {t.macroCustomModalTitle}
              </h2>
              <div className="text-[11px] font-bold text-[#759667]">
                {targetCalories} kcal / {lang === 'tr' ? 'günlük hedef' : 'daily target'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7e91ac] hover:text-white rounded-xl bg-[#0b121b] border border-[#1a273b] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[11px] sm:text-xs text-[#7e91ac] mt-3 mb-2.5">
          {t.macroCustomModalDesc}
        </p>

        {/* Quick Presets */}
        <div className="mb-3.5">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#7e91ac] mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#759667]" />
            <span>{t.macroPresets}</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {MACRO_PRESETS.map((preset) => {
              const isSelected =
                split.protein === preset.split.protein &&
                split.carbs === preset.split.carbs &&
                split.fat === preset.split.fat;

              return (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.split)}
                  className={`p-2 rounded-xl text-left border transition active:scale-95 ${
                    isSelected
                      ? 'bg-[#759667]/20 border-[#759667] text-[#92b683] shadow-[0_0_8px_rgba(117,150,103,0.2)]'
                      : 'bg-[#0b121b] border-[#1a273b] text-[#7e91ac] hover:border-[#759667]/50'
                  }`}
                >
                  <div className="text-[11px] font-black leading-tight text-[#e2eaf4]">
                    {t[preset.nameKey as keyof typeof t] as string}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Macro Controls (Protein, Carbs, Fat) */}
        <div className="space-y-3 mb-4">
          {/* 1. Protein */}
          <div className="p-3 rounded-2xl bg-[#0b121b] border border-[#1b281d] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-[#759667] uppercase tracking-wider">
                  {t.protein} (4 kcal/g)
                </span>
                <div className="text-[11px] text-[#7e91ac]">
                  {calories.proteinCalories} kcal
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-sm sm:text-base font-black text-[#e2eaf4]">
                    {grams.proteinGrams}g
                  </span>
                  <span className="text-xs font-black text-[#759667] ml-1">
                    (%{split.protein})
                  </span>
                </div>

                <div className="flex items-center bg-[#101926] border border-[#1a273b] rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => stepMacro('protein', -5)}
                    className="w-8 h-8 flex items-center justify-center text-[#759667] hover:bg-[#759667]/15 font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => stepMacro('protein', 5)}
                    className="w-8 h-8 flex items-center justify-center text-[#759667] hover:bg-[#759667]/15 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <input
              type="range"
              min={5}
              max={70}
              step={1}
              value={split.protein}
              onChange={(e) => setRangeVal('protein', parseInt(e.target.value, 10))}
              className="w-full accent-[#759667] h-1.5 bg-[#101926] rounded-lg cursor-pointer"
            />
          </div>

          {/* 2. Carbs */}
          <div className="p-3 rounded-2xl bg-[#0b121b] border border-[#1b281d] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-[#7fa890] uppercase tracking-wider">
                  {t.carbs} (4 kcal/g)
                </span>
                <div className="text-[11px] text-[#7e91ac]">
                  {calories.carbsCalories} kcal
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-sm sm:text-base font-black text-[#e2eaf4]">
                    {grams.carbsGrams}g
                  </span>
                  <span className="text-xs font-black text-[#7fa890] ml-1">
                    (%{split.carbs})
                  </span>
                </div>

                <div className="flex items-center bg-[#101926] border border-[#1a273b] rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => stepMacro('carbs', -5)}
                    className="w-8 h-8 flex items-center justify-center text-[#7fa890] hover:bg-[#7fa890]/15 font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => stepMacro('carbs', 5)}
                    className="w-8 h-8 flex items-center justify-center text-[#7fa890] hover:bg-[#7fa890]/15 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <input
              type="range"
              min={5}
              max={75}
              step={1}
              value={split.carbs}
              onChange={(e) => setRangeVal('carbs', parseInt(e.target.value, 10))}
              className="w-full accent-[#7fa890] h-1.5 bg-[#101926] rounded-lg cursor-pointer"
            />
          </div>

          {/* 3. Fat */}
          <div className="p-3 rounded-2xl bg-[#0b121b] border border-[#1b281d] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-[#53704b] uppercase tracking-wider">
                  {t.fat} (9 kcal/g)
                </span>
                <div className="text-[11px] text-[#7e91ac]">
                  {calories.fatCalories} kcal
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-sm sm:text-base font-black text-[#e2eaf4]">
                    {grams.fatGrams}g
                  </span>
                  <span className="text-xs font-black text-[#53704b] ml-1">
                    (%{split.fat})
                  </span>
                </div>

                <div className="flex items-center bg-[#101926] border border-[#1a273b] rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => stepMacro('fat', -5)}
                    className="w-8 h-8 flex items-center justify-center text-[#53704b] hover:bg-[#53704b]/15 font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => stepMacro('fat', 5)}
                    className="w-8 h-8 flex items-center justify-center text-[#53704b] hover:bg-[#53704b]/15 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <input
              type="range"
              min={5}
              max={75}
              step={1}
              value={split.fat}
              onChange={(e) => setRangeVal('fat', parseInt(e.target.value, 10))}
              className="w-full accent-[#53704b] h-1.5 bg-[#101926] rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Total Validation & Auto-Balance Bar */}
        <div
          className={`p-3 rounded-2xl border flex items-center justify-between gap-2 mb-4 transition ${
            isSumValid
              ? 'bg-[#759667]/15 border-[#759667] text-[#92b683]'
              : 'bg-[#ef4444]/15 border-[#ef4444] text-[#ef4444]'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {isSumValid ? (
              <Check className="w-4 h-4 shrink-0 text-[#759667]" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-[#ef4444]" />
            )}
            <div className="text-xs font-bold truncate">
              <span>{t.totalPercentage}: </span>
              <span className="font-black text-sm">%{totalPercentage}</span>
              {!isSumValid && (
                <span className="ml-1 text-[11px] opacity-90">
                  ({totalPercentage > 100 ? `+%${totalPercentage - 100}` : `-%${100 - totalPercentage}`})
                </span>
              )}
            </div>
          </div>

          {!isSumValid && (
            <button
              onClick={handleAutoBalance}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#0b121b] border border-[#ef4444]/50 hover:border-[#759667] text-[#e2eaf4] text-[11px] font-black transition active:scale-95 shrink-0"
            >
              <RefreshCw className="w-3 h-3 text-[#759667]" />
              <span>{t.autoBalance}</span>
            </button>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1a273b]">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#1a273b] hover:border-[#7e91ac] text-xs font-bold text-[#7e91ac] transition"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            disabled={!isSumValid}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-black transition active:scale-95 shadow-md ${
              isSumValid
                ? 'bg-[#759667] hover:bg-[#92b683] text-[#060a0f] shadow-[#759667]/20 cursor-pointer'
                : 'bg-[#7e91ac]/20 text-[#7e91ac] cursor-not-allowed border border-[#1a273b]'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{t.save}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
