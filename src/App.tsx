import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Dumbbell,
  UtensilsCrossed,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Play,
  Check,
  RotateCcw,
  Plus,
  Minus,
  Trash2,
  TrendingUp,
  FileText,
  Calendar,
  Flame,
  Scale,
  Sparkles,
  Sliders,
  PieChart
} from 'lucide-react';

import {
  Language,
  WorkoutDifficulty,
  ScreenId,
  MealItem,
  WeightRecord,
  AppSettings,
  Exercise,
  WorkoutDay,
  MacroSplit,
  MacroGramTargets
} from './types';

import { I18N } from './data/translations';
import {
  getProgramData,
  getScaledExerciseMetrics,
  getEstimatedDayDuration,
  EXERCISE_SPECIFIC_NOTES
} from './data/workoutData';

import { sound } from './utils/audio';
import { haptic } from './utils/haptics';
import { usePWA } from './hooks/usePWA';
import { calculateMacroGramTargets } from './utils/macroCalculator';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { RestTimerOverlay } from './components/RestTimerOverlay';
import { SettingsModal } from './components/SettingsModal';
import { TargetModal } from './components/TargetModal';
import { FavoriteMealsModal } from './components/FavoriteMealsModal';
import { MediaModal } from './components/MediaModal';
import { WeightChart } from './components/WeightChart';
import { MacroCustomModal } from './components/MacroCustomModal';
import { ExerciseVisual } from './components/ExerciseVisual';

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem('onness_' + key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem('onness_' + key, JSON.stringify(val));
  } catch {
    // ignore
  }
}

