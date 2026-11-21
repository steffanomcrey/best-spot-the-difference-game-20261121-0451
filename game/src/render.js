// render.js — draws every screen: menu, play panels, HUD, markers, overlays.
import { CANVAS_W, CANVAS_H, HEADER_H, PANEL_W, PANEL_H, PANEL_Y, PANEL_X_LEFT, PANEL_X_RIGHT, FOOTER_Y, PALETTE, TIER_ORDER, TIERS } from './config.js';
import { drawSceneInto, SCENES } from './scenes.js';
import { SCREENS } from './world.js';

export function menuCardRect(i) {
  return { x: 40 + i * 204, y: 424, w: 196, h: 224 };
}

export function tierButtonRect(key) {
  const i = TIER_ORDER.indexOf(key);
  return { x: 470 + i * 150, y: 388, w: 140, h: 28 };
}

export function overlayButtons(screen) {
  if (screen === SCREENS.WIN) {
    return [
      { id: 'next', label: 'NEXT LEVEL  (N)', x: 430, y: 486, w: 200, h: 52 },
      { id: 'menu', label: 'MENU  (Esc)', x: 650, y: 486, w: 200, h: 52 },
    ];
  }
  if (screen === SCREENS.OVER) {
    return [
      { id: 'retry', label: 'RETRY  (R)', x: 430, y: 486, w: 200, h: 52 },
      { id: 'menu', label: 'MENU  (Esc)', x: 650, y: 486, w: 200, h: 52 },
    ];
  }
  return [];
}

export function hintButtonRect() {
  return { x: 1120, y: 44, w: 144, h: 26 };
}

function inRect(r, x, y) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

export function hitTestMenu(x, y, world) {
  for (let i = 0; i < SCENES.length; i++) {
    if (inRect(menuCardRect(i), x, y)) return { kind: 'scene', index: i };
  }
  for (const key of TIER_ORDER) {
    if (inRect(tierButtonRect(key), x, y)) return { kind: 'tier', key };
  }
  return null;
}

export function hitTestOverlay(x, y, world) {
  for (const b of overlayButtons(world.screen)) {
    if (inRect(b, x, y)) return b.id;
  }
  return null;
}

function star(c, x, y, r, filled) {
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) c.moveTo(px, py);
    else c.lineTo(px, py);
  }
  c.closePath();
  c.fillStyle = filled ? PALETTE.gold : '#5a6b7a';
  c.fill();
  c.strokeStyle = '#8a6d1f';
  c.lineWidth = 2;
  c.stroke();
}

function checkMark(c, x, y, s, colour) {
  c.strokeStyle = colour;
  c.lineWidth = 5;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x - s, y);
  c.lineTo(x - s * 0.25, y + s * 0.8);
  c.lineTo(x + s, y - s * 0.9);
  c.stroke();
}

function drawPanelFrame(c, x, label, accent) {
  c.fillStyle = '#0f1c26';
  c.fillRect(x - 3, PANEL_Y - 3, PANEL_W + 6, PANEL_H + 6);
  c.fillStyle = accent;
  c.fillRect(x, PANEL_Y, 250, 26);
  c.fillStyle = '#ffffff';
  c.font = 'bold 15px Georgia, serif';
  c.textAlign = 'left';
  c.textBaseline = 'middle';
  c.fillText(label, x + 12, PANEL_Y + 14);
}

export function drawMarker(c, px, py, d, t) {
  const pulse = 1 + Math.sin(t * 5) * 0.04;
  c.strokeStyle = '#e8503a';
  c.lineWidth = 4;
  c.beginPath();
  c.arc(px + d.x, py + d.y, d.r * pulse, 0, Math.PI * 2);
  c.stroke();
  c.strokeStyle = 'rgba(232, 80, 58, 0.35)';
  c.lineWidth = 8;
  c.beginPath();
  c.arc(px + d.x, py + d.y, (d.r + 5) * pulse, 0, Math.PI * 2);
  c.stroke();
  checkMark(c, px + d.x, py + d.y, 10, '#ffffff');
  c.fillStyle = '#e8503a';
  c.beginPath();
  c.arc(px + d.x, py + d.y, 11, 0, Math.PI * 2);
  c.fill();
  checkMark(c, px + d.x, py + d.y, 7, '#ffffff');
}

function drawHintRing(c, px, py, d, t) {
  const r = d.r + 8 + Math.sin(t * 6) * 5;
  c.strokeStyle = PALETTE.gold;
  c.lineWidth = 5;
  c.beginPath();
  c.arc(px + d.x, py + d.y, r, 0, Math.PI * 2);
  c.stroke();
  c.strokeStyle = 'rgba(242, 183, 5, 0.4)';
  c.lineWidth = 10;
  c.beginPath();
  c.arc(px + d.x, py + d.y, r + 7, 0, Math.PI * 2);
  c.stroke();
}

