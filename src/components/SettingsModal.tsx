import React from 'react';
import { Settings, Volume2, Clock, Trash2, X, Vibrate, Sparkles } from 'lucide-react';
import { Language, AppSettings, SoundTheme } from '../types';
import { I18N } from '../data/translations';
import { sound } from '../utils/audio';
import { haptic } from '../utils/haptics';
import { SoundWaveVisualizer } from './SoundWaveVisualizer';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSetLang: (lang: Language) => void;
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSetLang,
  settings,
  onUpdateSettings,
  onResetAllData,
}) => {
  const t = I18N[lang];
  const currentTheme: SoundTheme = settings.soundTheme || 'ios';

  if (!isOpen) return null;

  const handleTestSound = (type: 'tap' | 'success' | 'warning' | 'finish') => {
    const hapticsActive = settings.haptics !== false;
    if (type === 'tap') {
      sound.playTick(true, currentTheme);
      haptic.light(hapticsActive);
    } else if (type === 'success') {
      sound.playSuccess(true, currentTheme);
      haptic.setCompleted(hapticsActive);
    } else if (type === 'warning') {
      sound.playCountdownWarning(true, currentTheme);
      haptic.light(hapticsActive);
    } else if (type === 'finish') {
      sound.playRestDone(true, currentTheme);
      haptic.restTimerDone(hapticsActive);
    }
  };

  const handleSelectTheme = (theme: SoundTheme) => {
    onUpdateSettings({ soundTheme: theme });
    sound.playTick(settings.sound, theme);
    haptic.light(settings.haptics !== false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm max-h-[92vh] overflow-y-auto bg-[#101926] border-2 border-[#759667] rounded-3xl p-4 sm:p-6 shadow-2xl text-[#d4dde8] no-scrollbar touch-pan-y overscroll-contain">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1a273b]">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#759667]" />
            <h2 className="text-base font-black text-[#e2eaf4]">
              {t.appSettingsTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#7e91ac] hover:text-white rounded-xl bg-[#0b121b] border border-[#1a273b] active:scale-95 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Setting: Language */}
        <div className="flex items-center justify-between py-3.5 border-b border-[#1a273b]">
          <div>
            <div className="text-xs font-extrabold text-[#e2eaf4]">{t.languageSetting}</div>
            <div className="text-[11px] text-[#7e91ac]">{t.languageSettingDesc}</div>
          </div>
          <select
            value={lang}
            onChange={(e) => onSetLang(e.target.value as Language)}
            className="bg-[#0b121b] border border-[#1a273b] text-[#759667] font-bold text-xs rounded-xl px-2.5 py-1.5 focus:border-[#759667] outline-none"
          >
            <option value="tr">Türkçe (TR)</option>
            <option value="en">English (EN)</option>
          </select>
        </div>

        {/* Setting: Sound Toggle */}
        <div className="flex items-center justify-between py-3.5 border-b border-[#1a273b]">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#759667]" />
            <div>
              <div className="text-xs font-extrabold text-[#e2eaf4]">{t.soundEffects}</div>
              <div className="text-[11px] text-[#7e91ac]">{t.soundEffectsDesc}</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={(e) => {
                const nextSound = e.target.checked;
                onUpdateSettings({ sound: nextSound });
                if (nextSound) sound.playTick(true, currentTheme);
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#0b121b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#759667] border border-[#1a273b]"></div>
          </label>
        </div>

        {/* Sound Theme & Live Visualizer Animation Studio */}
        {settings.sound && (
          <div className="py-3 border-b border-[#1a273b] space-y-2.5 bg-[#0b121b]/60 rounded-2xl p-3 my-2 border border-[#1a273b]/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#e2eaf4] block">
                  {t.soundThemeTitle}
                </span>
                <span className="text-[10px] text-[#7e91ac]">
                  {t.soundThemeDesc}
                </span>
              </div>
              {/* Dynamic Sound Wave animation indicator */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#101926] border border-[#1a273b]">
                <SoundWaveVisualizer size="sm" barColor="bg-[#759667]" />
                <span className="text-[10px] font-mono font-bold text-[#759667]">LIVE</span>
              </div>
            </div>

            {/* Theme Pills */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleSelectTheme('ios')}
                className={`px-2 py-1.5 rounded-xl text-[11px] font-bold text-center transition active:scale-95 border ${
                  currentTheme === 'ios'
                    ? 'bg-[#759667]/20 border-[#759667] text-[#759667]'
                    : 'bg-[#101926] border-[#1a273b] text-[#7e91ac] hover:text-[#d4dde8]'
                }`}
              >
                {t.themeIos}
              </button>
              <button
                onClick={() => handleSelectTheme('marimba')}
                className={`px-2 py-1.5 rounded-xl text-[11px] font-bold text-center transition active:scale-95 border ${
                  currentTheme === 'marimba'
                    ? 'bg-[#759667]/20 border-[#759667] text-[#759667]'
                    : 'bg-[#101926] border-[#1a273b] text-[#7e91ac] hover:text-[#d4dde8]'
                }`}
              >
                {t.themeMarimba}
              </button>
              <button
                onClick={() => handleSelectTheme('minimal')}
                className={`px-2 py-1.5 rounded-xl text-[11px] font-bold text-center transition active:scale-95 border ${
                  currentTheme === 'minimal'
                    ? 'bg-[#759667]/20 border-[#759667] text-[#759667]'
                    : 'bg-[#101926] border-[#1a273b] text-[#7e91ac] hover:text-[#d4dde8]'
                }`}
              >
                {t.themeMinimal}
              </button>
            </div>

            {/* Sound Wave Animation & Interactive Test Buttons */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7e91ac] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#759667]" />
                  {t.soundPreviewTitle}
                </span>
                <SoundWaveVisualizer size="md" barColor="bg-[#759667]" />
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleTestSound('tap')}
                  className="px-2.5 py-2 rounded-xl bg-[#101926] border border-[#1a273b] hover:border-[#759667] text-[#e2eaf4] text-[11px] font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <span className="w-2 h-2 rounded-full bg-[#759667]" />
                  {t.testTap}
                </button>
                <button
                  onClick={() => handleTestSound('success')}
                  className="px-2.5 py-2 rounded-xl bg-[#101926] border border-[#1a273b] hover:border-[#759667] text-[#e2eaf4] text-[11px] font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {t.testSuccess}
                </button>
                <button
                  onClick={() => handleTestSound('warning')}
                  className="px-2.5 py-2 rounded-xl bg-[#101926] border border-[#1a273b] hover:border-[#759667] text-[#e2eaf4] text-[11px] font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  {t.testWarning}
                </button>
                <button
                  onClick={() => handleTestSound('finish')}
                  className="px-2.5 py-2 rounded-xl bg-[#101926] border border-[#1a273b] hover:border-[#759667] text-[#e2eaf4] text-[11px] font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  {t.testFinish}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Setting: Haptic Feedback (iPhone Vibration) */}
        <div className="flex items-center justify-between py-3.5 border-b border-[#1a273b]">
          <div className="flex items-center gap-2">
            <Vibrate className="w-4 h-4 text-[#759667]" />
            <div>
              <div className="text-xs font-extrabold text-[#e2eaf4]">{t.hapticFeedback}</div>
              <div className="text-[11px] text-[#7e91ac]">{t.hapticFeedbackDesc}</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.haptics !== false}
              onChange={(e) => {
                const nextState = e.target.checked;
                onUpdateSettings({ haptics: nextState });
                if (nextState) haptic.setCompleted(true);
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#0b121b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#759667] border border-[#1a273b]"></div>
          </label>
        </div>

        {/* Setting: Rest Duration */}
        <div className="flex items-center justify-between py-3.5 border-b border-[#1a273b]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#759667]" />
            <div>
              <div className="text-xs font-extrabold text-[#e2eaf4]">{t.restTimeTitle}</div>
              <div className="text-[11px] text-[#7e91ac]">{t.restTimeDesc}</div>
            </div>
          </div>
          <select
            value={settings.defaultRest}
            onChange={(e) => onUpdateSettings({ defaultRest: parseInt(e.target.value, 10) })}
            className="bg-[#0b121b] border border-[#1a273b] text-[#759667] font-bold text-xs rounded-xl px-2.5 py-1.5 focus:border-[#759667] outline-none"
          >
            <option value="30">30 sn</option>
            <option value="45">45 sn</option>
            <option value="60">60 sn</option>
            <option value="90">90 sn</option>
          </select>
        </div>

        {/* Setting: Data Reset */}
        <div className="flex items-center justify-between py-3.5">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-[#ef4444]" />
            <div>
              <div className="text-xs font-extrabold text-[#ef4444]">{t.dataManagement}</div>
              <div className="text-[11px] text-[#7e91ac]">
                {lang === 'tr' ? "Tamamlanan tüm setleri temizle" : "Reset all completed sets"}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm(t.resetAllConfirm)) {
                onResetAllData();
                onClose();
              }
            }}
            className="px-3 py-1.5 rounded-xl border border-[#ef4444]/40 hover:bg-[#ef4444]/15 text-[#ef4444] text-xs font-bold transition active:scale-95"
          >
            {lang === 'tr' ? "Sıfırla" : "Reset"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-xl bg-[#759667] hover:bg-[#92b683] text-[#060a0f] font-black text-sm transition active:scale-98 shadow-lg shadow-[#759667]/20"
        >
          {t.done}
        </button>
      </div>
    </div>
  );
};
