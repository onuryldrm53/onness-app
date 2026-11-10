import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMacroGramTargets, calculateMacroCalories, autoBalanceMacroSplit } from './macroCalculator';

test('calculates correct macro gram targets for 2000 kcal with 30% P / 40% C / 30% F', () => {
  const split = { protein: 30, carbs: 40, fat: 30 };
  const targetCalories = 2000;

  const grams = calculateMacroGramTargets(targetCalories, split);
  // Protein: (2000 * 0.3) / 4 = 600 / 4 = 150g
  assert.equal(grams.proteinGrams, 150);
  // Carbs: (2000 * 0.4) / 4 = 800 / 4 = 200g
  assert.equal(grams.carbsGrams, 200);
  // Fat: (2000 * 0.3) / 9 = 600 / 9 = 66.67 => 67g
  assert.equal(grams.fatGrams, 67);

  const cals = calculateMacroCalories(targetCalories, split);
  assert.equal(cals.proteinCalories, 600);
  assert.equal(cals.carbsCalories, 800);
  assert.equal(cals.fatCalories, 600);
});

test('autoBalanceMacroSplit adjusts selected macro to complete 100%', () => {
  const split = { protein: 30, carbs: 40, fat: 10 }; // sum is 80%
  const balanced = autoBalanceMacroSplit(split, 'fat');
  assert.equal(balanced.fat, 30);
  assert.equal(balanced.protein + balanced.carbs + balanced.fat, 100);
});