function drawHeader(c, world) {
  c.fillStyle = PALETTE.felt;
  c.fillRect(0, 0, CANVAS_W, HEADER_H);
  c.fillStyle = PALETTE.gold;
  c.fillRect(0, HEADER_H - 4, CANVAS_W, 4);
  c.fillStyle = '#ffffff';
  c.font = 'bold 22px Georgia, serif';
  c.textAlign = 'left';
  c.textBaseline = 'middle';
  c.fillText('SPOT THE DIFFERENCE', 16, 26);
  c.font = '16px Georgia, serif';
  c.fillStyle = '#cfe3ee';
  c.fillText(world.level ? world.level.scene.name : 'Six scenes · find them all', 16, 54);
  // Big remaining counter, centred.
  c.font = 'bold 26px Georgia, serif';
  c.textAlign = 'center';
  c.fillStyle = PALETTE.gold;
  c.fillText(world.level ? world.counterText() : 'PICK A SCENE BELOW', 640, 28);
  // Timer bar.
  const total = world.level ? world.level.timeTotal : 1;
  const frac = Math.max(0, world.timeLeft / total);
  const bx = 440, by = 48, bw = 400, bh = 14;
  c.fillStyle = '#0f1c26';
  c.fillRect(bx, by, bw, bh);
  c.fillStyle = frac > 0.5 ? '#2ecc71' : frac > 0.25 ? PALETTE.gold : '#e8503a';
  c.fillRect(bx, by, bw * frac, bh);
  c.strokeStyle = '#ffffff';
  c.lineWidth = 1;
  c.strokeRect(bx, by, bw, bh);
  c.font = 'bold 15px Georgia, serif';
  c.fillStyle = '#ffffff';
  c.textAlign = 'left';
  c.fillText(world.timeText(), bx + bw + 10, by + 8);
  // Right side: score, streak, hints.
  c.textAlign = 'right';
  c.font = 'bold 20px Georgia, serif';
  c.fillStyle = '#ffffff';
  c.fillText('SCORE ' + world.score, 1264, 26);
  c.font = '16px Georgia, serif';
  c.fillStyle = '#cfe3ee';
  const mult = world.streak >= 3 ? '  ·  STREAK x' + Math.min(1 + Math.floor(world.streak / 3), 5) : '';
  c.fillText('HINTS ' + world.hintsLeft + ' (H)' + mult, 1264, 54);
}

function drawFooter(c, text) {
  c.fillStyle = PALETTE.felt;
  c.fillRect(0, FOOTER_Y, CANVAS_W, CANVAS_H - FOOTER_Y);
  c.fillStyle = '#cfe3ee';
  c.font = '15px Georgia, serif';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(text, CANVAS_W / 2, FOOTER_Y + 30);
}

