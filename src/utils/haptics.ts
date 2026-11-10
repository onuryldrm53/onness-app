/**
 * iOS & Mobile Haptic Feedback Engine
 * Provides standard iPhone Taptic Engine-like tactile feedback patterns using the HTML5 Vibration API.
 */

export const HAPTIC_PATTERNS = {
  // Set completed: Standard iOS Taptic Engine double-impact pulse
  setCompleted: [25, 45, 30],
  // Set uncompleted / unchecked: Subtle single release tap
  setUnchecked: [12],
  // Rest timer completed: Celebratory completion rhythm
  restTimerDone: [60, 60, 60, 60, 100],
  // Weight logged: Satisfying tactile confirmation pulse
  weightLogged: [30, 45, 30],
  // Subtle light tap (ticks, steppers)
  light: [12],
  // Medium impact
  medium: [25],
};

class HapticEngine {
  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }

  private trigger(pattern: number | number[], enabled = true): boolean {
    if (!enabled) return false;
    if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return false;

    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }

  /**
   * Fired when a user checks / completes an exercise set.
   * Produces a distinct double-impact tactile pulse.
   */
  setCompleted(enabled = true): boolean {
    return this.trigger(HAPTIC_PATTERNS.setCompleted, enabled);
  }

  /**
   * Fired when a user un-toggles a previously completed set.
   * Produces a soft release tap.
   */
  setUnchecked(enabled = true): boolean {
    return this.trigger(HAPTIC_PATTERNS.setUnchecked, enabled);
  }

  /**
   * Fired when a rest timer reaches 00:00.
   * Produces a prominent celebratory pulse to notify the user even if muted.
   */
  restTimerDone(enabled = true): boolean {
    return this.trigger(HAPTIC_PATTERNS.restTimerDone, enabled);
  }

  /**
   * Fired when a user logs a new daily weigh-in or target weight.
   * Produces an affirming success vibration.
   */
  weightLogged(enabled = true): boolean {
    return this.trigger(HAPTIC_PATTERNS.weightLogged, enabled);
  }

  /**
   * Light tactile tap for steppers, tabs, and countdown warnings.
   */
  light(enabled = true): boolean {
    return this.trigger(HAPTIC_PATTERNS.light, enabled);
  }

  /**
   * Medium impact tap.
   */
  medium(enabled = true): boolean {
    return this.trigger(HAPTIC_PATTERNS.medium, enabled);
  }
}

export const haptic = new HapticEngine();
