import test from 'node:test';
import assert from 'node:assert/strict';
import { haptic, HAPTIC_PATTERNS } from './haptics';

test('haptic engine defines correct vibration patterns for iOS tactile feel', () => {
  assert.deepEqual(HAPTIC_PATTERNS.setCompleted, [25, 45, 30]);
  assert.deepEqual(HAPTIC_PATTERNS.restTimerDone, [60, 60, 60, 60, 100]);
  assert.deepEqual(HAPTIC_PATTERNS.weightLogged, [30, 45, 30]);
  assert.deepEqual(HAPTIC_PATTERNS.setUnchecked, [12]);
});

test('haptic engine methods gracefully handle non-browser / unsupported environment without throwing', () => {
  assert.doesNotThrow(() => {
    haptic.setCompleted(true);
    haptic.setUnchecked(true);
    haptic.restTimerDone(true);
    haptic.weightLogged(true);
    haptic.light(true);
  });
});

test('haptic engine honors enabled=false flag without calling vibrate', () => {
  let vibratePattern: unknown = null;
  // Define vibrate on globalThis.navigator
  const originalVibrate = (globalThis.navigator as unknown as { vibrate?: (p: unknown) => boolean }).vibrate;
  Object.defineProperty(globalThis.navigator, 'vibrate', {
    value: (p: unknown) => {
      vibratePattern = p;
      return true;
    },
    configurable: true,
    writable: true,
  });

  try {
    haptic.setCompleted(false);
    assert.equal(vibratePattern, null);

    haptic.setCompleted(true);
    assert.deepEqual(vibratePattern, [25, 45, 30]);

    haptic.restTimerDone(true);
    assert.deepEqual(vibratePattern, [60, 60, 60, 60, 100]);

    haptic.weightLogged(true);
    assert.deepEqual(vibratePattern, [30, 45, 30]);

    haptic.setUnchecked(true);
    assert.deepEqual(vibratePattern, [12]);
  } finally {
    if (originalVibrate) {
      Object.defineProperty(globalThis.navigator, 'vibrate', {
        value: originalVibrate,
        configurable: true,
        writable: true,
      });
    } else {
      delete (globalThis.navigator as unknown as { vibrate?: unknown }).vibrate;
    }
  }
});
