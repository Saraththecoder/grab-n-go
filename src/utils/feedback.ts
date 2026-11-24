export type FeedbackKind = 'tap' | 'add' | 'remove' | 'drawerOpen' | 'success';

const SOUND_STORAGE_KEY = 'gng_sound_enabled';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function getInitialSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const saved = window.localStorage.getItem(SOUND_STORAGE_KEY);
    return saved === null ? true : saved === 'true';
  } catch {
    return true;
  }
}

export function persistSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
  } catch {
    // Ignore storage restriction
  }
}

function playTone(
  ctx: AudioContext,
  freqStart: number,
  freqEnd: number,
  durationSec: number,
  gainPeak: number,
  type: OscillatorType = 'sine',
  delaySec = 0,
) {
  const now = ctx.currentTime + delaySec;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, now);
  if (freqEnd !== freqStart) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 40), now + durationSec);
  }

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(gainPeak, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + durationSec + 0.01);
}

export function playSoundEffect(kind: FeedbackKind, soundEnabled: boolean): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  switch (kind) {
    case 'tap':
      playTone(ctx, 640, 340, 0.032, 0.045, 'triangle');
      break;
    case 'add':
      playTone(ctx, 523.25, 587.33, 0.055, 0.055, 'sine', 0);
      playTone(ctx, 783.99, 880, 0.08, 0.05, 'sine', 0.04);
      break;
    case 'remove':
      playTone(ctx, 440, 290, 0.06, 0.045, 'sine');
      break;
    case 'drawerOpen':
      playTone(ctx, 340, 540, 0.09, 0.04, 'sine');
      break;
    case 'success':
      playTone(ctx, 523.25, 523.25, 0.09, 0.05, 'sine', 0);
      playTone(ctx, 659.25, 659.25, 0.1, 0.05, 'sine', 0.055);
      playTone(ctx, 783.99, 1046.5, 0.14, 0.055, 'sine', 0.11);
      break;
  }
}

export function triggerHaptic(kind: FeedbackKind): void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try {
    switch (kind) {
      case 'tap':
        navigator.vibrate(8);
        break;
      case 'add':
        navigator.vibrate(14);
        break;
      case 'remove':
        navigator.vibrate(10);
        break;
      case 'drawerOpen':
        navigator.vibrate([10, 18, 12]);
        break;
      case 'success':
        navigator.vibrate([14, 26, 22]);
        break;
    }
  } catch {
    // Ignore unsupported platforms
  }
}

export function triggerFeedback(kind: FeedbackKind, soundEnabled: boolean): void {
  triggerHaptic(kind);
  playSoundEffect(kind, soundEnabled);
}
