export type Language = 'tr' | 'en';
export type WorkoutDifficulty = 'easy' | 'medium' | 'hard';
export type ScreenId = 'hub' | 'workout' | 'workout-detail' | 'exercise-single' | 'nutrition' | 'weight-graph';

export interface Exercise {
  name: { tr: string; en: string };
  target: { tr: string; en: string };
  form: { tr: string; en: string };
  sets: number;
  reps?: string;
  holdSeconds?: number;
  type: 'rep' | 'timed';
  postureId: string;
}

export interface WorkoutDay {
  dayName: { tr: string; en: string };
  focus: { tr: string; en: string };
  duration: string;
  exercises: Exercise[];
}

export interface MonthPhase {
  name: string;
  desc: string;
  weeks: {
    [key: number]: {
      label: string;
      focus: string;
    };
  };
}

export interface MacroSplit {
  protein: number; // percentage (e.g. 30)
  carbs: number;   // percentage (e.g. 45)
  fat: number;     // percentage (e.g. 25)
}

export interface MacroGramTargets {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface MealItem {
  id?: string;
  cat: string;
  desc: string;
  cal: number;
  protein: number;
  carbs?: number;
  fat?: number;
}

export interface WeightRecord {
  date: string;
  weight: number;
}

export type SoundTheme = 'ios' | 'marimba' | 'minimal';

export interface AppSettings {
  sound: boolean;
  soundTheme?: SoundTheme;
  haptics?: boolean;
  defaultRest: number;
}
