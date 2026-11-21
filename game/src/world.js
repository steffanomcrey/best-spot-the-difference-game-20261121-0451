// world.js — state machine, scoring, timer, hints and clicks.
import { PANEL_W, PANEL_H, SCORE, formatTime, multiplierFor, starsFor } from './config.js';
import { buildLevel, buildShotLevel, nextSceneIndex, sceneCount } from './levels.js';
import { SCENES } from './scenes.js';

export const SCREENS = { MENU: 'menu', PLAY: 'play', WIN: 'win', OVER: 'over' };

export function loadBest() {
  try {
    const v = window.localStorage.getItem('spotdiff.best');
    return v ? parseInt(v, 10) || 0 : 0;
  } catch (e) {
    return 0;
  }
}

export function saveBest(score) {
  try {
    window.localStorage.setItem('spotdiff.best', String(score));
  } catch (e) {
    // Storage unavailable; best score is session-only then.
  }
}

export class World {
  constructor(sound) {
    this.sound = sound;
    this.screen = SCREENS.MENU;
    this.tierKey = 'medium';
    this.selectedScene = 0;
    this.level = null;
    this.found = new Set();
    this.score = 0;
    this.streak = 0;
    this.hintsLeft = 3;
    this.timeLeft = 0;
    this.hintDiff = null;
    this.hintUntil = 0;
    this.now = 0;
    this.floaters = [];
    this.flashes = [];
    this.best = loadBest();
    this.stars = 0;
    this.timeBonus = 0;
    this.lastFoundLabel = '';
    this.message = '';
  }

  toMenu() {
    this.screen = SCREENS.MENU;
    this.level = null;
    this.found = new Set();
    this.hintDiff = null;
    this.floaters = [];
    this.flashes = [];
  }

  startLevel(sceneIndex, tierKey, opts) {
    const o = opts || {};
    this.level = o.shot
      ? buildShotLevel(sceneIndex, o.count || 8, o.timeLeft || 150)
      : buildLevel(sceneIndex, tierKey || this.tierKey, o.seed || 1);
    this.tierKey = this.level.tier.key === 'shot' ? this.tierKey : this.level.tier.key;
    this.screen = SCREENS.PLAY;
    this.found = new Set();
    this.score = 0;
    this.streak = 0;
    this.hintsLeft = this.level.hintsTotal;
    this.timeLeft = this.level.timeTotal;
    this.hintDiff = null;
    this.hintUntil = 0;
    this.floaters = [];
    this.flashes = [];
    this.stars = 0;
    this.timeBonus = 0;
    this.message = '';
    if (o.foundIds) {
      o.foundIds.forEach((id) => this.found.add(id));
      this.score = o.foundIds.length * SCORE.basePoints;
      this.streak = o.foundIds.length;
    }
    if (o.timeLeft != null) this.timeLeft = o.timeLeft;
  }

  remaining() {
    if (!this.level) return 0;
    return this.level.diffs.length - this.found.size;
  }

  foundCount() {
    return this.found.size;
  }

  totalDiffs() {
    return this.level ? this.level.diffs.length : 0;
  }

  counterText() {
    return 'FOUND ' + this.foundCount() + ' OF ' + this.totalDiffs() + ' — ' + this.remaining() + ' REMAIN';
  }

  diffAt(x, y) {
    if (!this.level) return null;
    for (const d of this.level.diffs) {
      if (this.found.has(d.id)) continue;
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) return d;
      // A moved object lives at a second spot in the right picture.
      if (d.bx != null) {
        const bx = x - d.bx;
        const by = y - d.by;
        if (bx * bx + by * by <= d.r * d.r) return d;
      }
    }
    return null;
  }

  clickPanel(panel, x, y) {
    if (this.screen !== SCREENS.PLAY || !this.level) return 'ignored';
    if (x < 0 || y < 0 || x > PANEL_W || y > PANEL_H) return 'ignored';
    const d = this.diffAt(x, y);
    if (d) {
      this.found.add(d.id);
      this.streak += 1;
      const mult = multiplierFor(this.streak);
      const pts = SCORE.basePoints * mult;
      this.score += pts;
      this.lastFoundLabel = d.label;
      this.floaters.push({ x: panel === 'left' ? x : x, y, text: '+' + pts, life: 1.2, max: 1.2, panel });
      this.sound.foundChime();
      if (this.hintDiff && this.hintDiff.id === d.id) {
        this.hintDiff = null;
      }
      if (this.remaining() === 0) this.completeLevel();
      return 'found';
    }
    this.streak = 0;
    this.timeLeft = Math.max(0, this.timeLeft - SCORE.wrongPenaltySeconds);
    this.flashes.push({ x, y, life: 0.7, max: 0.7, panel });
    this.sound.wrongBuzz();
    if (this.timeLeft <= 0) this.timeOut();
    return 'wrong';
  }

  useHint() {
    if (this.screen !== SCREENS.PLAY || !this.level) return null;
    if (this.hintsLeft <= 0) {
      this.message = 'No hints left!';
      return null;
    }
    const unfound = this.level.diffs.filter((d) => !this.found.has(d.id));
    if (unfound.length === 0) return null;
    const pick = unfound[Math.floor(this.now * 7) % unfound.length] || unfound[0];
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - SCORE.hintCost);
    this.hintDiff = pick;
    this.hintUntil = this.now + SCORE.hintSeconds;
    this.sound.hintDing();
    return pick;
  }

  completeLevel() {
    this.stars = starsFor(this.timeLeft, this.level.timeTotal);
    this.timeBonus = Math.floor(this.timeLeft) * SCORE.winTimeBonusPerSecond;
    this.score += this.timeBonus;
    if (this.score > this.best) {
      this.best = this.score;
      saveBest(this.score);
    }
    this.screen = SCREENS.WIN;
    this.sound.winArpeggio();
  }

  timeOut() {
    this.timeLeft = 0;
    this.screen = SCREENS.OVER;
    this.sound.loseTone();
  }

  nextLevel() {
    const next = nextSceneIndex(this.level ? this.level.sceneIndex : this.selectedScene);
    this.selectedScene = next;
    this.startLevel(next, this.tierKey, { seed: 2 });
  }

  retryLevel() {
    if (!this.level) return;
    this.startLevel(this.level.sceneIndex, this.tierKey === 'shot' ? 'medium' : this.tierKey, { seed: 1 });
  }

  update(dt) {
    this.now += dt;
    if (this.screen === SCREENS.PLAY && this.level) {
      this.timeLeft -= dt;
      if (this.timeLeft <= 0) {
        this.timeOut();
        return;
      }
    }
    if (this.hintDiff && this.now > this.hintUntil) this.hintDiff = null;
    this.floaters = this.floaters.filter((f) => {
      f.life -= dt;
      return f.life > 0;
    });
    this.flashes = this.flashes.filter((f) => {
      f.life -= dt;
      return f.life > 0;
    });
    if (this.message) this.message = '';
  }

  sceneList() {
    return SCENES;
  }

  sceneCountTotal() {
    return sceneCount();
  }

  timeText() {
    return formatTime(this.timeLeft);
  }
}
