// High-fidelity Web Audio Synthesizer & Sound Animation Engine
// Replaces primitive sine beeps with studio-grade organic iOS taps, marimba chimes, and triumph chords.

export type SoundTheme = 'ios' | 'marimba' | 'minimal';

export interface SoundEvent {
  type: 'tap' | 'success' | 'untoggle' | 'warning' | 'finish';
  duration: number; // in milliseconds
  timestamp: number;
}

type SoundListener = (event: SoundEvent) => void;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private listeners: Set<SoundListener> = new Set();

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.ctx = new AudioCtxClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // Subscribe to sound events for visual sound wave animations
  subscribe(listener: SoundListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(type: SoundEvent['type'], duration: number) {
    const event: SoundEvent = { type, duration, timestamp: Date.now() };
    const dispatch = () => {
      this.listeners.forEach((listener) => {
        try {
          listener(event);
        } catch {
          // safety
        }
      });
    };

    if (typeof queueMicrotask === 'function') {
      queueMicrotask(dispatch);
    } else {
      setTimeout(dispatch, 0);
    }
  }

  // 1. Organic Tap / Click (Replaces the raw 520Hz sine beep)
  // Generates a crisp, warm tactile pop mimicking Apple iOS switch & haptic click
  playTick(enabled = true, theme: SoundTheme = 'ios') {
    if (!enabled) return;
    this.notify('tap', 60);

    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      if (theme === 'minimal') {
        // Ultra-subtle 18ms micro-click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.Q.setValueAtTime(3, now);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.018);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.02);
        return;
      }

      if (theme === 'marimba') {
        // Warm wooden marimba click
        const osc = ctx.createOscillator();
        const harm = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now); // E5

        harm.type = 'triangle';
        harm.frequency.setValueAtTime(1977.75, now); // 3rd harmonic

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

        osc.connect(gain);
        harm.connect(gain);
        gain.connect(filter);
        filter.connect(ctx.destination);

        osc.start(now);
        harm.start(now);
        osc.stop(now + 0.05);
        harm.stop(now + 0.05);
        return;
      }

      // Default: 'ios' - Dual-layer tactile pop (Transient snap + warm body drop)
      // Layer 1: Transient snap (Bandpass filtered pitch drop)
      const oscSnap = ctx.createOscillator();
      const gainSnap = ctx.createGain();
      const snapFilter = ctx.createBiquadFilter();

      snapFilter.type = 'bandpass';
      snapFilter.frequency.setValueAtTime(1600, now);
      snapFilter.Q.setValueAtTime(2.5, now);

      oscSnap.type = 'triangle';
      oscSnap.frequency.setValueAtTime(1200, now);
      oscSnap.frequency.exponentialRampToValueAtTime(240, now + 0.028);

      gainSnap.gain.setValueAtTime(0.22, now);
      gainSnap.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      oscSnap.connect(snapFilter);
      snapFilter.connect(gainSnap);
      gainSnap.connect(ctx.destination);

      // Layer 2: Warm body resonance (Low-end punch)
      const oscBody = ctx.createOscillator();
      const gainBody = ctx.createGain();
      oscBody.type = 'sine';
      oscBody.frequency.setValueAtTime(320, now);
      oscBody.frequency.exponentialRampToValueAtTime(110, now + 0.035);

      gainBody.gain.setValueAtTime(0.16, now);
      gainBody.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      oscBody.connect(gainBody);
      gainBody.connect(ctx.destination);

      oscSnap.start(now);
      oscBody.start(now);
      oscSnap.stop(now + 0.035);
      oscBody.stop(now + 0.04);
    } catch {
      // Audio fallback
    }
  }

  // 2. Set Complete / Achievement Success Chime
  // Uplifting, sparkling harmonic chord with smooth attack and shimmer release
  playSuccess(enabled = true, theme: SoundTheme = 'ios') {
    if (!enabled) return;
    this.notify('success', 450);

    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Chord frequencies: C5, E5, G5, C6 (Major uplifting chord)
      const notes =
        theme === 'marimba'
          ? [523.25, 659.25, 783.99] // C5, E5, G5
          : [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.18, now);
      masterGain.connect(ctx.destination);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.connect(masterGain);

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const startTime = now + idx * 0.038; // Arpeggiated shimmer
        const decayTime = 0.35 + idx * 0.06;

        osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.setValueAtTime(0.0001, startTime);
        noteGain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.012);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + decayTime);

        osc.connect(noteGain);
        noteGain.connect(filter);

        osc.start(startTime);
        osc.stop(startTime + decayTime + 0.05);
      });
    } catch {
      // Audio fallback
    }
  }

  // 3. Untoggle / Undo (Soft downward pop when unchecking a set)
  playUntoggle(enabled = true, theme: SoundTheme = 'ios') {
    if (!enabled) return;
    this.notify('untoggle', 50);

    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio fallback
    }
  }

  // 4. Countdown Warning (3, 2, 1 Metronome Pip)
  playCountdownWarning(enabled = true, theme: SoundTheme = 'ios') {
    if (!enabled) return;
    this.notify('warning', 80);

    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1050, now);
      filter.Q.setValueAtTime(4, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.04);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch {
      // Audio fallback
    }
  }

  // 5. Rest Timer Done / Triumph Gong & Chime
  playRestDone(enabled = true, theme: SoundTheme = 'ios') {
    if (!enabled) return;
    this.notify('finish', 850);

    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Phase 1: Call tone (D5 - 587.3Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(587.33, now);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.exponentialRampToValueAtTime(0.24, now + 0.015);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.38);

      // Phase 2: Soaring triumph harmony at +0.13s (A5 + D6 + F#6)
      const t2 = now + 0.13;
      const bloomNotes = [880.0, 1174.66, 1479.98]; // A5, D6, F#6

      bloomNotes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = i === 1 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, t2);

        gain.gain.setValueAtTime(0.0001, t2);
        gain.gain.exponentialRampToValueAtTime(0.22 - i * 0.04, t2 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.75 + i * 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t2);
        osc.stop(t2 + 0.9);
      });
    } catch {
      // Audio fallback
    }
  }
}

export const sound = new SoundEngine();
