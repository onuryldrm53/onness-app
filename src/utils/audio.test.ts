import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sound, SoundTheme } from './audio.ts';

test('sound engine subscribes to audio events and notifies listeners on play asynchronously', async () => {
  const events: string[] = [];
  const unsubscribe = sound.subscribe((evt) => {
    events.push(evt.type);
  });

  sound.playTick(true, 'ios');
  sound.playSuccess(true, 'ios');
  sound.playUntoggle(true, 'ios');
  sound.playCountdownWarning(true, 'ios');
  sound.playRestDone(true, 'ios');

  // Await microtasks to let deferred notifications flush
  await new Promise((resolve) => setTimeout(resolve, 20));

  assert.deepEqual(events, ['tap', 'success', 'untoggle', 'warning', 'finish']);

  unsubscribe();
  events.length = 0;

  sound.playTick(true, 'ios');
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(events.length, 0, 'Unsubscribed listener should not receive events');
});

test('sound engine honors enabled=false flag without firing events or audio', async () => {
  const events: string[] = [];
  const unsubscribe = sound.subscribe((evt) => {
    events.push(evt.type);
  });

  sound.playTick(false);
  sound.playSuccess(false);
  sound.playUntoggle(false);
  sound.playCountdownWarning(false);
  sound.playRestDone(false);

  await new Promise((resolve) => setTimeout(resolve, 20));

  assert.equal(events.length, 0, 'Disabled sound should not trigger any events');
  unsubscribe();
});

test('sound engine supports all three sound themes without throwing in headless environment', () => {
  const themes: SoundTheme[] = ['ios', 'marimba', 'minimal'];

  for (const theme of themes) {
    assert.doesNotThrow(() => {
      sound.playTick(true, theme);
      sound.playSuccess(true, theme);
      sound.playUntoggle(true, theme);
      sound.playCountdownWarning(true, theme);
      sound.playRestDone(true, theme);
    });
  }
});