function drawMenu(c, world, t) {
  c.fillStyle = PALETTE.felt;
  c.fillRect(0, 0, CANVAS_W, CANVAS_H);
  c.fillStyle = PALETTE.gold;
  c.font = 'bold 40px Georgia, serif';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText('SPOT THE DIFFERENCE', CANVAS_W / 2, 34);
  c.fillStyle = '#cfe3ee';
  c.font = '17px Georgia, serif';
  c.fillText('Two pictures. One is hiding changes. Find them all before the clock runs out.', CANVAS_W / 2, 66);
  // Demo pair: scene 1 side by side, one difference already circled.
  const scene = SCENES[0];
  const demoY = 96, demoH = 280, demoW = 520;
  const dxL = 40, dxR = 720;
  drawSceneInto(c, scene, 'a', dxL, demoY, demoW, demoH);
  drawSceneInto(c, scene, 'b', dxR, demoY, demoW, demoH);
  c.strokeStyle = '#ffffff';
  c.lineWidth = 3;
  c.strokeRect(dxL, demoY, demoW, demoH);
  c.strokeRect(dxR, demoY, demoW, demoH);
  const demoDiff = scene.diffs[0];
  const sx = demoW / 600, sy = demoH / 560;
  [dxL, dxR].forEach((px) => {
    c.strokeStyle = '#e8503a';
    c.lineWidth = 4;
    c.beginPath();
    c.arc(px + demoDiff.x * sx, demoY + demoDiff.y * sy, demoDiff.r * sx + 4, 0, Math.PI * 2);
    c.stroke();
    checkMark(c, px + demoDiff.x * sx, demoY + demoDiff.y * sy, 9, '#ffffff');
  });
  c.fillStyle = '#0f1c26';
  c.fillRect(dxL, demoY, 170, 24);
  c.fillRect(dxR, demoY, 170, 24);
  c.fillStyle = '#ffffff';
  c.font = 'bold 14px Georgia, serif';
  c.textAlign = 'left';
  c.fillText('ORIGINAL', dxL + 10, demoY + 13);
  c.fillText('CHANGED', dxR + 10, demoY + 13);
  // Tier buttons.
  c.textAlign = 'right';
  c.font = 'bold 15px Georgia, serif';
  c.fillStyle = '#cfe3ee';
  c.fillText('DIFFICULTY:', 460, 402);
  for (const key of TIER_ORDER) {
    const r = tierButtonRect(key);
    const sel = world.tierKey === key;
    c.fillStyle = sel ? PALETTE.gold : '#27404f';
    c.fillRect(r.x, r.y, r.w, r.h);
    c.strokeStyle = sel ? '#8a6d1f' : '#5a6b7a';
    c.lineWidth = 2;
    c.strokeRect(r.x, r.y, r.w, r.h);
    c.fillStyle = sel ? '#22303c' : '#ffffff';
    c.font = 'bold 14px Georgia, serif';
    c.textAlign = 'center';
    c.fillText(TIERS[key].label.toUpperCase() + ' · ' + TIERS[key].diffs + ' · ' + TIERS[key].blurb.split('·')[1].trim(), r.x + r.w / 2, r.y + r.h / 2);
  }
  // Scene cards.
  SCENES.forEach((s, i) => {
    const r = menuCardRect(i);
    const sel = world.selectedScene === i;
    c.fillStyle = sel ? '#2c4a5e' : '#22303c';
    c.fillRect(r.x, r.y, r.w, r.h);
    c.strokeStyle = sel ? PALETTE.gold : '#3a5568';
    c.lineWidth = sel ? 3 : 2;
    c.strokeRect(r.x, r.y, r.w, r.h);
    drawSceneInto(c, s, 'a', r.x + 8, r.y + 8, r.w - 16, 110);
    c.strokeStyle = '#0f1c26';
    c.lineWidth = 2;
    c.strokeRect(r.x + 8, r.y + 8, r.w - 16, 110);
    c.fillStyle = '#ffffff';
    c.font = 'bold 16px Georgia, serif';
    c.textAlign = 'center';
    c.fillText((i + 1) + '. ' + s.name, r.x + r.w / 2, r.y + 140);
    c.fillStyle = '#cfe3ee';
    c.font = '11px Georgia, serif';
    c.fillText(s.tagline, r.x + r.w / 2, r.y + 164);
    c.fillStyle = PALETTE.gold;
    c.font = 'bold 14px Georgia, serif';
    c.fillText(s.diffs.length + ' differences  ·  click to play', r.x + r.w / 2, r.y + 196);
  });
  drawFooter(c, 'Click a scene to play  ·  1-6 select scene  ·  H hint  ·  N next  ·  R restart  ·  M mute  ·  Esc menu' + (world.best > 0 ? '   ·   BEST SCORE ' + world.best : ''));
}

