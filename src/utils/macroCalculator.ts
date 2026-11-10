import { MacroSplit, MacroGramTargets } from '../types';

export const MACRO_PRESETS: { id: string; nameKey: string; split: MacroSplit }[] = [
  {
    id: 'balanced',
    nameKey: 'presetBalanced',
    split: { protein: 30, carbs: 45, fat: 25 },
  },
  {
    id: 'highProtein',
    nameKey: 'presetHighProtein',
    split: { protein: 35, carbs: 40, fat: 25 },
  },
  {
    id: 'fatLoss',
    nameKey: 'presetFatLoss',
    split: { protein: 40, carbs: 25, fat: 35 },
  },
  {
    id: 'keto',
    nameKey: 'presetKeto',
    split: { protein: 25, carbs: 5, fat: 70 },
  },
];

export function calculateMacroGramTargets(targetCalories: number, split: MacroSplit): MacroGramTargets {
  const safeCalories = Math.max(0, targetCalories);
  
  // 1g Protein = 4 kcal
  const proteinGrams = Math.round((safeCalories * (split.protein / 100)) / 4);
  
  // 1g Carb = 4 kcal
  const carbsGrams = Math.round((safeCalories * (split.carbs / 100)) / 4);
  
  // 1g Fat = 9 kcal
  const fatGrams = Math.round((safeCalories * (split.fat / 100)) / 9);

  return {
    proteinGrams,
    carbsGrams,
    fatGrams,
  };
}

export function calculateMacroCalories(targetCalories: number, split: MacroSplit) {
  const safeCalories = Math.max(0, targetCalories);
  return {
    proteinCalories: Math.round(safeCalories * (split.protein / 100)),
    carbsCalories: Math.round(safeCalories * (split.carbs / 100)),
    fatCalories: Math.round(safeCalories * (split.fat / 100)),
  };
}

export function autoBalanceMacroSplit(current: MacroSplit, targetToAdjust: keyof MacroSplit): MacroSplit {
  const otherKeys = (['protein', 'carbs', 'fat'] as (keyof MacroSplit)[]).filter(k => k !== targetToAdjust);
  const sumOthers = current[otherKeys[0]] + current[otherKeys[1]];
  const adjustedVal = Math.max(0, Math.min(100, 100 - sumOthers));
  return {
    ...current,
    [targetToAdjust]: adjustedVal,
  };
}
