// input.js — mouse and keyboard input, mapped to panel scene coordinates.
import { CANVAS_W, CANVAS_H, PANEL_W, PANEL_H, PANEL_Y, PANEL_X_LEFT, PANEL_X_RIGHT, TIER_ORDER } from './config.js';
import { hitTestMenu, hitTestOverlay, hintButtonRect } from './render.js';
import { SCREENS } from './world.js';

const PANEL_TOP = PANEL_Y + 26;
const PANEL_DRAW_H = PANEL_H - 26;

function toCanvasCoords(canvas, clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((clientX - r.left) / r.width) * CANVAS_W,
    y: ((clientY - r.top) / r.height) * CANVAS_H,
  };
}

function panelHit(x, y) {
  if (y < PANEL_TOP || y > PANEL_TOP + PANEL_DRAW_H) return null;
  const sx = (x - PANEL_X_LEFT) * (600 / PANEL_W);
  const sy = (y - PANEL_TOP) * (560 / PANEL_DRAW_H);
  if (x >= PANEL_X_LEFT && x <= PANEL_X_LEFT + PANEL_W) return { panel: 'left', x: sx, y: sy };
  if (x >= PANEL_X_RIGHT && x <= PANEL_X_RIGHT + PANEL_W) return { panel: 'right', x: sx, y: sy };
  return null;
}

export function attachInput(canvas, world, sound) {
  canvas.addEventListener('click', (ev) => {
    const p = toCanvasCoords(canvas, ev.clientX, ev.clientY);
    sound.resume();
    if (world.screen === SCREENS.MENU) {
      const hit = hitTestMenu(p.x, p.y, world);
      if (hit && hit.kind === 'scene') {
        world.selectedScene = hit.index;
        sound.clickTick();
        world.startLevel(hit.index, world.tierKey, { seed: 1 });
      } else if (hit && hit.kind === 'tier') {
        world.tierKey = hit.key;
        sound.clickTick();
      }
      return;
    }
    if (world.screen === SCREENS.WIN || world.screen === SCREENS.OVER) {
      const action = hitTestOverlay(p.x, p.y, world);
      if (action === 'next') world.nextLevel();
      else if (action === 'retry') world.retryLevel();
      else if (action === 'menu') world.toMenu();
      if (action) sound.clickTick();
      return;
    }
    if (world.screen === SCREENS.PLAY) {
      const hb = hintButtonRect();
      if (p.x >= hb.x && p.x <= hb.x + hb.w && p.y >= hb.y && p.y <= hb.y + hb.h) {
        world.useHint();
        return;
      }
      const hit = panelHit(p.x, p.y);
      if (hit) world.clickPanel(hit.panel, hit.x, hit.y);
    }
  });

  window.addEventListener('keydown', (ev) => {
    const k = ev.key;
    if (k >= '1' && k <= '6' && world.screen === SCREENS.MENU) {
      const idx = parseInt(k, 10) - 1;
      if (idx < world.sceneCountTotal()) {
        world.selectedScene = idx;
        sound.clickTick();
        world.startLevel(idx, world.tierKey, { seed: 1 });
      }
      return;
    }
    const lower = k.toLowerCase();
    if (lower === 'h' && world.screen === SCREENS.PLAY) world.useHint();
    else if (lower === 'n' && world.screen === SCREENS.WIN) world.nextLevel();
    else if (lower === 'r' && (world.screen === SCREENS.PLAY || world.screen === SCREENS.OVER)) world.retryLevel();
    else if (lower === 'm') sound.toggleMute();
    else if (k === 'Escape') {
      if (world.screen !== SCREENS.MENU) world.toMenu();
    }
    if (lower === 'h' || lower === 'n' || lower === 'r' || lower === 'm' || k === 'Escape') sound.resume();
  });
}