function drawPlay(c, world, t) {
  c.fillStyle = '#12222e';
  c.fillRect(0, 0, CANVAS_W, CANVAS_H);
  drawHeader(c, world);
  const scene = world.level.scene;
  drawPanelFrame(c, PANEL_X_LEFT, 'ORIGINAL', '#1f8a70');
  drawPanelFrame(c, PANEL_X_RIGHT, 'CHANGED — ' + world.level.diffs.length + ' HIDDEN', '#e8503a');
  const py = PANEL_Y + 26;
  const ph = PANEL_H - 26;
  drawSceneInto(c, scene, 'a', PANEL_X_LEFT, py, PANEL_W, ph);
  drawSceneInto(c, scene, 'b', PANEL_X_RIGHT, py, PANEL_W, ph);
  const sy = ph / 560;
  const sx = PANEL_W / 600;
  // Found markers on both panels (a moved object is circled where it sits
  // in each picture).
  for (const d of world.level.diffs) {
    if (!world.found.has(d.id)) continue;
    const md = { x: d.x * sx, y: d.y * sy, r: d.r * sx };
    const mdB = { x: (d.bx != null ? d.bx : d.x) * sx, y: (d.by != null ? d.by : d.y) * sy, r: d.r * sx };
    drawMarker(c, PANEL_X_LEFT, py, md, t);
    drawMarker(c, PANEL_X_RIGHT, py, mdB, t);
  }
  // Hint ring on both panels.
  if (world.hintDiff) {
    const d = world.hintDiff;
    const md = { x: d.x * sx, y: d.y * sy, r: d.r * sx };
    const mdB = { x: (d.bx != null ? d.bx : d.x) * sx, y: (d.by != null ? d.by : d.y) * sy, r: d.r * sx };
    drawHintRing(c, PANEL_X_LEFT, py, md, t);
    drawHintRing(c, PANEL_X_RIGHT, py, mdB, t);
  }
  // Floaters.
  c.font = 'bold 24px Georgia, serif';
  c.textAlign = 'center';
  for (const f of world.floaters) {
    const alpha = Math.max(0, f.life / f.max);
    c.globalAlpha = alpha;
    c.fillStyle = PALETTE.gold;
    const px = f.panel === 'left' ? PANEL_X_LEFT : PANEL_X_RIGHT;
    c.fillText(f.text, px + f.x * sx, py + (f.y - 20) * sy - (1 - alpha) * 30);
    c.globalAlpha = 1;
  }
  // Wrong-click flashes.
  for (const f of world.flashes) {
    const alpha = Math.max(0, f.life / f.max);
    const px = f.panel === 'left' ? PANEL_X_LEFT : PANEL_X_RIGHT;
    c.globalAlpha = alpha;
    c.strokeStyle = '#e8503a';
    c.lineWidth = 5;
    const fx = px + f.x * sx, fy = py + f.y * sy;
    c.beginPath();
    c.moveTo(fx - 14, fy - 14); c.lineTo(fx + 14, fy + 14);
    c.moveTo(fx + 14, fy - 14); c.lineTo(fx - 14, fy + 14);
    c.stroke();
    c.globalAlpha = 1;
  }
  drawFooter(c, 'Click a difference on either picture  ·  wrong click costs 5 seconds  ·  H hint (-50 pts)  ·  R restart  ·  M mute  ·  Esc menu');
}

function drawOverlayCard(c, title, lines, buttons, stars) {
  c.fillStyle = 'rgba(10, 20, 28, 0.72)';
  c.fillRect(0, 0, CANVAS_W, CANVAS_H);
  const cx = 340, cy = 120, cw = 600, ch = 440;
  c.fillStyle = '#fdf6e3';
  c.fillRect(cx, cy, cw, ch);
  c.strokeStyle = PALETTE.gold;
  c.lineWidth = 4;
  c.strokeRect(cx, cy, cw, ch);
  c.fillStyle = PALETTE.ink;
  c.font = 'bold 34px Georgia, serif';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(title, cx + cw / 2, cy + 48);
  if (stars) {
    for (let i = 0; i < 3; i++) {
      star(c, cx + cw / 2 + (i - 1) * 70, cy + 110, 26, i < stars);
    }
  }
  c.font = '19px Georgia, serif';
  c.fillStyle = '#33475b';
  lines.forEach((ln, i) => {
    c.fillText(ln, cx + cw / 2, cy + 170 + i * 34);
  });
  for (const b of buttons) {
    c.fillStyle = b.id === 'menu' ? '#27404f' : PALETTE.gold;
    c.fillRect(b.x, b.y, b.w, b.h);
    c.strokeStyle = '#8a6d1f';
    c.lineWidth = 2;
    c.strokeRect(b.x, b.y, b.w, b.h);
    c.fillStyle = b.id === 'menu' ? '#ffffff' : '#22303c';
    c.font = 'bold 17px Georgia, serif';
    c.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2);
  }
}

export function render(c, world, t) {
  c.textBaseline = 'middle';
  if (world.screen === SCREENS.MENU) {
    drawMenu(c, world, t);
    return;
  }
  drawPlay(c, world, t);
  if (world.screen === SCREENS.WIN) {
    drawOverlayCard(
      c,
      'LEVEL COMPLETE!',
      [
        'Scene: ' + world.level.scene.name,
        'Found ' + world.foundCount() + ' of ' + world.totalDiffs() + ' differences',
        'Time left ' + world.timeText() + '  ·  time bonus +' + world.timeBonus,
        'Score ' + world.score + '   ·   Best ' + world.best,
      ],
      overlayButtons(SCREENS.WIN),
      world.stars,
    );
  } else if (world.screen === SCREENS.OVER) {
    drawOverlayCard(
      c,
      "TIME'S UP!",
      [
        'Scene: ' + world.level.scene.name,
        'You found ' + world.foundCount() + ' of ' + world.totalDiffs() + ' differences',
        'Score ' + world.score + '   ·   Best ' + world.best,
        'The remaining differences stay hidden... this time.',
      ],
      overlayButtons(SCREENS.OVER),
      0,
    );
  }
}