export default function App() {
  const { isOnline } = usePWA();

  // App State
  const [lang, setLang] = useState<Language>(() => loadStorage('app_lang', 'tr'));
  const [screen, setScreen] = useState<ScreenId>('hub');
  const [activeMonth, setActiveMonth] = useState<number>(() => loadStorage('active_month', 1));
  const [activeWeek, setActiveWeek] = useState<number>(() => loadStorage('active_week', 1));
  const [difficulty, setDifficulty] = useState<WorkoutDifficulty>(() => loadStorage('workout_difficulty', 'easy'));

  // Day & Exercise Navigation
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [selectedExIdx, setSelectedExIdx] = useState<number>(0);
  const [isExerciseRunning, setIsExerciseRunning] = useState<boolean>(false);

  // Completed sets store: "m{month}_w{week}_d{day}_e{ex}_s{set}" => true
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>(() => loadStorage('sets_v2', {}));
  const [userExerciseNotes, setUserExerciseNotes] = useState<Record<string, string>>(() => loadStorage('user_exercise_notes', {}));
  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>(() => loadStorage('custom_exercise_photos', {}));

  // Nutrition & Weights
  const [targetCalories, setTargetCalories] = useState<number>(() => loadStorage('target_calories', 2100));
  const [macroSplit, setMacroSplit] = useState<MacroSplit>(() => loadStorage('macro_split', { protein: 30, carbs: 45, fat: 25 }));
  const [isMacroModalOpen, setIsMacroModalOpen] = useState<boolean>(false);
  const [targetWeight, setTargetWeight] = useState<number>(() => loadStorage('target_weight', 75.0));
  const [loggedMeals, setLoggedMeals] = useState<MealItem[]>(() => loadStorage('meals_v2', [
    { cat: "Kahvaltı", desc: "Yulaf & Muz & Fıstık Ezmesi", cal: 420, protein: 16 }
  ]));
  const [favoriteMeals, setFavoriteMeals] = useState<MealItem[]>(() => loadStorage('favorite_meals_custom', [
    { cat: "Kahvaltı", desc: "Yulaf & Muz & Fıstık Ezmesi", cal: 420, protein: 16 },
    { cat: "Öğle", desc: "Tavuk Göğsü & Pirinç Pilavı", cal: 480, protein: 45 }
  ]));
  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>(() => loadStorage('weights_v2', [
    { date: "1 Eki", weight: 81.2 },
    { date: "8 Eki", weight: 80.4 },
    { date: "15 Eki", weight: 79.5 },
    { date: "22 Eki", weight: 78.8 }
  ]));
  const [quickWeightInput, setQuickWeightInput] = useState<string>('');
  const [weightPage, setWeightPage] = useState<number>(1);
  const WEIGHTS_PER_PAGE = 8;

  // Meal Form
  const [newMealCat, setNewMealCat] = useState<string>('Kahvaltı');
  const [newMealDesc, setNewMealDesc] = useState<string>('');
  const [newMealCal, setNewMealCal] = useState<string>('');
  const [newMealProt, setNewMealProt] = useState<string>('');
  const [newMealCarb, setNewMealCarb] = useState<string>('');
  const [newMealFat, setNewMealFat] = useState<string>('');

  // App Settings
  const [settings, setSettings] = useState<AppSettings>(() => loadStorage('app_settings', { sound: true, soundTheme: 'ios', haptics: true, defaultRest: 45 }));

  // Timers
  const [restRemaining, setRestRemaining] = useState<number>(45);
  const [isRestOpen, setIsRestOpen] = useState<boolean>(false);
  const [holdTimerSecs, setHoldTimerSecs] = useState<number | null>(null);
  const holdIntervalRef = useRef<number | null>(null);

  // Modals
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [targetModalMode, setTargetModalMode] = useState<'calorie' | 'weight' | null>(null);
  const [isFavoriteMealsModalOpen, setIsFavoriteMealsModalOpen] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);
  const [editingPhotoPostureId, setEditingPhotoPostureId] = useState<string | null>(null);

  const t = I18N[lang];

  // Save changes to localStorage
  useEffect(() => saveStorage('app_lang', lang), [lang]);
  useEffect(() => saveStorage('active_month', activeMonth), [activeMonth]);
  useEffect(() => saveStorage('active_week', activeWeek), [activeWeek]);
  useEffect(() => saveStorage('workout_difficulty', difficulty), [difficulty]);
  useEffect(() => saveStorage('sets_v2', completedSets), [completedSets]);
  useEffect(() => saveStorage('user_exercise_notes', userExerciseNotes), [userExerciseNotes]);
  useEffect(() => saveStorage('custom_exercise_photos', customPhotos), [customPhotos]);
  useEffect(() => saveStorage('target_calories', targetCalories), [targetCalories]);
  useEffect(() => saveStorage('macro_split', macroSplit), [macroSplit]);
  useEffect(() => saveStorage('target_weight', targetWeight), [targetWeight]);
  useEffect(() => saveStorage('meals_v2', loggedMeals), [loggedMeals]);
  useEffect(() => saveStorage('favorite_meals_custom', favoriteMeals), [favoriteMeals]);
  useEffect(() => saveStorage('weights_v2', weightHistory), [weightHistory]);
  useEffect(() => saveStorage('app_settings', settings), [settings]);

  // Current Program Data
  const program = getProgramData(activeMonth, activeWeek, lang);
  const currentDay: WorkoutDay | undefined = program.days[selectedDayIdx];
  const currentEx: Exercise | undefined = currentDay?.exercises[selectedExIdx];

  // Rest Timer Interval: pure tick
  useEffect(() => {
    let interval: number | null = null;
    if (isRestOpen && restRemaining > 0) {
      interval = window.setInterval(() => {
        setRestRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRestOpen, restRemaining]);

  // Auto-close rest timer after countdown finishes
  useEffect(() => {
    if (isRestOpen && restRemaining === 0) {
      const timer = window.setTimeout(() => {
        setIsRestOpen(false);
      }, 1200);
      return () => window.clearTimeout(timer);
    }
  }, [isRestOpen, restRemaining]);

  // Hold Timer Audio & Haptic alerts triggered on value change
  useEffect(() => {
    if (holdTimerSecs === null) return;
    if (holdTimerSecs <= 3 && holdTimerSecs > 0) {
      sound.playCountdownWarning(settings.sound, settings.soundTheme);
      haptic.light(settings.haptics !== false);
    } else if (holdTimerSecs === 0) {
      sound.playRestDone(settings.sound, settings.soundTheme);
      haptic.restTimerDone(settings.haptics !== false);
    }
  }, [holdTimerSecs, settings.sound, settings.soundTheme, settings.haptics]);

  // Navigation Helper
  const navigate = (toScreen: ScreenId) => {
    setScreen(toScreen);
    setIsExerciseRunning(false);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
      setHoldTimerSecs(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Rest timer triggers
  const startRest = (secs = settings.defaultRest || 45) => {
    setRestRemaining(secs);
    setIsRestOpen(true);
  };

  const modifyRest = (delta: number) => {
    setRestRemaining(prev => Math.max(5, prev + delta));
  };

  // Toggle set checkbox
  const handleToggleSet = (setKey: string, autoStartRest = false) => {
    const isDone = !!completedSets[setKey];
    setCompletedSets(prev => {
      const next = { ...prev };
      if (isDone) {
        delete next[setKey];
      } else {
        next[setKey] = true;
      }
      return next;
    });

    if (!isDone) {
      sound.playSuccess(settings.sound, settings.soundTheme);
      haptic.setCompleted(settings.haptics !== false);
      if (autoStartRest) {
        startRest(settings.defaultRest || 45);
      }
    } else {
      sound.playUntoggle(settings.sound, settings.soundTheme);
      haptic.setUnchecked(settings.haptics !== false);
    }
  };

  // Single Exercise Action: Start Set -> Finish Set & Rest
  const handleExerciseAction = (ex: Exercise, exIdx: number, nextSetNum: number) => {
    const dayKey = `m${activeMonth}_w${activeWeek}_d${selectedDayIdx}_e${exIdx}`;
    const setKey = `${dayKey}_s${nextSetNum}`;

    if (!isExerciseRunning) {
      // Start set
      setIsRestOpen(false);
      setIsExerciseRunning(true);
      sound.playTick(settings.sound);
      haptic.light(settings.haptics !== false);

      if (ex.type === 'timed') {
        const metrics = getScaledExerciseMetrics(ex, difficulty);
        const holdSecs = metrics.holdSeconds || 20;
        setHoldTimerSecs(holdSecs);

        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = window.setInterval(() => {
          setHoldTimerSecs(prev => {
            if (prev === null || prev <= 1) {
              if (holdIntervalRef.current) {
                clearInterval(holdIntervalRef.current);
                holdIntervalRef.current = null;
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      // Complete set and start rest
      setIsExerciseRunning(false);
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
        setHoldTimerSecs(null);
      }

      const isLast = nextSetNum >= ex.sets;
      handleToggleSet(setKey, !isLast);

      // Check if this was the last set of the day!
      if (isLast) {
        let unfinished = 0;
        currentDay?.exercises.forEach((item, eIdx) => {
          for (let s = 1; s <= item.sets; s++) {
            const k = `m${activeMonth}_w${activeWeek}_d${selectedDayIdx}_e${eIdx}_s${s}`;
            if (!completedSets[k] && k !== setKey) unfinished++;
          }
        });
        if (unfinished === 0) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    }
  };

  // Hold Timer Toggle for timed exercise
  const handleToggleHoldTimer = (targetSecs: number) => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
      setHoldTimerSecs(null);
      sound.playTick(settings.sound, settings.soundTheme);
    } else {
      setHoldTimerSecs(targetSecs);
      sound.playTick(settings.sound, settings.soundTheme);
      holdIntervalRef.current = window.setInterval(() => {
        setHoldTimerSecs(prev => {
          if (prev === null || prev <= 1) {
            if (holdIntervalRef.current) {
              clearInterval(holdIntervalRef.current);
              holdIntervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Week reset
  const handleExecuteResetWeek = () => {
    const prefix = `m${activeMonth}_w${activeWeek}_`;
    setCompletedSets(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        if (k.startsWith(prefix)) delete next[k];
      });
      return next;
    });
    setIsResetConfirmOpen(false);
    sound.playTick(settings.sound);
  };

  // Reset all data
  const handleResetAllData = () => {
    setCompletedSets({});
    sound.playTick(settings.sound);
  };

  // Nutrition Handlers
  const handleAddMeal = () => {
    if (!newMealDesc.trim() || !newMealCal) {
      alert(lang === 'tr' ? 'Lütfen yiyecek adı ve kalori miktarını girin.' : 'Please enter food name and calories.');
      return;
    }
    const cal = parseInt(newMealCal, 10) || 0;
    const protein = parseInt(newMealProt, 10) || 0;
    const carbs = newMealCarb ? parseInt(newMealCarb, 10) : undefined;
    const fat = newMealFat ? parseInt(newMealFat, 10) : undefined;

    setLoggedMeals(prev => [
      ...prev,
      { cat: newMealCat, desc: newMealDesc.trim(), cal, protein, carbs, fat }
    ]);
    setNewMealDesc('');
    setNewMealCal('');
    setNewMealProt('');
    setNewMealCarb('');
    setNewMealFat('');
    sound.playSuccess(settings.sound);
  };

  const handleDeleteMeal = (idx: number) => {
    setLoggedMeals(prev => prev.filter((_, i) => i !== idx));
    sound.playTick(settings.sound);
  };

  const handleQuickWeightLog = () => {
    const val = parseFloat(quickWeightInput);
    if (!val || val <= 35 || val >= 250) {
      alert(lang === 'tr' ? 'Lütfen geçerli bir kilo değeri girin (örn: 78.4)' : 'Please enter a valid weight (e.g. 78.4)');
      return;
    }
    const dateStr = new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short' });
    setWeightHistory(prev => [...prev, { date: dateStr, weight: val }]);
    setQuickWeightInput('');
    sound.playSuccess(settings.sound);
    haptic.weightLogged(settings.haptics !== false);

    if (Math.abs(val - targetWeight) <= 0.2) {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 }
      });
    }
  };

  const handleDeleteWeight = (idx: number) => {
    setWeightHistory(prev => prev.filter((_, i) => i !== idx));
    sound.playTick(settings.sound);
  };

  // Calculations for Nutrition
  const totalConsumedCal = loggedMeals.reduce((acc, m) => acc + (m.cal || 0), 0);
  const totalConsumedProtein = loggedMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const macroGramTargets = calculateMacroGramTargets(targetCalories, macroSplit);

  const totalConsumedCarbs = loggedMeals.reduce((acc, m) => {
    if (typeof m.carbs === 'number' && !isNaN(m.carbs)) {
      return acc + m.carbs;
    }
    return acc + Math.round((m.cal * (macroSplit.carbs / 100)) / 4);
  }, 0);

  const totalConsumedFat = loggedMeals.reduce((acc, m) => {
    if (typeof m.fat === 'number' && !isNaN(m.fat)) {
      return acc + m.fat;
    }
    return acc + Math.round((m.cal * (macroSplit.fat / 100)) / 9);
  }, 0);

  const remainingCal = Math.max(0, targetCalories - totalConsumedCal);
  const currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : '--';

  // Overall Week Completion Calc
  let totalWeekSets = 0;
  let doneWeekSets = 0;
  program.days.forEach((day, dIdx) => {
    day.exercises.forEach((ex, eIdx) => {
      totalWeekSets += ex.sets;
      for (let s = 1; s <= ex.sets; s++) {
        const k = `m${activeMonth}_w${activeWeek}_d${dIdx}_e${eIdx}_s${s}`;
        if (completedSets[k]) doneWeekSets++;
      }
    });
  });
  const weekPercent = totalWeekSets > 0 ? Math.round((doneWeekSets / totalWeekSets) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#060a0f] text-[#d4dde8] flex flex-col font-sans pb-32 selection:bg-[#759667]/30">
      {/* Top Header */}
      <Header
        lang={lang}
        onToggleLang={() => setLang(prev => (prev === 'tr' ? 'en' : 'tr'))}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onNavigateHome={() => navigate('hub')}
        isOnline={isOnline}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-xl w-full mx-auto px-3.5 sm:px-4 py-3 sm:py-4">
        {/* ============================================== */}
        {/* 1. MERKEZİ GİRİŞ / HUB EKRANI                  */}
        {/* ============================================== */}
        {screen === 'hub' && (
          <div className="space-y-3.5 sm:space-y-4 animate-fadeIn">
            {/* Hub Header */}
            <div className="text-center py-2 sm:py-4">
              <h1 className="text-xl sm:text-2xl font-black text-[#e2eaf4] tracking-tight">
                {t.hubTitle}
              </h1>
              <p className="text-xs text-[#7e91ac] mt-1 font-medium">
                {t.hubSubtitle}
              </p>
            </div>

            {/* Portal Cards */}
            <div className="space-y-3 sm:space-y-3.5">
              {/* SPOR PORTALI */}
              <div
                onClick={() => navigate('workout')}
                className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#101926] via-[#101926] to-[#131f18] border border-[#1b281d] hover:border-[#759667] transition-all cursor-pointer shadow-xl group active:scale-[0.985] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#759667]/15 to-transparent rounded-bl-full pointer-events-none" />
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#759667]/15 border border-[#759667] flex items-center justify-center text-[#759667] shrink-0 shadow-[0_0_14px_rgba(117,150,103,0.2)]">
                    <Dumbbell className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-base sm:text-lg font-black text-[#e2eaf4]">
                        {t.workoutPortal}
                      </span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#759667] group-hover:translate-x-1 transition shrink-0" />
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#759667] mt-0.5 truncate">
                      {t.workoutPortalTag}
                    </div>
                    <p className="text-xs text-[#7e91ac] mt-1 leading-snug line-clamp-2">
                      {t.workoutPortalDesc}
                    </p>
                  </div>
                </div>

                {/* Progress Mini Pill */}
                <div className="mt-3.5 pt-2.5 border-t border-[#1a273b]/60 flex items-center justify-between text-xs font-bold">
                  <span className="text-[#7e91ac] text-[11px]">
                    {activeMonth}. {t.monthWord} • {activeWeek}. {t.weekWord}
                  </span>
                  <span className="text-[#759667] text-[11px]">
                    %{weekPercent} {lang === 'tr' ? 'Tamamlandı' : 'Done'}
                  </span>
                </div>
              </div>

              {/* BESLENME PORTALI */}
              <div
                onClick={() => navigate('nutrition')}
                className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#101926] via-[#101926] to-[#131f18] border border-[#1b281d] hover:border-[#759667] transition-all cursor-pointer shadow-xl group active:scale-[0.985] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#759667]/15 to-transparent rounded-bl-full pointer-events-none" />
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#759667]/15 border border-[#759667] flex items-center justify-center text-[#759667] shrink-0 shadow-[0_0_14px_rgba(117,150,103,0.2)]">
                    <UtensilsCrossed className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-base sm:text-lg font-black text-[#e2eaf4]">
                        {t.nutritionPortal}
                      </span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#759667] group-hover:translate-x-1 transition shrink-0" />
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#759667] mt-0.5 truncate">
                      {t.nutritionPortalTag}
                    </div>
                    <p className="text-xs text-[#7e91ac] mt-1 leading-snug line-clamp-2">
                      {t.nutritionPortalDesc}
                    </p>
                  </div>
                </div>

                {/* Nutrition Summary Pill */}
                <div className="mt-3.5 pt-2.5 border-t border-[#1a273b]/60 flex items-center justify-between text-xs font-bold">
                  <span className="text-[#7e91ac] text-[11px]">
                    {lang === 'tr' ? 'Kalan' : 'Remaining'}: {remainingCal} kcal
                  </span>
                  <span className="text-[#759667] text-[11px]">
                    {currentWeight} kg → {targetWeight} kg
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1">
              <div
                onClick={() => navigate('workout')}
                className="p-3.5 rounded-2xl bg-[#0b121b] border border-[#1b281d] cursor-pointer hover:border-[#759667]/60 transition active:scale-[0.98]"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#7e91ac]">
                  <Flame className="w-4 h-4 text-[#759667]" />
                  <span className="truncate">{lang === 'tr' ? 'Haftalık Set' : 'Weekly Sets'}</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-[#e2eaf4] mt-1">
                  {doneWeekSets} <span className="text-xs text-[#7e91ac]">/ {totalWeekSets}</span>
                </div>
              </div>

              <div
                onClick={() => navigate('weight-graph')}
                className="p-3.5 rounded-2xl bg-[#0b121b] border border-[#1b281d] cursor-pointer hover:border-[#759667]/60 transition active:scale-[0.98]"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#7e91ac]">
                  <Scale className="w-4 h-4 text-[#759667]" />
                  <span className="truncate">{lang === 'tr' ? 'Son Tartı' : 'Last Weight'}</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-[#e2eaf4] mt-1">
                  {currentWeight} <span className="text-xs text-[#759667]">kg</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================== */}
        {/* 2. SPOR MODÜLÜ (1-6 AY / 24 HAFTA)             */}
        {/* ============================================== */}
        {screen === 'workout' && (
          <div className="space-y-3.5 sm:space-y-4 animate-fadeIn">
            {/* Top Action / Back */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => navigate('hub')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0b121b] border border-[#1a273b] hover:border-[#759667] text-xs font-bold text-[#759667] transition active:scale-95 shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.backToHub}</span>
              </button>
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#759667]/15 border border-[#2d4231] text-[#759667] truncate max-w-[170px] sm:max-w-none">
                {program.monthName}
              </span>
            </div>

            {/* 6-Month Track */}
            <div>
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span className="text-xs font-black text-[#e2eaf4] uppercase tracking-wider">
                  {t.periodization}
                </span>
                <span className="text-[11px] font-bold text-[#7e91ac]">
                  {activeMonth}. {t.monthWord}
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1.5 custom-scroll overscroll-x-contain touch-pan-y">
                {[1, 2, 3, 4, 5, 6].map(m => (
                  <button
                    key={m}
                    onClick={() => {
                      sound.playTick(settings.sound);
                      setActiveMonth(m);
                    }}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition active:scale-95 ${
                      m === activeMonth
                        ? 'bg-[#759667] text-[#060a0f] border-2 border-[#92b683] shadow-[0_0_12px_rgba(117,150,103,0.3)]'
                        : 'bg-[#0b121b] border border-[#1a273b] text-[#7e91ac] hover:text-[#e2eaf4]'
                    }`}
                  >
                    {m}. {t.monthWord}
                  </button>
                ))}
              </div>
            </div>

            {/* Week Selector (1-4) */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-[#0b121b] border border-[#1a273b]">
              {[1, 2, 3, 4].map(w => (
                <button
                  key={w}
                  onClick={() => {
                    sound.playTick(settings.sound);
                    setActiveWeek(w);
                  }}
                  className={`py-2 rounded-xl text-xs font-extrabold text-center transition ${
                    w === activeWeek
                      ? 'bg-[#759667] text-[#060a0f] shadow-md'
                      : 'text-[#7e91ac] hover:text-[#e2eaf4]'
                  }`}
                >
                  {w}. {t.weekWord}
                </button>
              ))}
            </div>

            {/* Week Overview Card */}
            <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-[#0e1624] to-[#121d17] border border-[#1b281d] shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <span className="text-xs sm:text-sm font-black text-[#e2eaf4]">
                  {program.weekTitle}
                </span>
                <span className="text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#759667]/15 border border-[#2d4231] text-[#759667] self-start sm:self-auto shrink-0">
                  {doneWeekSets}/{totalWeekSets} Set
                </span>
              </div>
              <p className="text-xs font-bold text-[#759667] mt-0.5 leading-snug">
                {program.weekDesc}
              </p>
              {/* Progress Bar */}
              <div className="h-2 rounded-full bg-[#0b121b] border border-[#1a273b] mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#53704b] to-[#759667] transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(117,150,103,0.3)]"
                  style={{ width: `${weekPercent}%` }}
                />
              </div>
            </div>

            {/* Difficulty Mode Selector */}
            <div className="p-3 rounded-2xl bg-[#101926] border border-[#1b281d]">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-extrabold text-[#e2eaf4]">
                  {t.difficulty}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#759667]">
                  {difficulty === 'easy' ? t.easyBadge : (difficulty === 'medium' ? t.mediumBadge : t.hardBadge)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {(['easy', 'medium', 'hard'] as WorkoutDifficulty[]).map(d => (
                  <button
                    key={d}
                    onClick={() => {
                      sound.playTick(settings.sound);
                      setDifficulty(d);
                    }}
                    className={`py-2 rounded-xl text-xs font-extrabold transition active:scale-95 ${
                      difficulty === d
                        ? 'bg-[#759667] text-[#060a0f] border border-[#92b683] shadow-md'
                        : 'bg-[#0b121b] border border-[#1a273b] text-[#7e91ac] hover:text-[#e2eaf4]'
                    }`}
                  >
                    {d === 'easy' ? t.easy : (d === 'medium' ? t.medium : t.hard)}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Week Progress Button */}
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="w-full py-2.5 rounded-2xl border border-[#1a273b] hover:border-[#759667]/50 text-[#759667] text-xs font-extrabold transition active:scale-98"
            >
              {t.resetWeek}
            </button>

            {/* Day Cards List */}
            <div className="space-y-2">
              {program.days.map((day, dayIdx) => {
                let daySetsCount = 0;
                let dayDoneCount = 0;

                day.exercises.forEach((ex, exIdx) => {
                  daySetsCount += ex.sets;
                  for (let s = 1; s <= ex.sets; s++) {
                    const k = `m${activeMonth}_w${activeWeek}_d${dayIdx}_e${exIdx}_s${s}`;
                    if (completedSets[k]) dayDoneCount++;
                  }
                });

                const isDayDone = daySetsCount > 0 && dayDoneCount === daySetsCount;
                const duration = getEstimatedDayDuration(day.duration, difficulty, lang);

                return (
                  <div
                    key={dayIdx}
                    onClick={() => {
                      sound.playTick(settings.sound);
                      setSelectedDayIdx(dayIdx);
                      navigate('workout-detail');
                    }}
                    className="p-3.5 rounded-2xl bg-[#101926] border border-[#1b281d] hover:border-[#759667]/60 transition-all cursor-pointer shadow-md flex items-center justify-between group active:scale-[0.99]"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-extrabold text-[#e2eaf4] group-hover:text-white">
                          {day.dayName[lang]}
                        </span>
                        <span className="text-xs font-semibold text-[#759667] truncate max-w-[170px] sm:max-w-xs">
                          • {day.focus[lang]}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#7e91ac] mt-0.5">
                        {day.exercises.length} {lang === 'tr' ? 'hareket' : 'exercises'} • {duration}
                      </div>
                    </div>

                    <div
                      className={`px-2.5 py-1 rounded-xl text-xs font-extrabold shrink-0 border ${
                        isDayDone
                          ? 'bg-[#759667]/20 border-[#759667] text-[#759667] shadow-[0_0_8px_rgba(117,150,103,0.2)]'
                          : 'bg-[#0b121b] border-[#1a273b] text-[#7e91ac]'
                      }`}
                    >
                      {isDayDone ? '✓ ' + (lang === 'tr' ? 'Tamam' : 'Done') : `${dayDoneCount}/${daySetsCount} ${t.setWord}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================== */}
        {/* 2.1 SPOR: GÜN DETAYI (HAREKET LİSTESİ)         */}
        {/* ============================================== */}
        {screen === 'workout-detail' && currentDay && (
          <div className="space-y-3.5 sm:space-y-4 animate-fadeIn">
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => navigate('workout')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0b121b] border border-[#1a273b] hover:border-[#759667] text-xs font-bold text-[#759667] transition active:scale-95 shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.weeklyPlan}</span>
              </button>
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#759667]/15 border border-[#2d4231] text-[#759667] truncate max-w-[170px] sm:max-w-none">
                {activeMonth}. {t.monthWord} • {currentDay.dayName[lang]}
              </span>
            </div>

            <p className="text-xs text-[#7e91ac]">
              {t.clickExerciseHint}
            </p>

            {/* Exercises List */}
            <div className="space-y-2.5 sm:space-y-3">
              {currentDay.exercises.map((ex, exIdx) => {
                let doneSets = 0;
                for (let s = 1; s <= ex.sets; s++) {
                  const k = `m${activeMonth}_w${activeWeek}_d${selectedDayIdx}_e${exIdx}_s${s}`;
                  if (completedSets[k]) doneSets++;
                }
                const isDone = ex.sets > 0 && doneSets === ex.sets;
                const metrics = getScaledExerciseMetrics(ex, difficulty);

                return (
                  <div
                    key={exIdx}
                    onClick={() => {
                      sound.playTick(settings.sound);
                      setSelectedExIdx(exIdx);
                      navigate('exercise-single');
                    }}
                    className="p-3 sm:p-3.5 rounded-2xl bg-[#101926] border border-[#1b281d] hover:border-[#759667] transition-all cursor-pointer shadow-lg flex items-center gap-3 sm:gap-3.5 group active:scale-[0.99]"
                  >
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-[#09101b] border border-[#2d4231] shrink-0 relative group-hover:scale-105 transition duration-300">
                      <ExerciseVisual
                        postureId={ex.postureId}
                        name={ex.name[lang]}
                        target={ex.target[lang]}
                        customPhotoUrl={customPhotos[ex.postureId]}
                        variant="thumb"
                        lang={lang}
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                      <div className="text-sm font-extrabold text-[#e2eaf4] truncate group-hover:text-white">
                        {ex.name[lang]}
                      </div>
                      <div className="text-xs font-bold text-[#759667] mt-0.5 truncate">
                        {ex.target[lang]}
                      </div>
                      <div className="text-[11px] text-[#7e91ac] mt-0.5">
                        {ex.sets} {t.setWord} • {metrics.label} {ex.type === 'timed' ? t.holdWord : t.repWord}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <div
                        className={`px-2 py-1 rounded-xl text-xs font-extrabold border ${
                          isDone
                            ? 'bg-[#759667]/20 border-[#759667] text-[#759667]'
                            : 'bg-[#0b121b] border-[#1a273b] text-[#7e91ac]'
                        }`}
                      >
                        {isDone ? '✓' : `${doneSets}/${ex.sets}`}
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#7e91ac] group-hover:text-[#759667] transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================== */}
        {/* 2.2 SPOR: TEK HAREKET ÖZEL SAYFASI             */}
        {/* ============================================== */}
        {screen === 'exercise-single' && currentEx && (
          <div className="space-y-3.5 sm:space-y-4 animate-fadeIn">
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => navigate('workout-detail')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0b121b] border border-[#1a273b] hover:border-[#759667] text-xs font-bold text-[#759667] transition active:scale-95 shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.backToDay}</span>
              </button>
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#759667]/15 border border-[#2d4231] text-[#759667] truncate max-w-[170px] sm:max-w-none">
                {selectedExIdx + 1}. {t.exerciseDetailBadge}
              </span>
            </div>

            {/* Exercise Hero Card */}
            <div className="rounded-3xl bg-[#101926] border border-[#1b281d] overflow-hidden shadow-2xl">
              {/* Media container */}
              <div className="relative w-full h-48 sm:h-56 bg-[#080f18] overflow-hidden">
                <ExerciseVisual
                  postureId={currentEx.postureId}
                  name={currentEx.name[lang]}
                  target={currentEx.target[lang]}
                  customPhotoUrl={customPhotos[currentEx.postureId]}
                  variant="hero"
                  lang={lang}
                />

                <button
                  onClick={() => setEditingPhotoPostureId(currentEx.postureId)}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-[#060a0f]/80 backdrop-blur-md border border-[#2d4231] text-[#759667] hover:bg-[#759667] hover:text-[#060a0f] text-[11px] font-extrabold transition flex items-center gap-1.5 z-10"
                >
                  <span>{t.changePhoto}</span>
                </button>

                <div className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded-full bg-[#060a0f]/80 backdrop-blur-md border border-[#759667] text-[#759667] text-[10px] sm:text-[11px] font-bold truncate max-w-[220px] sm:max-w-xs z-10">
                  {t.posturePosition} • {currentEx.name[lang]}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <h1 className="text-lg sm:text-xl font-black text-[#e2eaf4] leading-tight">
                    {currentEx.name[lang]}
                  </h1>
                  <span className="px-2.5 py-1 rounded-lg bg-[#759667]/15 border border-[#2d4231] text-[#759667] text-xs font-bold shrink-0">
                    {currentEx.target[lang]}
                  </span>
                </div>

                {/* Form cue */}
                <div className="p-3 rounded-xl bg-[#060a0f]/60 border-l-3 border-[#759667] text-xs text-[#7e91ac] leading-relaxed">
                  {currentEx.form[lang]}
                </div>

                {/* Sets Grid */}
                <div>
                  <div className="text-[11px] font-bold text-[#7e91ac] mb-1.5 uppercase tracking-wider">
                    {lang === 'tr' ? 'Setleri Dokunarak Kaydet:' : 'Tap to Log Sets:'}
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {Array.from({ length: currentEx.sets }, (_, i) => i + 1).map(s => {
                      const k = `m${activeMonth}_w${activeWeek}_d${selectedDayIdx}_e${selectedExIdx}_s${s}`;
                      const isDone = !!completedSets[k];
                      const metrics = getScaledExerciseMetrics(currentEx, difficulty);

                      return (
                        <div
                          key={s}
                          onClick={() => handleToggleSet(k, true)}
                          className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-center cursor-pointer transition select-none active:scale-95 border ${
                            isDone
                              ? 'bg-[#759667]/20 border-[#759667] text-[#759667] shadow-[0_0_10px_rgba(117,150,103,0.2)]'
                              : 'bg-[#0b121b] border-[#1a273b] text-[#7e91ac] hover:border-[#759667]/50'
                          }`}
                        >
                          <div className="text-[9px] sm:text-[10px] font-extrabold uppercase">
                            {t.setWord} {s}
                          </div>
                          <div className={`text-xs sm:text-sm font-black mt-0.5 ${isDone ? 'text-[#759667]' : 'text-[#e2eaf4]'}`}>
                            {metrics.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Timed exercise hold stopwatch */}
                {currentEx.type === 'timed' && (
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0b121b] border border-[#1b281d] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#7e91ac] uppercase block">
                        {lang === 'tr' ? 'Statik Sayaç' : 'Hold Timer'}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-[#759667] font-mono tracking-wider">
                        00:{((holdTimerSecs !== null ? holdTimerSecs : (getScaledExerciseMetrics(currentEx, difficulty).holdSeconds || 20))) < 10 ? '0' : ''}
                        {(holdTimerSecs !== null ? holdTimerSecs : (getScaledExerciseMetrics(currentEx, difficulty).holdSeconds || 20))}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleHoldTimer(getScaledExerciseMetrics(currentEx, difficulty).holdSeconds || 20)}
                      className="px-4 py-2 rounded-xl bg-[#759667] hover:bg-[#92b683] text-[#060a0f] text-xs font-black transition active:scale-95 shadow-md shadow-[#759667]/20"
                    >
                      {holdIntervalRef.current ? t.stopTimer : t.startTimer}
                    </button>
                  </div>
                )}

                {/* Big Action button for sets */}
                {(() => {
                  let completedCount = 0;
                  let nextUnfinished: number | null = null;
                  for (let s = 1; s <= currentEx.sets; s++) {
                    const k = `m${activeMonth}_w${activeWeek}_d${selectedDayIdx}_e${selectedExIdx}_s${s}`;
                    if (completedSets[k]) {
                      completedCount++;
                    } else if (nextUnfinished === null) {
                      nextUnfinished = s;
                    }
                  }

                  const allDone = completedCount === currentEx.sets && currentEx.sets > 0;

                  if (allDone) {
                    return (
                      <div className="w-full py-3.5 sm:py-4 rounded-2xl bg-[#759667]/15 border border-[#759667] text-[#759667] font-black text-xs sm:text-sm text-center flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>{t.allSetsCompleted}</span>
                      </div>
                    );
                  }

                  const targetSet = nextUnfinished || 1;

                  return (
                    <button
                      onClick={() => handleExerciseAction(currentEx, selectedExIdx, targetSet)}
                      className={`w-full py-3.5 sm:py-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-[0.985] shadow-lg ${
                        isExerciseRunning
                          ? 'bg-gradient-to-r from-[#1f4e2f] to-[#759667] text-[#e2eaf4] border border-[#92b683]'
                          : 'bg-gradient-to-r from-[#53704b] to-[#759667] text-[#060a0f] border border-[#92b683] shadow-[#759667]/20'
                      }`}
                    >
                      {isExerciseRunning ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>{targetSet}. {t.finishSetAndRest}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>{targetSet}. {t.startSet}</span>
                        </>
                      )}
                    </button>
                  );
                })()}

                {/* Coach Tips & Form Notes */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#060a0f]/60 border border-[#1b281d] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#759667] uppercase tracking-wider">
                    <FileText className="w-4 h-4" />
                    <span>{t.trainerCuesTitle}</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-[#d4dde8] pl-1.5">
                    {(EXERCISE_SPECIFIC_NOTES[lang][currentEx.postureId] || [
                      lang === 'tr' ? "Doğru omurga açısını koruyarak hareketi uygula." : "Maintain strict spinal alignment."
                    ]).map((cue, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#759667] font-bold text-sm leading-none">•</span>
                        <span>{cue}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Personal User Note */}
                  <div className="pt-2.5 border-t border-[#1a273b]">
                    <label className="block text-[10px] sm:text-[11px] font-extrabold text-[#7e91ac] mb-1 uppercase">
                      {t.yourPersonalNote}
                    </label>
                    <textarea
                      value={userExerciseNotes[`note_${currentEx.postureId}`] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUserExerciseNotes(prev => ({
                          ...prev,
                          [`note_${currentEx.postureId}`]: val
                        }));
                      }}
                      placeholder={t.personalNotePlaceholder}
                      rows={2}
                      className="w-full bg-[#0b121b] border border-[#1a273b] focus:border-[#759667] text-xs text-[#e2eaf4] rounded-xl p-2.5 outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================== */}
        {/* 3. BESLENME MODÜLÜ                             */}
        {/* ============================================== */}
        {screen === 'nutrition' && (
          <div className="space-y-3.5 sm:space-y-4 animate-fadeIn">
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => navigate('hub')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0b121b] border border-[#1a273b] hover:border-[#759667] text-xs font-bold text-[#759667] transition active:scale-95 shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.backToHub}</span>
              </button>
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#759667]/15 border border-[#2d4231] text-[#759667] shrink-0">
                {t.nutritionPortal}
              </span>
            </div>

            {/* Daily Calorie Hero Card */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0e1624] to-[#121d17] border border-[#1b281d] shadow-xl">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs sm:text-sm font-black text-[#e2eaf4]">
                  {t.dailyCalorieBalance}
                </span>
                <button
                  onClick={() => setTargetModalMode('calorie')}
                  className="px-2.5 py-1 rounded-lg bg-[#759667]/15 border border-[#2d4231] hover:bg-[#759667]/25 text-xs font-bold text-[#759667] transition shrink-0"
                >
                  {t.changeTarget}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 text-center">
                <div
                  onClick={() => setTargetModalMode('calorie')}
                  className="p-2.5 sm:p-3 rounded-2xl bg-[#0b121b]/60 border border-[#1a273b] cursor-pointer hover:border-[#759667] transition"
                >
                  <div className="text-lg sm:text-xl font-black text-[#e2eaf4] leading-tight">
                    {targetCalories}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-[#7e91ac] uppercase mt-0.5 tracking-tight truncate">
                    {t.targetKcal}
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 rounded-2xl bg-[#0b121b]/60 border border-[#759667] shadow-[0_0_10px_rgba(117,150,103,0.15)]">
                  <div className="text-lg sm:text-xl font-black text-[#759667] leading-tight">
                    {remainingCal}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-[#7e91ac] uppercase mt-0.5 tracking-tight truncate">
                    {t.remaining}
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 rounded-2xl bg-[#0b121b]/60 border border-[#1a273b]">
                  <div className="text-lg sm:text-xl font-black text-[#e2eaf4] leading-tight">
                    {totalConsumedCal}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-[#7e91ac] uppercase mt-0.5 tracking-tight truncate">
                    {t.consumed}
                  </div>
                </div>
              </div>
            </div>

            {/* Macros Section with Customization Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs sm:text-sm font-black text-[#e2eaf4]">
                    {t.macroSettings}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-black text-[#759667] px-2 py-0.5 rounded-full bg-[#759667]/15 border border-[#2d4231] truncate">
                    %{macroSplit.protein} / %{macroSplit.carbs} / %{macroSplit.fat}
                  </span>
                </div>
                <button
                  onClick={() => setIsMacroModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#759667]/15 border border-[#2d4231] hover:bg-[#759667]/25 text-xs font-bold text-[#759667] transition shrink-0 active:scale-95"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{t.macroRatioBtn}</span>
                </button>
              </div>

              {/* 3 Macro Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {/* Protein */}
                <div
                  onClick={() => setIsMacroModalOpen(true)}
                  className="p-2.5 sm:p-3 rounded-2xl bg-[#101926] border border-[#1b281d] hover:border-[#759667] transition cursor-pointer text-center group"
                >
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-black text-[#7e91ac] uppercase tracking-wider mb-1">
                    <span className="truncate">{t.protein}</span>
                    <span className="text-[#759667] font-bold">%{macroSplit.protein}</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-[#e2eaf4] leading-tight">
                    {totalConsumedProtein}g
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-[#7e91ac] mt-0.5">
                    / {macroGramTargets.proteinGrams}g
                  </div>
                  <div className="h-1.5 rounded-full bg-[#0b121b] overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-[#759667] rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.round((totalConsumedProtein / (macroGramTargets.proteinGrams || 1)) * 100))}%`
                      }}
                    />
                  </div>
                  <div className="text-[9px] font-semibold text-[#7e91ac] mt-1 truncate">
                    {Math.max(0, macroGramTargets.proteinGrams - totalConsumedProtein)}g {lang === 'tr' ? 'kaldı' : 'left'}
                  </div>
                </div>

                {/* Carbs */}
                <div
                  onClick={() => setIsMacroModalOpen(true)}
                  className="p-2.5 sm:p-3 rounded-2xl bg-[#101926] border border-[#1b281d] hover:border-[#7fa890] transition cursor-pointer text-center group"
                >
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-black text-[#7e91ac] uppercase tracking-wider mb-1">
                    <span className="truncate">{t.carbs}</span>
                    <span className="text-[#7fa890] font-bold">%{macroSplit.carbs}</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-[#e2eaf4] leading-tight">
                    {totalConsumedCarbs}g
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-[#7e91ac] mt-0.5">
                    / {macroGramTargets.carbsGrams}g
                  </div>
                  <div className="h-1.5 rounded-full bg-[#0b121b] overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-[#7fa890] rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.round((totalConsumedCarbs / (macroGramTargets.carbsGrams || 1)) * 100))}%`
                      }}
                    />
                  </div>
                  <div className="text-[9px] font-semibold text-[#7e91ac] mt-1 truncate">
                    {Math.max(0, macroGramTargets.carbsGrams - totalConsumedCarbs)}g {lang === 'tr' ? 'kaldı' : 'left'}
                  </div>
                </div>

                {/* Fat */}
                <div
                  onClick={() => setIsMacroModalOpen(true)}
                  className="p-2.5 sm:p-3 rounded-2xl bg-[#101926] border border-[#1b281d] hover:border-[#a3bf95] transition cursor-pointer text-center group"
                >
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-black text-[#7e91ac] uppercase tracking-wider mb-1">
                    <span className="truncate">{t.fat}</span>
                    <span className="text-[#a3bf95] font-bold">%{macroSplit.fat}</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-[#e2eaf4] leading-tight">
                    {totalConsumedFat}g
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-[#7e91ac] mt-0.5">
                    / {macroGramTargets.fatGrams}g
                  </div>
                  <div className="h-1.5 rounded-full bg-[#0b121b] overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-[#53704b] rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.round((totalConsumedFat / (macroGramTargets.fatGrams || 1)) * 100))}%`
                      }}
                    />
                  </div>
                  <div className="text-[9px] font-semibold text-[#7e91ac] mt-1 truncate">
                    {Math.max(0, macroGramTargets.fatGrams - totalConsumedFat)}g {lang === 'tr' ? 'kaldı' : 'left'}
                  </div>
                </div>
              </div>
            </div>

            {/* Current vs Target Weight Summary */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#101926] border border-[#1b281d] flex items-center justify-between gap-2">
              <div className="min-w-0 pr-1">
                <div className="text-[10px] font-bold text-[#7e91ac] uppercase">
                  {t.currentVsTarget}
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5 flex-wrap">
                  <span className="text-lg sm:text-xl font-black text-[#e2eaf4]">
                    {currentWeight} kg
                  </span>
                  <span className="text-xs font-black text-[#759667] truncate">
                    {lang === 'tr' ? 'Hedef' : 'Target'}: {targetWeight} kg
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setTargetModalMode('weight')}
                  className="px-2.5 py-1.5 rounded-xl border border-[#1a273b] hover:border-[#759667] text-xs font-bold text-[#759667] transition"
                >
                  {t.changeTarget}
                </button>
                <button
                  onClick={() => navigate('weight-graph')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2b3d27] to-[#5d7951] text-[#e2eaf4] text-xs font-black transition active:scale-95 shadow-md"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{t.weightGraphBtn}</span>
                </button>
              </div>
            </div>

            {/* Quick Weight Entry */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#101926] border border-[#1b281d]">
              <span className="block text-xs font-extrabold text-[#7e91ac] mb-2">
                {t.quickWeightTitle}
              </span>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-[#0b121b] border border-[#1a273b] rounded-xl overflow-hidden focus-within:border-[#759667]">
                  <button
                    type="button"
                    onClick={() => {
                      const cur = parseFloat(quickWeightInput) || 75.0;
                      setQuickWeightInput((cur - 0.1).toFixed(1));
                      sound.playTick(settings.sound);
                    }}
                    className="w-10 h-10 flex items-center justify-center text-[#759667] hover:bg-[#759667]/15 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    step="0.1"
                    value={quickWeightInput}
                    onChange={(e) => setQuickWeightInput(e.target.value)}
                    placeholder={t.quickWeightPlaceholder}
                    className="w-full bg-transparent text-center text-xs font-bold text-[#e2eaf4] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const cur = parseFloat(quickWeightInput) || 75.0;
                      setQuickWeightInput((cur + 0.1).toFixed(1));
                      sound.playTick(settings.sound);
                    }}
                    className="w-10 h-10 flex items-center justify-center text-[#759667] hover:bg-[#759667]/15 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleQuickWeightLog}
                  className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#759667] hover:bg-[#92b683] text-[#060a0f] text-xs font-black transition active:scale-95 shadow-md shadow-[#759667]/20 shrink-0"
                >
                  {t.save}
                </button>
              </div>
            </div>

            {/* Meal Logger Form */}
            <div className="p-3.5 sm:p-4 rounded-3xl bg-[#101926] border border-[#1b281d] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black text-[#e2eaf4]">
                  {t.mealEntry}
                </span>
                <button
                  onClick={() => setIsFavoriteMealsModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#759667]/15 border border-[#759667] text-[#759667] text-[11px] sm:text-xs font-black hover:bg-[#759667]/25 transition"
                >
                  <span>★</span>
                  <span>{t.quickAdd}</span>
                </button>
              </div>

              {/* Row 1: Category + Food Name */}
              <div className="flex gap-2">
                <select
                  value={newMealCat}
                  onChange={(e) => setNewMealCat(e.target.value)}
                  className="w-32 bg-[#0b121b] border border-[#1a273b] text-xs text-[#e2eaf4] rounded-xl px-2.5 py-2 outline-none focus:border-[#759667] shrink-0"
                >
                  <option value="Kahvaltı">{t.meals.breakfast}</option>
                  <option value="Öğle">{t.meals.lunch}</option>
                  <option value="Akşam">{t.meals.dinner}</option>
                  <option value="Ara Öğün">{t.meals.snack}</option>
                </select>

                <input
                  type="text"
                  value={newMealDesc}
                  onChange={(e) => setNewMealDesc(e.target.value)}
                  placeholder={t.mealFoodPlaceholder}
                  className="flex-1 bg-[#0b121b] border border-[#1a273b] text-xs text-[#e2eaf4] rounded-xl px-3 py-2 outline-none focus:border-[#759667] min-w-0"
                />
              </div>

              {/* Row 2: Calories, Protein, Carbs, Fat + Submit */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input
                  type="number"
                  value={newMealCal}
                  onChange={(e) => setNewMealCal(e.target.value)}
                  placeholder={t.mealCalPlaceholder}
                  className="bg-[#0b121b] border border-[#1a273b] text-xs text-[#e2eaf4] rounded-xl px-2.5 py-2 outline-none focus:border-[#759667] min-w-0"
                />

                <input
                  type="number"
                  value={newMealProt}
                  onChange={(e) => setNewMealProt(e.target.value)}
                  placeholder={t.mealProtPlaceholder}
                  className="bg-[#0b121b] border border-[#1a273b] text-xs text-[#e2eaf4] rounded-xl px-2.5 py-2 outline-none focus:border-[#759667] min-w-0"
                />

                <input
                  type="number"
                  value={newMealCarb}
                  onChange={(e) => setNewMealCarb(e.target.value)}
                  placeholder={t.carbsGramPlaceholder}
                  className="bg-[#0b121b] border border-[#1a273b] text-xs text-[#e2eaf4] rounded-xl px-2.5 py-2 outline-none focus:border-[#759667] min-w-0"
                />

                <div className="flex gap-1.5">
                  <input
                    type="number"
                    value={newMealFat}
                    onChange={(e) => setNewMealFat(e.target.value)}
                    placeholder={t.fatGramPlaceholder}
                    className="flex-1 bg-[#0b121b] border border-[#1a273b] text-xs text-[#e2eaf4] rounded-xl px-2.5 py-2 outline-none focus:border-[#759667] min-w-0"
                  />

                  <button
                    onClick={handleAddMeal}
                    className="px-3 py-2 rounded-xl bg-[#759667] hover:bg-[#92b683] text-[#060a0f] text-xs font-black transition active:scale-95 shrink-0"
                  >
                    {t.add}
                  </button>
                </div>
              </div>

              {/* Meals List */}
              <div className="space-y-2 pt-2 border-t border-[#1a273b]/60">
                {loggedMeals.length === 0 ? (
                  <div className="p-3 text-center text-xs text-[#7e91ac]">
                    {lang === 'tr' ? 'Bugün henüz öğün eklenmedi.' : 'No meals logged today yet.'}
                  </div>
                ) : (
                  loggedMeals.map((meal, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 sm:p-3 rounded-2xl bg-[#0b121b] border border-[#1a273b] flex items-center justify-between gap-2"
                    >
                      <div className="flex-1 min-w-0 pr-1">
                        <span className="text-[10px] font-extrabold uppercase text-[#759667] mr-1.5 shrink-0">
                          [{meal.cat}]
                        </span>
                        <span className="text-xs font-bold text-[#e2eaf4] truncate">
                          {meal.desc}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-black text-[#759667]">
                          {meal.cal} kcal{meal.protein ? ` • ${meal.protein}g P` : ''}{meal.carbs ? ` • ${meal.carbs}g K` : ''}{meal.fat ? ` • ${meal.fat}g Y` : ''}
                        </span>
                        <button
                          onClick={() => handleDeleteMeal(idx)}
                          className="p-1 text-[#7e91ac] hover:text-[#ef4444] rounded transition"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================== */}
        {/* 4. KİLO GRAFİĞİ VE GEÇMİŞİ EKRANI              */}
        {/* ============================================== */}
        {screen === 'weight-graph' && (
          <div className="space-y-3.5 sm:space-y-4 animate-fadeIn">
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => navigate('nutrition')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0b121b] border border-[#1a273b] hover:border-[#759667] text-xs font-bold text-[#759667] transition active:scale-95 shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.backToNutrition}</span>
              </button>
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#759667]/15 border border-[#2d4231] text-[#759667] shrink-0">
                {t.progressGraphBadge}
              </span>
            </div>

            {/* Canvas Chart Card */}
            <div className="p-3.5 sm:p-4 rounded-3xl bg-[#101926] border border-[#1b281d] shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-black text-[#e2eaf4]">
                  {t.weightTrend}
                </span>
                <span className="text-xs font-bold text-[#759667]">
                  {lang === 'tr' ? 'Hedef' : 'Target'}: {targetWeight} kg
                </span>
              </div>

              <WeightChart
                weights={weightHistory}
                targetWeight={targetWeight}
                emptyText={t.addAtLeastOneWeight}
              />

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-4 mt-3 text-xs font-bold text-[#7e91ac]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#759667]" />
                  <span>{t.loggedWeights}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-[#7fa890]" />
                  <span>{t.targetLine}</span>
                </div>
              </div>
            </div>

            {/* Weight Logs History List */}
            <div className="p-3.5 sm:p-4 rounded-3xl bg-[#101926] border border-[#1b281d] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black text-[#e2eaf4]">
                  {t.weightHistoryTitle}
                </span>
                <span className="text-xs font-bold text-[#759667]">
                  {weightHistory.length} {lang === 'tr' ? 'Kayıt' : 'Logs'}
                </span>
              </div>

              {weightHistory.length === 0 ? (
                <div className="p-3 text-center text-xs text-[#7e91ac]">
                  {t.noWeightLogs}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {(() => {
                    const totalPages = Math.ceil(weightHistory.length / WEIGHTS_PER_PAGE) || 1;
                    const safePage = Math.min(weightPage, totalPages);
                    const reversed = weightHistory.slice().reverse();
                    const start = (safePage - 1) * WEIGHTS_PER_PAGE;
                    const items = reversed.slice(start, start + WEIGHTS_PER_PAGE);

                    return items.map((item, itemIdx) => {
                      const originalIdx = weightHistory.length - 1 - (start + itemIdx);
                      return (
                        <div
                          key={itemIdx}
                          className="p-2.5 sm:p-3 rounded-2xl bg-[#0b121b] border border-[#1a273b] flex items-center justify-between text-xs font-bold"
                        >
                          <span className="text-[#d4dde8]">{item.date}</span>
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs sm:text-sm font-black text-[#759667]">
                              {item.weight} kg
                            </span>
                            <button
                              onClick={() => handleDeleteWeight(originalIdx)}
                              className="p-1 text-[#7e91ac] hover:text-[#ef4444] rounded transition"
                              title="Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}

              {/* Pagination */}
              {weightHistory.length > WEIGHTS_PER_PAGE && (
                <div className="flex items-center justify-between pt-2.5 border-t border-[#1a273b]">
                  <button
                    disabled={weightPage === 1}
                    onClick={() => setWeightPage(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 rounded-xl border border-[#1a273b] text-xs font-bold text-[#7e91ac] disabled:opacity-40"
                  >
                    ← {t.prev}
                  </button>
                  <span className="text-xs font-bold text-[#7e91ac]">
                    {lang === 'tr' ? 'Sayfa' : 'Page'} {weightPage} / {Math.ceil(weightHistory.length / WEIGHTS_PER_PAGE)}
                  </span>
                  <button
                    disabled={weightPage >= Math.ceil(weightHistory.length / WEIGHTS_PER_PAGE)}
                    onClick={() => setWeightPage(prev => prev + 1)}
                    className="px-3 py-1.5 rounded-xl border border-[#1a273b] text-xs font-bold text-[#7e91ac] disabled:opacity-40"
                  >
                    {t.next} →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Rest Timer Overlay */}
      <RestTimerOverlay
        isOpen={isRestOpen}
        secondsRemaining={restRemaining}
        onModify={modifyRest}
        onClose={() => setIsRestOpen(false)}
        lang={lang}
        soundEnabled={settings.sound}
        soundTheme={settings.soundTheme || 'ios'}
        hapticsEnabled={settings.haptics !== false}
      />

      {/* iOS Bottom Navigation Bar */}
      <BottomNav
        currentScreen={screen}
        onNavigate={navigate}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        lang={lang}
        soundEnabled={settings.sound}
        soundTheme={settings.soundTheme || 'ios'}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        lang={lang}
        onSetLang={setLang}
        settings={settings}
        onUpdateSettings={(patch) => setSettings(prev => ({ ...prev, ...patch }))}
        onResetAllData={handleResetAllData}
      />

      {/* Calorie & Weight Target Modal */}
      <TargetModal
        isOpen={targetModalMode !== null}
        mode={targetModalMode}
        currentValue={targetModalMode === 'calorie' ? targetCalories : targetWeight}
        onSave={(newVal) => {
          if (targetModalMode === 'calorie') setTargetCalories(newVal);
          else setTargetWeight(newVal);
        }}
        onClose={() => setTargetModalMode(null)}
        lang={lang}
        soundEnabled={settings.sound}
        hapticsEnabled={settings.haptics !== false}
      />

      {/* Favorite Meals Modal */}
      <FavoriteMealsModal
        isOpen={isFavoriteMealsModalOpen}
        onClose={() => setIsFavoriteMealsModalOpen(false)}
        favorites={favoriteMeals}
        onAddFavorite={(item) => setFavoriteMeals(prev => [item, ...prev])}
        onDeleteFavorite={(idx) => setFavoriteMeals(prev => prev.filter((_, i) => i !== idx))}
        onSelectFavorite={(item) => setLoggedMeals(prev => [...prev, item])}
        lang={lang}
        soundEnabled={settings.sound}
      />

      {/* Reset Week Confirm Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#101926] border-2 border-[#ef4444] rounded-3xl p-6 shadow-2xl text-center text-[#d4dde8]">
            <h2 className="text-base font-black text-[#e2eaf4] mb-2">
              {t.resetWeekModalTitle}
            </h2>
            <p className="text-xs text-[#7e91ac] leading-relaxed mb-5">
              {lang === 'tr'
                ? `${activeMonth}. Ayın ${activeWeek}. haftasına ait tüm tamamlanan setler sıfırlanacak. Devam etmek istiyor musun?`
                : `All completed sets for Month ${activeMonth}, Week ${activeWeek} will be reset. Are you sure?`}
            </p>
            <div className="flex gap-2.5 justify-center">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#1a273b] text-xs font-bold text-[#7e91ac]"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleExecuteResetWeek}
                className="px-4 py-2 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-black shadow-md shadow-[#ef4444]/25"
              >
                {t.yesReset}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Media Modal */}
      {editingPhotoPostureId && (
        <MediaModal
          isOpen={true}
          onClose={() => setEditingPhotoPostureId(null)}
          postureId={editingPhotoPostureId}
          exerciseName={currentEx ? currentEx.name[lang] : 'Exercise'}
          currentPhoto={customPhotos[editingPhotoPostureId]}
          onSavePhoto={(pId, url) => {
            setCustomPhotos(prev => {
              const next = { ...prev };
              if (url) next[pId] = url;
              else delete next[pId];
              return next;
            });
            sound.playSuccess(settings.sound);
          }}
          lang={lang}
        />
      )}

      {/* Macro Customization Modal */}
      <MacroCustomModal
        isOpen={isMacroModalOpen}
        onClose={() => setIsMacroModalOpen(false)}
        targetCalories={targetCalories}
        currentSplit={macroSplit}
        onSave={(newSplit) => {
          setMacroSplit(newSplit);
          sound.playSuccess(settings.sound);
        }}
        lang={lang}
        soundEnabled={settings.sound}
      />
    </div>
  );
}
