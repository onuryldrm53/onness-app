import React from 'react';
import { Home, Dumbbell, UtensilsCrossed, TrendingUp, Settings } from 'lucide-react';
import { ScreenId, Language } from '../types';
import { I18N } from '../data/translations';
import { sound, SoundTheme } from '../utils/audio';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenSettings: () => void;
  lang: Language;
  soundEnabled: boolean;
  soundTheme?: SoundTheme;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  onOpenSettings,
  lang,
  soundEnabled,
  soundTheme = 'ios',
}) => {
  const t = I18N[lang];

  const handleNav = (screen: ScreenId) => {
    sound.playTick(soundEnabled, soundTheme);
    onNavigate(screen);
  };

  const isWorkoutActive = currentScreen === 'workout' || currentScreen === 'workout-detail' || currentScreen === 'exercise-single';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#060a0f]/95 backdrop-blur-xl border-t border-[#1b281d] safe-bottom transition-all select-none">
      <div className="max-w-xl mx-auto grid grid-cols-5 py-1.5 px-0.5">
        {/* Hub / Home */}
        <button
          onClick={() => handleNav('hub')}
          className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition active:scale-90 ${
            currentScreen === 'hub' ? 'text-[#759667]' : 'text-[#7e91ac] hover:text-[#d4dde8]'
          }`}
        >
          <Home className="w-5 h-5 shrink-0" />
          <span className="text-[10px] font-bold tracking-tight truncate w-full text-center">
            {t.home}
          </span>
        </button>

        {/* Workout */}
        <button
          onClick={() => handleNav('workout')}
          className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition active:scale-90 ${
            isWorkoutActive ? 'text-[#759667]' : 'text-[#7e91ac] hover:text-[#d4dde8]'
          }`}
        >
          <Dumbbell className="w-5 h-5 shrink-0" />
          <span className="text-[10px] font-bold tracking-tight truncate w-full text-center">
            {lang === 'tr' ? 'Spor' : 'Workout'}
          </span>
        </button>

        {/* Nutrition */}
        <button
          onClick={() => handleNav('nutrition')}
          className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition active:scale-90 ${
            currentScreen === 'nutrition' ? 'text-[#759667]' : 'text-[#7e91ac] hover:text-[#d4dde8]'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5 shrink-0" />
          <span className="text-[10px] font-bold tracking-tight truncate w-full text-center">
            {lang === 'tr' ? 'Beslenme' : 'Nutrition'}
          </span>
        </button>

        {/* Weight Graph */}
        <button
          onClick={() => handleNav('weight-graph')}
          className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition active:scale-90 ${
            currentScreen === 'weight-graph' ? 'text-[#759667]' : 'text-[#7e91ac] hover:text-[#d4dde8]'
          }`}
        >
          <TrendingUp className="w-5 h-5 shrink-0" />
          <span className="text-[10px] font-bold tracking-tight truncate w-full text-center">
            {lang === 'tr' ? 'Grafik' : 'Chart'}
          </span>
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            sound.playTick(soundEnabled, soundTheme);
            onOpenSettings();
          }}
          className="flex flex-col items-center justify-center gap-1 py-1 rounded-xl text-[#7e91ac] hover:text-[#d4dde8] transition active:scale-90"
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span className="text-[10px] font-bold tracking-tight truncate w-full text-center">
            {t.settings}
          </span>
        </button>
      </div>
    </nav>
  );
};
