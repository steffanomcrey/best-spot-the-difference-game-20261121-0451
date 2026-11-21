// config.js — tuning, palette and difficulty tiers for Spot the Difference.
export const CANVAS_W = 1280;
export const CANVAS_H = 720;
export const HEADER_H = 76;
export const PANEL_W = 600;
export const PANEL_H = 560;
export const PANEL_Y = 88;
export const PANEL_X_LEFT = 16;
export const PANEL_X_RIGHT = 664;
export const FOOTER_Y = 656;

export const TIERS = {
  easy: { key: 'easy', label: 'Easy', diffs: 7, time: 180, hints: 3, blurb: '7 differences · 3:00' },
  medium: { key: 'medium', label: 'Medium', diffs: 9, time: 150, hints: 3, blurb: '9 differences · 2:30' },
  hard: { key: 'hard', label: 'Hard', diffs: 10, time: 120, hints: 3, blurb: '10 differences · 2:00' },
};

export const TIER_ORDER = ['easy', 'medium', 'hard'];

export const SCORE = {
  basePoints: 100,
  streakStep: 3,
  maxMultiplier: 5,
  wrongPenaltySeconds: 5,
  hintCost: 50,
  hintSeconds: 2,
  winTimeBonusPerSecond: 5,
};

export const PALETTE = {
  ink: '#22303c',
  paper: '#fdf6e3',
  felt: '#1d2b36',
  feltLight: '#27404f',
  accent: '#e8503a',
  gold: '#f2b705',
  teal: '#1f8a70',
  cream: '#fff8e7',
  panelBorder: '#0f1c26',
};

export const KEYS = {
  hint: 'h',
  next: 'n',
  restart: 'r',
  mute: 'm',
  menu: 'Escape',
};

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m + ':' + String(r).padStart(2, '0');
}

export function starsFor(timeLeft, timeTotal) {
  const f = timeTotal > 0 ? timeLeft / timeTotal : 0;
  if (f > 0.5) return 3;
  if (f > 0.25) return 2;
  return 1;
}

export function multiplierFor(streak) {
  return Math.min(1 + Math.floor(streak / SCORE.streakStep), SCORE.maxMultiplier);
}
