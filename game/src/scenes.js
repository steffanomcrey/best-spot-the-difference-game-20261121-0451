// scenes.js — six original vector-drawn scenes, painted procedurally on canvas.
// Each scene is drawn twice (left original, right altered). A difference is a
// small, fair change: missing object, colour change, extra object, moved object,
// changed sign or different count. `variant` is 'a' (original) or 'b' (altered).
import { makeRng } from './random.js';

function rr(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function circ(c, x, y, r) {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
}

function fillCirc(c, x, y, r, colour) {
  c.fillStyle = colour;
  circ(c, x, y, r);
  c.fill();
}

function fillRect(c, x, y, w, h, colour) {
  c.fillStyle = colour;
  c.fillRect(x, y, w, h);
}

function line(c, x1, y1, x2, y2, colour, w) {
  c.strokeStyle = colour;
  c.lineWidth = w || 2;
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
}

function text(c, s, x, y, size, colour, weight, align) {
  c.fillStyle = colour;
  c.font = (weight || 'bold') + ' ' + size + 'px Georgia, serif';
  c.textAlign = align || 'center';
  c.textBaseline = 'middle';
  c.fillText(s, x, y);
}

function cloud(c, x, y, s, colour) {
  c.fillStyle = colour || '#ffffff';
  circ(c, x, y, 16 * s); c.fill();
  circ(c, x + 18 * s, y + 4 * s, 13 * s); c.fill();
  circ(c, x - 18 * s, y + 5 * s, 12 * s); c.fill();
  c.fillRect(x - 28 * s, y - 2 * s, 56 * s, 14 * s);
}

function bird(c, x, y, s) {
  c.strokeStyle = '#2c3e50';
  c.lineWidth = 2.5;
  c.beginPath();
  c.moveTo(x - 10 * s, y);
  c.quadraticCurveTo(x - 4 * s, y - 8 * s, x, y);
  c.quadraticCurveTo(x + 4 * s, y - 8 * s, x + 10 * s, y);
  c.stroke();
}

function person(c, x, y, s, shirt, pants, skin, hatColour) {
  // Simple standing figure, feet at (x, y).
  c.fillStyle = pants;
  c.fillRect(x - 7 * s, y - 34 * s, 6 * s, 34 * s);
  c.fillRect(x + 1 * s, y - 34 * s, 6 * s, 34 * s);
  c.fillStyle = shirt;
  rr(c, x - 11 * s, y - 66 * s, 22 * s, 34 * s, 6 * s);
  c.fill();
  fillCirc(c, x, y - 76 * s, 10 * s, skin);
  if (hatColour) {
    c.fillStyle = hatColour;
    c.fillRect(x - 12 * s, y - 88 * s, 24 * s, 6 * s);
    rr(c, x - 8 * s, y - 98 * s, 16 * s, 12 * s, 5 * s);
    c.fill();
  }
}

function tree(c, x, y, s, leaf, trunk) {
  c.fillStyle = trunk || '#7a4a21';
  c.fillRect(x - 5 * s, y - 40 * s, 10 * s, 40 * s);
  fillCirc(c, x, y - 58 * s, 26 * s, leaf);
  fillCirc(c, x - 20 * s, y - 42 * s, 18 * s, leaf);
  fillCirc(c, x + 20 * s, y - 42 * s, 18 * s, leaf);
}

function cat(c, x, y, s, colour) {
  c.fillStyle = colour;
  c.beginPath();
  c.ellipse(x, y, 16 * s, 10 * s, 0, 0, Math.PI * 2);
  c.fill();
  circ(c, x + 14 * s, y - 8 * s, 8 * s);
  c.fill();
  c.beginPath();
  c.moveTo(x + 9 * s, y - 14 * s); c.lineTo(x + 11 * s, y - 22 * s); c.lineTo(x + 14 * s, y - 14 * s);
  c.moveTo(x + 16 * s, y - 15 * s); c.lineTo(x + 19 * s, y - 22 * s); c.lineTo(x + 21 * s, y - 14 * s);
  c.fill();
  c.strokeStyle = colour;
  c.lineWidth = 3 * s;
  c.beginPath();
  c.moveTo(x - 15 * s, y - 2 * s);
  c.quadraticCurveTo(x - 26 * s, y - 12 * s, x - 20 * s, y - 20 * s);
  c.stroke();
}

// ---------------------------------------------------------------- scene 1
function drawMarket(c, ox, oy, variant) {
  const B = variant === 'b';
  const rng = makeRng('market-decor');
  c.save();
  c.translate(ox, oy);
  const sky = c.createLinearGradient(0, 0, 0, 380);
  sky.addColorStop(0, '#ffe9a8');
  sky.addColorStop(1, '#ffd98a');
  c.fillStyle = sky;
  c.fillRect(0, 0, 600, 380);
  // Sun, rays missing in B.
  fillCirc(c, 520, 70, 34, '#ffcf3d');
  if (!B) {
    c.strokeStyle = '#ffcf3d';
    c.lineWidth = 5;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      line(c, 520 + Math.cos(a) * 42, 70 + Math.sin(a) * 42, 520 + Math.cos(a) * 56, 70 + Math.sin(a) * 56, '#ffcf3d', 5);
    }
  }
  cloud(c, 120, 70, 1.1);
  cloud(c, 330, 46, 0.8);
  if (!B) bird(c, 298, 62, 1);
  bird(c, 240, 90, 0.8);
  bird(c, 430, 44, 0.9);
  // Distant rooftops.
  fillRect(c, 0, 300, 600, 80, '#c98a4b');
  c.fillStyle = '#a8642f';
  for (let i = 0; i < 6; i++) {
    const x = i * 100;
    c.beginPath();
    c.moveTo(x, 300); c.lineTo(x + 50, 262); c.lineTo(x + 100, 300);
    c.closePath(); c.fill();
    fillRect(c, x + 38, 236, 24, 30, '#8a5a3b');
  }
  // Cobble ground.
  fillRect(c, 0, 380, 600, 180, '#d9c49a');
  c.fillStyle = '#c4ab7d';
  for (let i = 0; i < 40; i++) {
    const x = Math.floor(rng() * 580) + 10;
    const y = 392 + Math.floor(rng() * 150);
    c.beginPath(); c.ellipse(x, y, 12, 6, 0, 0, Math.PI * 2); c.fill();
  }
  // Balloons: 3 in A, 2 in B.
  const balloons = B
    ? [[478, 118, '#e8503a'], [452, 96, '#3a7bd5']]
    : [[478, 118, '#e8503a'], [452, 96, '#3a7bd5'], [505, 96, '#f2b705']];
  balloons.forEach(([bx, by, col]) => {
    fillCirc(c, bx, by, 13, col);
    line(c, bx, by + 13, bx - 6, by + 44, '#5a4632', 1.5);
  });
  // Sign board: OPEN in A, CLOSED in B.
  fillRect(c, 268, 186, 104, 44, '#6b4423');
  fillRect(c, 274, 192, 92, 32, '#fff3d6');
  text(c, B ? 'CLOSED' : 'OPEN', 320, 208, 17, B ? '#b03a2e' : '#1f8a70', 'bold');
  // Stalls.
  function stall(x, awn, goods) {
    fillRect(c, x, 250, 150, 110, '#8a5a3b');
    fillRect(c, x + 6, 250, 138, 10, '#5e3a22');
    // Striped awning.
    for (let i = 0; i < 5; i++) {
      fillRect(c, x + i * 30, 218, 30, 32, i % 2 === 0 ? awn : '#fff8e7');
    }
    fillRect(c, x, 214, 150, 6, '#5e3a22');
    goods();
  }
  stall(40, B ? '#3a7bd5' : '#e8503a', () => {
    // Apples.
    for (let i = 0; i < 6; i++) fillCirc(c, 70 + i * 16, 268, 9, i % 2 ? '#d33' : '#e8503a');
    for (let i = 0; i < 5; i++) fillCirc(c, 78 + i * 16, 282, 9, '#e8503a');
    // Apple basket, missing in B.
    if (!B) {
      c.fillStyle = '#a8642f';
      c.fillRect(96, 316, 46, 30, '#a8642f');
      for (let i = 0; i < 4; i++) fillCirc(c, 104 + i * 11, 312, 8, '#c0392b');
    }
  });
  stall(225, '#1f8a70', () => {
    for (let i = 0; i < 4; i++) {
      c.fillStyle = '#e8b96a';
      rr(c, 240 + i * 28, 262, 24, 14, 7); c.fill();
    }
    for (let i = 0; i < 3; i++) {
      c.fillStyle = '#d99a4a';
      rr(c, 248 + i * 30, 282, 26, 14, 7); c.fill();
    }
    c.fillStyle = '#f5e0b8';
    rr(c, 250, 312, 100, 26, 6); c.fill();
    text(c, 'BREAD', 300, 325, 13, '#7a4a21', 'bold');
  });
  stall(410, '#e8823a', () => {
    // Flowers: pink in A, yellow in B.
    const fc = B ? '#f2d705' : '#e85a9a';
    for (let i = 0; i < 5; i++) {
      const fx = 428 + i * 22;
      fillCirc(c, fx, 268, 8, fc);
      fillCirc(c, fx, 282, 8, fc);
      line(c, fx, 290, fx, 306, '#1f8a70', 2);
    }
    c.fillStyle = '#3a7bd5';
    rr(c, 424, 306, 112, 28, 6); c.fill();
    text(c, 'FLOWERS', 480, 320, 13, '#ffffff', 'bold');
  });
  // People.
  person(c, 102, 420, 1, '#3a7bd5', '#33475b', '#e8b98a', B ? null : '#8a5a3b');
  person(c, 300, 430, 1, '#e8503a', '#5a4632', '#d9a066', '#f2b705');
  person(c, 540, 425, 0.85, '#1f8a70', '#33475b', '#e8b98a', null);
  // Crate, moved in B.
  const crateX = B ? 302 : 252;
  c.fillStyle = '#a8642f';
  c.fillRect(crateX, 448, 40, 34, '#a8642f');
  line(c, crateX, 448, crateX + 40, 482, '#7a4a21', 3);
  line(c, crateX + 40, 448, crateX, 482, '#7a4a21', 3);
  c.fillStyle = '#8a5a3b';
  c.fillRect(360, 452, 34, 30, '#8a5a3b');
  // Cat near left stall, plus an extra cat on the right crate in B.
  cat(c, 180, 500, 1, '#5a4632');
  if (B) cat(c, 505, 432, 0.9, '#d98a2b');
  // Dog.
  c.fillStyle = '#b5763a';
  c.beginPath(); c.ellipse(440, 520, 22, 12, 0, 0, Math.PI * 2); c.fill();
  circ(c, 462, 508, 10); c.fill();
  c.restore();
}

// ---------------------------------------------------------------- scene 2
function drawHarbour(c, ox, oy, variant) {
  const B = variant === 'b';
  const rng = makeRng('harbour-decor');
  c.save();
  c.translate(ox, oy);
  const sky = c.createLinearGradient(0, 0, 0, 340);
  sky.addColorStop(0, '#3b2d5e');
  sky.addColorStop(0.55, '#c65d7b');
  sky.addColorStop(1, '#f2a65a');
  c.fillStyle = sky;
  c.fillRect(0, 0, 600, 340);
  // Stars: 9 in A, 7 in B.
  c.fillStyle = '#ffffff';
  const stars = [[120, 50], [180, 34], [250, 60], [340, 30], [420, 44], [80, 110], [560, 40], [470, 90], [60, 60]];
  stars.slice(0, B ? 7 : 9).forEach(([sx, sy]) => { circ(c, sx, sy, 2.2); c.fill(); });
  // Low sun.
  fillCirc(c, 470, 300, 40, '#ffb347');
  fillCirc(c, 470, 300, 28, '#ffd98a');
  if (!B) bird(c, 300, 70, 1);
  bird(c, 240, 100, 0.8);
  bird(c, 360, 56, 0.9);
  // Lighthouse.
  fillRect(c, 488, 130, 34, 210, '#f5f0e6');
  c.fillStyle = '#c0392b';
  c.fillRect(488, 170, 34, 22);
  c.fillRect(488, 230, 34, 22);
  fillRect(c, 484, 106, 42, 24, '#2c3e50');
  fillCirc(c, 505, 118, 9, B ? '#5a6b7a' : '#ffe066');
  // Beam, on in A only.
  if (!B) {
    c.fillStyle = 'rgba(255, 224, 102, 0.35)';
    c.beginPath();
    c.moveTo(488, 118); c.lineTo(300, 70); c.lineTo(300, 150); c.closePath(); c.fill();
  }
  // Flag on lighthouse: red in A, blue in B.
  line(c, 505, 106, 505, 66, '#2c3e50', 3);
  c.fillStyle = B ? '#3a7bd5' : '#e8503a';
  c.beginPath(); c.moveTo(505, 66); c.lineTo(536, 74); c.lineTo(505, 84); c.closePath(); c.fill();
  // Distant town silhouette.
  fillRect(c, 0, 280, 460, 60, '#2e2140');
  for (let i = 0; i < 5; i++) {
    fillRect(c, 20 + i * 84, 246 + (i % 2) * 14, 44, 60 - (i % 2) * 14, '#2e2140');
  }
  // One lit window, dark in B.
  fillRect(c, 90, 240, 14, 18, B ? '#2e2140' : '#ffe066');
  // Sea.
  const sea = c.createLinearGradient(0, 340, 0, 560);
  sea.addColorStop(0, '#2a6f8f');
  sea.addColorStop(1, '#174a66');
  c.fillStyle = sea;
  c.fillRect(0, 340, 600, 220);
  c.strokeStyle = 'rgba(255,255,255,0.35)';
  c.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const wy = 360 + i * 22;
    c.beginPath();
    c.moveTo(20 + (i % 3) * 30, wy);
    c.quadraticCurveTo(120 + i * 40, wy - 8, 260 + i * 30, wy);
    c.stroke();
  }
  // Sailboat: white sail in A, red in B.
  line(c, 180, 180, 180, 330, '#5a4632', 4);
  c.fillStyle = B ? '#e8503a' : '#fdf6e3';
  c.beginPath(); c.moveTo(180, 190); c.lineTo(180, 320); c.lineTo(252, 320); c.closePath(); c.fill();
  c.fillStyle = '#8a5a3b';
  c.beginPath(); c.moveTo(140, 330); c.lineTo(240, 330); c.lineTo(224, 352); c.lineTo(156, 352); c.closePath(); c.fill();
  // Second boat.
  line(c, 380, 230, 380, 340, '#5a4632', 3);
  c.fillStyle = '#f2b705';
  c.beginPath(); c.moveTo(380, 238); c.lineTo(380, 330); c.lineTo(428, 330); c.closePath(); c.fill();
  c.fillStyle = '#5e3a22';
  c.beginPath(); c.moveTo(352, 340); c.lineTo(420, 340); c.lineTo(408, 356); c.lineTo(364, 356); c.closePath(); c.fill();
  // Buoy, extra one in B.
  fillCirc(c, 300, 430, 10, '#e8503a');
  fillRect(c, 296, 412, 8, 10, '#f2b705');
  if (B) {
    fillCirc(c, 420, 470, 10, '#e8503a');
    fillRect(c, 416, 452, 8, 10, '#f2b705');
  }
  // Pier and fish stall.
  fillRect(c, 0, 470, 600, 90, '#6b4423');
  fillRect(c, 0, 470, 600, 10, '#8a5a3b');
  for (let i = 0; i < 7; i++) line(c, 40 + i * 84, 480, 40 + i * 84, 556, '#5e3a22', 2);
  // Lantern: warm in A, green in B.
  line(c, 250, 470, 250, 300, '#2c3e50', 4);
  fillCirc(c, 250, 300, 12, B ? '#7bd5a0' : '#ffe066');
  c.strokeStyle = '#2c3e50';
  c.lineWidth = 2;
  circ(c, 250, 300, 16); c.stroke();
  // Fish on the stall: 4 in A, 3 in B.
  fillRect(c, 110, 500, 120, 26, '#8a5a3b');
  const fish = B ? 3 : 4;
  for (let i = 0; i < fish; i++) {
    const fx = 126 + i * 28;
    c.fillStyle = '#7fb3d5';
    c.beginPath(); c.ellipse(fx, 512, 11, 6, 0, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.moveTo(fx + 10, 512); c.lineTo(fx + 18, 506); c.lineTo(fx + 18, 518); c.closePath(); c.fill();
  }
  // Rope coil, missing in B.
  if (!B) {
    c.strokeStyle = '#d9c49a';
    c.lineWidth = 4;
    circ(c, 520, 480, 16); c.stroke();
    circ(c, 520, 480, 9); c.stroke();
  }
  // Crates and a gull on the pier.
  c.fillStyle = '#a8642f';
  c.fillRect(540, 500, 34, 30, '#a8642f');
  c.fillRect(500, 512, 30, 26, '#8a5a3b');
  c.fillStyle = '#fdf6e3';
  c.beginPath(); c.ellipse(60, 500, 12, 7, 0, 0, Math.PI * 2); c.fill();
  circ(c, 70, 492, 6); c.fill();
  void rng;
  c.restore();
}

// ---------------------------------------------------------------- scene 3
function drawPark(c, ox, oy, variant) {
  const B = variant === 'b';
  const rng = makeRng('park-decor');
  c.save();
  c.translate(ox, oy);
  const sky = c.createLinearGradient(0, 0, 0, 360);
  sky.addColorStop(0, '#aee2ff');
  sky.addColorStop(1, '#e8f7ff');
  c.fillStyle = sky;
  c.fillRect(0, 0, 600, 360);
  fillCirc(c, 520, 66, 30, '#ffdf5e');
  cloud(c, 130, 60, 1);
  if (!B) cloud(c, 200, 60, 0.8);
  cloud(c, 380, 40, 0.7);
  // Kite: red in A, blue in B.
  line(c, 450, 90, 430, 150, '#5a4632', 1.5);
  line(c, 450, 90, 470, 150, '#5a4632', 1.5);
  c.fillStyle = B ? '#3a7bd5' : '#e8503a';
  c.beginPath(); c.moveTo(450, 70); c.lineTo(478, 100); c.lineTo(450, 128); c.lineTo(424, 100); c.closePath(); c.fill();
  line(c, 450, 128, 430, 190, '#5a4632', 1.5);
  line(c, 450, 128, 470, 190, '#5a4632', 1.5);
  // Distant trees and lawn.
  fillRect(c, 0, 330, 600, 230, '#7cc46a');
  fillRect(c, 0, 330, 600, 26, '#8fd07a');
  tree(c, 70, 330, 1.2, '#4e9b47');
  tree(c, 540, 330, 1.1, '#5aa854');
  tree(c, 480, 340, 0.8, '#4e9b47');
  // Big oak with apples: 5 apples in A, 3 in B.
  tree(c, 150, 340, 1.6, '#3f8f3a');
  const apples = B ? [[132, 268], [168, 280], [150, 250]] : [[132, 268], [168, 280], [150, 250], [120, 292], [180, 256]];
  apples.forEach(([ax, ay]) => fillCirc(c, ax, ay, 6, '#d33'));
  // Path.
  c.fillStyle = '#e8dcc0';
  c.beginPath();
  c.moveTo(250, 360); c.lineTo(350, 360); c.lineTo(380, 560); c.lineTo(220, 560); c.closePath(); c.fill();
  // Pond.
  c.fillStyle = '#5fb3d9';
  c.beginPath(); c.ellipse(300, 430, 110, 42, 0, 0, Math.PI * 2); c.fill();
  c.strokeStyle = 'rgba(255,255,255,0.6)';
  c.lineWidth = 2;
  c.beginPath(); c.ellipse(300, 430, 80, 28, 0, 0.3, 2.4); c.stroke();
  // Ducks: 3 in A, 2 in B.
  const ducks = B ? [[270, 420], [330, 442]] : [[270, 420], [330, 442], [300, 408]];
  ducks.forEach(([dx, dy]) => {
    c.fillStyle = '#fdf6e3';
    c.beginPath(); c.ellipse(dx, dy, 12, 8, 0, 0, Math.PI * 2); c.fill();
    circ(c, dx + 10, dy - 7, 6); c.fill();
    c.fillStyle = '#f2b705';
    c.beginPath(); c.moveTo(dx + 15, dy - 7); c.lineTo(dx + 22, dy - 4); c.lineTo(dx + 15, dy - 3); c.closePath(); c.fill();
  });
  // Fountain: tall jet in A, low in B.
  c.fillStyle = '#9aa5ad';
  c.beginPath(); c.ellipse(300, 300, 46, 12, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#7fb3d5';
  c.beginPath(); c.ellipse(300, 298, 38, 8, 0, 0, Math.PI * 2); c.fill();
  const jetH = B ? 26 : 52;
  c.strokeStyle = '#8fd0f0';
  c.lineWidth = 4;
  c.beginPath(); c.moveTo(300, 296); c.lineTo(300, 296 - jetH); c.stroke();
  c.beginPath(); c.moveTo(300, 296 - jetH); c.quadraticCurveTo(282, 296 - jetH - 8, 272, 296); c.stroke();
  c.beginPath(); c.moveTo(300, 296 - jetH); c.quadraticCurveTo(318, 296 - jetH - 8, 328, 296); c.stroke();
  // Bench: middle slat missing in B.
  c.fillStyle = '#7a4a21';
  c.fillRect(440, 380, 110, 10, '#7a4a21');
  if (!B) c.fillRect(440, 396, 110, 10, '#7a4a21');
  c.fillRect(440, 412, 110, 8, '#7a4a21');
  c.fillRect(448, 420, 8, 34, '#5e3a22');
  c.fillRect(534, 420, 8, 34, '#5e3a22');
  c.fillRect(440, 356, 8, 30, '#5e3a22');
  c.fillRect(542, 356, 8, 30, '#5e3a22');
  // Lamp post: lit in A, dark in B.
  line(c, 90, 220, 90, 380, '#2c3e50', 5);
  fillCirc(c, 90, 214, 12, B ? '#5a6b7a' : '#ffe066');
  if (!B) {
    c.fillStyle = 'rgba(255, 224, 102, 0.25)';
    circ(c, 90, 220, 30); c.fill();
  }
  // Flowers: red in A, purple in B.
  const fc = B ? '#9b59b6' : '#e85a9a';
  for (let i = 0; i < 8; i++) {
    const fx = 60 + i * 22;
    fillCirc(c, fx, 500, 7, fc);
    line(c, fx, 507, fx, 522, '#1f8a70', 2);
  }
  for (let i = 0; i < 6; i++) {
    const fx = 420 + i * 22;
    fillCirc(c, fx, 520, 7, '#f2b705');
    line(c, fx, 527, fx, 540, '#1f8a70', 2);
  }
  // Dog with collar: red collar in A, none in B.
  c.fillStyle = '#b5763a';
  c.beginPath(); c.ellipse(350, 486, 22, 12, 0, 0, Math.PI * 2); c.fill();
  circ(c, 372, 474, 10); c.fill();
  if (!B) {
    c.strokeStyle = '#e8503a';
    c.lineWidth = 4;
    c.beginPath(); c.arc(370, 478, 8, 0.3, Math.PI - 0.3); c.stroke();
  }
  // Squirrel, extra in B.
  if (B) {
    c.fillStyle = '#c07a3a';
    c.beginPath(); c.ellipse(520, 306, 14, 10, 0, 0, Math.PI * 2); c.fill();
    circ(c, 532, 296, 7); c.fill();
    c.strokeStyle = '#c07a3a';
    c.lineWidth = 5;
    c.beginPath(); c.moveTo(508, 300); c.quadraticCurveTo(494, 280, 506, 268); c.stroke();
  }
  // Picnic blanket and ball.
  c.fillStyle = '#e8503a';
  c.beginPath();
  c.moveTo(120, 520); c.lineTo(200, 520); c.lineTo(210, 548); c.lineTo(110, 548); c.closePath(); c.fill();
  c.fillStyle = '#fdf6e3';
  c.beginPath();
  c.moveTo(150, 520); c.lineTo(170, 520); c.lineTo(172, 548); c.lineTo(148, 548); c.closePath(); c.fill();
  fillCirc(c, 230, 500, 12, '#3a7bd5');
  fillCirc(c, 230, 500, 6, '#fdf6e3');
  void rng;
  c.restore();
}

export const SCENES = [
  {
    id: 'market', name: 'Morning Market', tagline: 'Stalls and one sneaky cat.',
    diffs: [
      { id: 'rays', x: 520, y: 70, r: 40, kind: 'missing', label: 'sun rays' },
      { id: 'awning', x: 115, y: 234, r: 36, kind: 'colour', label: 'awning colour' },
      { id: 'basket', x: 118, y: 332, r: 26, kind: 'missing', label: 'apple basket' },
      { id: 'extracat', x: 505, y: 432, r: 26, kind: 'extra', label: 'extra cat' },
      { id: 'sign', x: 320, y: 208, r: 40, kind: 'sign', label: 'shop sign' },
      { id: 'bird', x: 298, y: 62, r: 22, kind: 'missing', label: 'bird' },
      { id: 'balloon', x: 478, y: 103, r: 30, kind: 'count', label: 'balloon count' },
      { id: 'flower', x: 472, y: 287, r: 30, kind: 'colour', label: 'flower colour' },
      { id: 'hat', x: 102, y: 330, r: 22, kind: 'missing', label: 'vendor hat' },
      { id: 'crate', x: 272, y: 465, r: 26, kind: 'moved', label: 'moved crate', bx: 322, by: 465 },
    ],
    draw: drawMarket,
  },
  {
    id: 'harbour', name: 'Harbour at Dusk', tagline: 'Boats and a sleepy lighthouse.',
    diffs: [
      { id: 'beam', x: 505, y: 120, r: 28, kind: 'missing', label: 'lighthouse beam' },
      { id: 'sail', x: 205, y: 250, r: 44, kind: 'colour', label: 'sail colour' },
      { id: 'gull', x: 300, y: 70, r: 22, kind: 'missing', label: 'gull' },
      { id: 'buoy', x: 420, y: 470, r: 26, kind: 'extra', label: 'extra buoy' },
      { id: 'lantern', x: 250, y: 300, r: 26, kind: 'colour', label: 'lantern colour' },
      { id: 'fish', x: 210, y: 512, r: 24, kind: 'count', label: 'fish count' },
      { id: 'rope', x: 520, y: 480, r: 26, kind: 'missing', label: 'rope coil' },
      { id: 'window', x: 90, y: 240, r: 24, kind: 'colour', label: 'lit window' },
      { id: 'flag', x: 518, y: 74, r: 24, kind: 'colour', label: 'flag colour' },
      { id: 'star', x: 470, y: 90, r: 22, kind: 'count', label: 'star count' },
    ],
    draw: drawHarbour,
  },
  {
    id: 'park', name: 'City Park', tagline: 'Ducks, kites and a busy oak.',
    diffs: [
      { id: 'duck', x: 300, y: 420, r: 26, kind: 'count', label: 'duck count' },
      { id: 'kite', x: 450, y: 90, r: 26, kind: 'colour', label: 'kite colour' },
      { id: 'lamp', x: 90, y: 220, r: 30, kind: 'colour', label: 'lamp light' },
      { id: 'slat', x: 495, y: 401, r: 36, kind: 'missing', label: 'bench slat' },
      { id: 'flower', x: 137, y: 507, r: 30, kind: 'colour', label: 'flower colour' },
      { id: 'collar', x: 350, y: 480, r: 26, kind: 'missing', label: 'dog collar' },
      { id: 'apple', x: 150, y: 270, r: 28, kind: 'count', label: 'apple count' },
      { id: 'jet', x: 300, y: 276, r: 32, kind: 'changed', label: 'fountain jet' },
      { id: 'squirrel', x: 520, y: 300, r: 26, kind: 'extra', label: 'extra squirrel' },
      { id: 'cloud', x: 200, y: 60, r: 24, kind: 'missing', label: 'cloud' },
    ],
    draw: drawPark,
  },
];

// ---------------------------------------------------------------- scene 4
function drawStation(c, ox, oy, variant) {
  const B = variant === 'b';
  const rng = makeRng('station-decor');
  c.save();
  c.translate(ox, oy);
  const sky = c.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#cfd8dc');
  sky.addColorStop(1, '#eceff1');
  c.fillStyle = sky;
  c.fillRect(0, 0, 600, 300);
  cloud(c, 120, 60, 1);
  cloud(c, 420, 44, 0.8);
  // Station roof and clock tower.
  fillRect(c, 0, 150, 600, 150, '#8d6e63');
  fillRect(c, 0, 150, 600, 14, '#5d4037');
  fillRect(c, 240, 40, 120, 120, '#a1887f');
  c.beginPath(); c.moveTo(230, 40); c.lineTo(300, 8); c.lineTo(370, 40); c.closePath();
  c.fillStyle = '#5d4037'; c.fill();
  fillCirc(c, 300, 96, 34, '#fdf6e3');
  c.strokeStyle = '#2c3e50'; c.lineWidth = 3;
  circ(c, 300, 96, 34); c.stroke();
  // Clock hands: 10:10 in A, 4:40 in B.
  const hourA = -2.1, minA = 0.7, hourB = 2.4, minB = -1.2;
  line(c, 300, 96, 300 + Math.cos(B ? hourB : hourA) * 16, 96 + Math.sin(B ? hourB : hourA) * 16, '#2c3e50', 4);
  line(c, 300, 96, 300 + Math.cos(B ? minB : minA) * 26, 96 + Math.sin(B ? minB : minA) * 26, '#2c3e50', 3);
  fillCirc(c, 300, 96, 3, '#2c3e50');
  // Platform sign: PLATFORM 2 in A, PLATFORM 3 in B.
  fillRect(c, 220, 168, 160, 40, '#2c3e50');
  fillRect(c, 226, 174, 148, 28, '#fdf6e3');
  text(c, B ? 'PLATFORM 3' : 'PLATFORM 2', 300, 188, 16, '#2c3e50', 'bold');
  // Train.
  c.fillStyle = '#3a7bd5';
  rr(c, 40, 250, 340, 110, 14); c.fill();
  c.fillStyle = '#e8503a';
  c.fillRect(40, 330, 340, 12);
  for (let i = 0; i < 4; i++) {
    const wx = 70 + i * 80;
    const lit = B ? i !== 1 : true;
    fillRect(c, wx, 268, 56, 40, lit ? '#ffe9a8' : '#2c3e50');
    c.strokeStyle = '#2c3e50'; c.lineWidth = 2;
    c.strokeRect(wx, 268, 56, 40);
  }
  // Smoke: 3 puffs in A, 2 in B.
  const puffs = B ? [[150, 120], [180, 96]] : [[150, 120], [180, 96], [205, 122]];
  puffs.forEach(([px, py]) => { fillCirc(c, px, py, 14, 'rgba(255,255,255,0.85)'); });
  // Ticket booth.
  fillRect(c, 420, 220, 130, 140, '#6b4423');
  fillRect(c, 410, 206, 150, 16, '#5d4037');
  fillRect(c, 440, 250, 90, 60, '#ffe9a8');
  text(c, 'TICKETS', 485, 280, 14, '#5d4037', 'bold');
  // Poster: teal in A, purple in B.
  fillRect(c, 520, 280, 60, 80, B ? '#9b59b6' : '#1f8a70');
  text(c, 'VISIT', 550, 306, 12, '#ffffff', 'bold');
  text(c, 'THE SEA', 550, 326, 12, '#ffffff', 'bold');
  fillCirc(c, 550, 348, 8, '#ffe066');
  // Platform ground.
  fillRect(c, 0, 360, 600, 200, '#b0a08a');
  fillRect(c, 0, 360, 600, 8, '#f2b705');
  for (let i = 0; i < 8; i++) line(c, i * 80, 400, i * 80 + 30, 400, '#8d7d68', 2);
  // Benches: one bench missing in B (the one at 350).
  function bench(bx) {
    c.fillStyle = '#7a4a21';
    c.fillRect(bx, 420, 100, 10, '#7a4a21');
    c.fillRect(bx, 436, 100, 8, '#7a4a21');
    c.fillRect(bx + 6, 444, 8, 30, '#5e3a22');
    c.fillRect(bx + 86, 444, 8, 30, '#5e3a22');
  }
  bench(90);
  if (!B) bench(350);
  // Lamp post: lit in A, dark in B.
  line(c, 520, 200, 520, 400, '#2c3e50', 5);
  fillCirc(c, 520, 194, 12, B ? '#5a6b7a' : '#ffe066');
  if (!B) { c.fillStyle = 'rgba(255, 224, 102, 0.25)'; circ(c, 520, 200, 30); c.fill(); }
  // Suitcases: red in A, green in B; extra suitcase in B.
  c.fillStyle = B ? '#1f8a70' : '#e8503a';
  rr(c, 100, 460, 44, 32, 5); c.fill();
  c.fillStyle = '#2c3e50';
  c.fillRect(118, 452, 8, 10, '#2c3e50');
  c.fillStyle = '#3a7bd5';
  rr(c, 160, 466, 38, 28, 5); c.fill();
  if (B) {
    c.fillStyle = '#f2b705';
    rr(c, 480, 462, 40, 30, 5); c.fill();
  }
  // Pigeons: 2 in A, 1 in B.
  function pigeon(px, py) {
    c.fillStyle = '#7f8c8d';
    c.beginPath(); c.ellipse(px, py, 10, 7, 0, 0, Math.PI * 2); c.fill();
    circ(c, px + 9, py - 6, 5); c.fill();
  }
  pigeon(420, 500);
  if (!B) pigeon(452, 508);
  // Waiting traveller.
  person(c, 280, 500, 1, '#9b59b6', '#33475b', '#e8b98a', '#2c3e50');
  void rng;
  c.restore();
}

// ---------------------------------------------------------------- scene 5
function drawBeach(c, ox, oy, variant) {
  const B = variant === 'b';
  const rng = makeRng('beach-decor');
  c.save();
  c.translate(ox, oy);
  const sky = c.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#7ec8f0');
  sky.addColorStop(1, '#cfeeff');
  c.fillStyle = sky;
  c.fillRect(0, 0, 600, 300);
  fillCirc(c, 90, 70, 32, '#ffdf5e');
  cloud(c, 240, 60, 1);
  if (!B) cloud(c, 400, 60, 0.8);
  cloud(c, 520, 90, 0.7);
  if (!B) bird(c, 250, 70, 1);
  bird(c, 310, 50, 0.8);
  if (B) bird(c, 180, 90, 0.9);
  // Sea.
  const sea = c.createLinearGradient(0, 300, 0, 430);
  sea.addColorStop(0, '#2a9db5');
  sea.addColorStop(1, '#1f7a8c');
  c.fillStyle = sea;
  c.fillRect(0, 300, 600, 130);
  c.strokeStyle = 'rgba(255,255,255,0.5)';
  c.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    const wy = 320 + i * 22;
    c.beginPath();
    c.moveTo(10, wy);
    c.quadraticCurveTo(150, wy - 10, 300, wy);
    c.quadraticCurveTo(450, wy + 10, 590, wy);
    c.stroke();
  }
  // Sand.
  fillRect(c, 0, 430, 600, 130, '#f2d8a0');
  c.fillStyle = '#e8c88a';
  for (let i = 0; i < 24; i++) {
    const x = Math.floor(rng() * 580) + 10;
    const y = 440 + Math.floor(rng() * 105);
    circ(c, x, y, 2); c.fill();
  }
  // Umbrella: red stripes in A, blue in B.
  const stripe = B ? '#3a7bd5' : '#e8503a';
  line(c, 150, 180, 150, 330, '#7a4a21', 5);
  c.beginPath();
  c.moveTo(60, 200); c.quadraticCurveTo(150, 130, 240, 200); c.closePath();
  c.fillStyle = stripe; c.fill();
  c.beginPath();
  c.moveTo(105, 188); c.quadraticCurveTo(150, 150, 195, 188); c.closePath();
  c.fillStyle = '#fdf6e3'; c.fill();
  // Towel: red stripes in A, plain in B.
  c.fillStyle = '#3a7bd5';
  c.fillRect(300, 460, 110, 40, '#3a7bd5');
  if (!B) {
    c.fillStyle = '#fdf6e3';
    c.fillRect(320, 460, 14, 40, '#fdf6e3');
    c.fillRect(350, 460, 14, 40, '#fdf6e3');
    c.fillRect(380, 460, 14, 40, '#fdf6e3');
  }
  // Sandcastle with flag: flag red in A, yellow in B.
  c.fillStyle = '#e8c88a';
  c.fillRect(390, 400, 70, 50, '#e8c88a');
  c.beginPath(); c.moveTo(390, 400); c.lineTo(405, 372); c.lineTo(420, 400); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(425, 400); c.lineTo(440, 372); c.lineTo(455, 400); c.closePath(); c.fill();
  line(c, 425, 372, 425, 340, '#5a4632', 3);
  c.fillStyle = B ? '#f2d705' : '#e8503a';
  c.beginPath(); c.moveTo(425, 340); c.lineTo(452, 347); c.lineTo(425, 356); c.closePath(); c.fill();
  // Bucket, missing in B.
  if (!B) {
    c.fillStyle = '#e8503a';
    c.beginPath(); c.moveTo(190, 470); c.lineTo(210, 470); c.lineTo(206, 496); c.lineTo(194, 496); c.closePath(); c.fill();
    c.strokeStyle = '#5a4632'; c.lineWidth = 2;
    c.beginPath(); c.arc(200, 470, 10, Math.PI, 0); c.stroke();
  }
  // Crab, missing in B.
  if (!B) {
    c.fillStyle = '#e8503a';
    c.beginPath(); c.ellipse(300, 506, 14, 10, 0, 0, Math.PI * 2); c.fill();
    circ(c, 292, 496, 5); c.fill();
    circ(c, 308, 496, 5); c.fill();
    line(c, 286, 508, 274, 514, '#e8503a', 3);
    line(c, 314, 508, 326, 514, '#e8503a', 3);
  }
  // Starfish: 3 in A, 2 in B.
  function starfish(sx, sy) {
    c.fillStyle = '#f2a65a';
    c.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      const a2 = a + Math.PI / 5;
      c.lineTo(sx + Math.cos(a) * 12, sy + Math.sin(a) * 12);
      c.lineTo(sx + Math.cos(a2) * 5, sy + Math.sin(a2) * 5);
    }
    c.closePath(); c.fill();
  }
  starfish(500, 500);
  starfish(540, 520);
  if (!B) starfish(470, 528);
  // Surfboard: teal in A, orange in B.
  c.fillStyle = B ? '#e8823a' : '#1f8a70';
  c.beginPath(); c.ellipse(520, 300, 14, 46, 0.5, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#fdf6e3';
  c.beginPath(); c.ellipse(520, 300, 6, 20, 0.5, 0, Math.PI * 2); c.fill();
  // Ice cream stand: 2 scoops in A, 3 in B.
  fillRect(c, 60, 330, 70, 90, '#fdf6e3');
  fillRect(c, 54, 318, 82, 14, '#e8503a');
  text(c, 'ICE CREAM', 95, 352, 11, '#e8503a', 'bold');
  fillCirc(c, 95, 300, 12, '#f2a65a');
  fillCirc(c, 95, 282, 11, '#e85a9a');
  if (B) fillCirc(c, 95, 264, 10, '#7bd5a0');
  // Beach ball.
  fillCirc(c, 470, 470, 16, '#e8503a');
  fillCirc(c, 470, 470, 9, '#fdf6e3');
  // Swimmer.
  fillCirc(c, 240, 360, 10, '#e8b98a');
  c.fillStyle = '#3a7bd5';
  c.beginPath(); c.ellipse(240, 374, 16, 7, 0, 0, Math.PI * 2); c.fill();
  c.restore();
}

// ---------------------------------------------------------------- scene 6
function drawLibrary(c, ox, oy, variant) {
  const B = variant === 'b';
  const rng = makeRng('library-decor');
  c.save();
  c.translate(ox, oy);
  // Room.
  fillRect(c, 0, 0, 600, 560, '#2b3a55');
  fillRect(c, 0, 430, 600, 130, '#6b4423');
  // Window with moon: full in A, crescent in B.
  fillRect(c, 460, 40, 110, 130, '#1a2440');
  c.fillStyle = '#0f1830';
  c.fillRect(466, 46, 98, 118, '#0f1830');
  fillCirc(c, 515, 80, 26, '#ffe9a8');
  if (B) fillCirc(c, 526, 74, 24, '#0f1830');
  c.strokeStyle = '#6b4423'; c.lineWidth = 4;
  line(c, 515, 46, 515, 164, '#6b4423', 4);
  line(c, 466, 105, 564, 105, '#6b4423', 4);
  // Bookshelves.
  function shelf(sx, sy, w) {
    c.fillStyle = '#5d4037';
    c.fillRect(sx, sy, w, 180, '#5d4037');
    c.fillStyle = '#3e2723';
    c.fillRect(sx + 6, sy + 6, w - 12, 168, '#3e2723');
    const cols = ['#c0392b', '#3a7bd5', '#1f8a70', '#f2b705', '#9b59b6', '#e8823a'];
    for (let row = 0; row < 3; row++) {
      for (let i = 0; i < 8; i++) {
        const bx = sx + 12 + i * ((w - 24) / 8);
        const bh = 40 + ((i * 7 + row * 13) % 14);
        c.fillStyle = cols[(i + row) % cols.length];
        c.fillRect(bx, sy + 52 + row * 56 - bh + 8, (w - 24) / 8 - 4, bh, cols[(i + row) % cols.length]);
      }
      c.fillStyle = '#5d4037';
      c.fillRect(sx + 6, sy + 56 + row * 56, w - 12, 6, '#5d4037');
    }
  }
  shelf(30, 60, 200);
  shelf(30, 260, 200);
  // One spine changes colour: red in A, green in B (top shelf, 3rd book).
  c.fillStyle = B ? '#1f8a70' : '#c0392b';
  c.fillRect(30 + 12 + 2 * ((200 - 24) / 8), 60 + 52 - 44 + 8, (200 - 24) / 8 - 4, 44, B ? '#1f8a70' : '#c0392b');
  // Wall clock: 8:00 in A, 3:30 in B.
  fillCirc(c, 300, 120, 30, '#fdf6e3');
  c.strokeStyle = '#2c3e50'; c.lineWidth = 3;
  circ(c, 300, 120, 30); c.stroke();
  const chA = 2.6, cmA = -1.57, chB = 0.5, cmB = 1.57;
  line(c, 300, 120, 300 + Math.cos(B ? chB : chA) * 13, 120 + Math.sin(B ? chB : chA) * 13, '#2c3e50', 4);
  line(c, 300, 120, 300 + Math.cos(B ? cmB : cmA) * 21, 120 + Math.sin(B ? cmB : cmA) * 21, '#2c3e50', 3);
  // Desk with lamp: lit in A, dark in B.
  fillRect(c, 250, 380, 200, 16, '#8a5a3b');
  fillRect(c, 258, 396, 12, 50, '#5d4037');
  fillRect(c, 430, 396, 12, 50, '#5d4037');
  line(c, 300, 380, 300, 330, '#2c3e50', 4);
  fillCirc(c, 300, 322, 14, B ? '#5a6b7a' : '#ffe066');
  if (!B) { c.fillStyle = 'rgba(255, 224, 102, 0.22)'; circ(c, 300, 330, 44); c.fill(); }
  // Open book on desk.
  c.fillStyle = '#fdf6e3';
  c.beginPath(); c.moveTo(340, 380); c.lineTo(380, 366); c.lineTo(420, 380); c.lineTo(380, 394); c.closePath(); c.fill();
  c.strokeStyle = '#9aa5ad'; c.lineWidth = 1;
  line(c, 348, 378, 372, 372, '#9aa5ad', 1);
  line(c, 388, 372, 412, 378, '#9aa5ad', 1);
  // Teacup, missing in B.
  if (!B) {
    c.fillStyle = '#3a7bd5';
    rr(c, 380, 356, 26, 20, 4); c.fill();
    c.strokeStyle = '#3a7bd5'; c.lineWidth = 3;
    c.beginPath(); c.arc(408, 366, 7, -1.2, 1.2); c.stroke();
  }
  // Globe, moved in B.
  const gx = B ? 200 : 150;
  fillCirc(c, gx, 430, 20, '#3a7bd5');
  fillCirc(c, gx - 6, 426, 8, '#1f8a70');
  fillCirc(c, gx + 7, 434, 6, '#1f8a70');
  c.fillStyle = '#5d4037';
  c.fillRect(gx - 3, 450, 6, 14, '#5d4037');
  // Rug: checked in A, striped in B.
  if (B) {
    c.fillStyle = '#8e2f2f';
    c.fillRect(240, 480, 220, 56, '#8e2f2f');
    c.fillStyle = '#d9a441';
    for (let i = 0; i < 5; i++) c.fillRect(240 + i * 44, 480, 12, 56, '#d9a441');
  } else {
    c.fillStyle = '#8e2f2f';
    c.fillRect(240, 480, 220, 56, '#8e2f2f');
    c.fillStyle = '#d9a441';
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) c.fillRect(240 + i * 55, 480 + j * 28, 27, 14, '#d9a441');
  }
  // Ladder against shelf.
  line(c, 240, 240, 260, 440, '#a8642f', 5);
  line(c, 268, 240, 288, 440, '#a8642f', 5);
  for (let i = 0; i < 5; i++) line(c, 244 + i * 4, 270 + i * 34, 272 + i * 4, 270 + i * 34, '#a8642f', 3);
  // Cat asleep on rug, missing in B.
  if (!B) cat(c, 420, 470, 1, '#5a4632');
  // Candle, extra in B.
  if (B) {
    c.fillStyle = '#fdf6e3';
    c.fillRect(514, 360, 12, 26, '#fdf6e3');
    fillCirc(c, 520, 354, 6, '#ffcf3d');
  }
  // Plant, missing in B.
  if (!B) {
    c.fillStyle = '#c0392b';
    c.beginPath(); c.moveTo(80, 420); c.lineTo(100, 420); c.lineTo(96, 448); c.lineTo(84, 448); c.closePath(); c.fill();
    c.strokeStyle = '#1f8a70'; c.lineWidth = 4;
    c.beginPath(); c.moveTo(90, 420); c.quadraticCurveTo(76, 396, 70, 384); c.stroke();
    c.beginPath(); c.moveTo(90, 420); c.quadraticCurveTo(104, 394, 112, 382); c.stroke();
  }
  // Armchair.
  c.fillStyle = '#7a2e2e';
  rr(c, 480, 400, 90, 60, 12); c.fill();
  rr(c, 480, 360, 90, 48, 12); c.fill();
  void rng;
  c.restore();
}

SCENES.push(
  {
    id: 'station', name: 'Old Train Station', tagline: 'Trains, tickets, two pigeons.',
    diffs: [
      { id: 'clock', x: 300, y: 90, r: 28, kind: 'changed', label: 'clock time' },
      { id: 'platform', x: 340, y: 188, r: 28, kind: 'sign', label: 'platform sign' },
      { id: 'suitcase', x: 120, y: 460, r: 26, kind: 'colour', label: 'suitcase colour' },
      { id: 'pigeon', x: 452, y: 508, r: 24, kind: 'count', label: 'pigeon count' },
      { id: 'window', x: 178, y: 288, r: 26, kind: 'colour', label: 'train window' },
      { id: 'lamp', x: 520, y: 200, r: 30, kind: 'colour', label: 'lamp light' },
      { id: 'extrasuit', x: 500, y: 477, r: 26, kind: 'extra', label: 'extra suitcase' },
      { id: 'smoke', x: 205, y: 122, r: 26, kind: 'count', label: 'smoke puffs' },
      { id: 'poster', x: 550, y: 320, r: 34, kind: 'colour', label: 'poster colour' },
      { id: 'bench', x: 400, y: 447, r: 40, kind: 'missing', label: 'bench' },
    ],
    draw: drawStation,
  },
  {
    id: 'beach', name: 'Beach Day', tagline: 'Sun, sand and one busy crab.',
    diffs: [
      { id: 'umbrella', x: 150, y: 180, r: 40, kind: 'colour', label: 'umbrella stripes' },
      { id: 'flag', x: 438, y: 347, r: 26, kind: 'colour', label: 'castle flag' },
      { id: 'crab', x: 300, y: 500, r: 26, kind: 'missing', label: 'crab' },
      { id: 'starfish', x: 470, y: 528, r: 26, kind: 'count', label: 'starfish count' },
      { id: 'surf', x: 520, y: 300, r: 34, kind: 'colour', label: 'surfboard colour' },
      { id: 'bucket', x: 200, y: 470, r: 26, kind: 'missing', label: 'bucket' },
      { id: 'cloud', x: 400, y: 60, r: 24, kind: 'missing', label: 'cloud' },
      { id: 'scoops', x: 95, y: 282, r: 26, kind: 'count', label: 'ice cream scoops' },
      { id: 'towel', x: 355, y: 480, r: 26, kind: 'changed', label: 'towel stripes' },
      { id: 'gull', x: 250, y: 70, r: 24, kind: 'extra', label: 'extra gull', bx: 180, by: 90 },
    ],
    draw: drawBeach,
  },
  {
    id: 'library', name: 'Night Library', tagline: 'Quiet shelves and a full moon.',
    diffs: [
      { id: 'spine', x: 95, y: 98, r: 26, kind: 'colour', label: 'book spine' },
      { id: 'moon', x: 515, y: 80, r: 28, kind: 'changed', label: 'moon phase' },
      { id: 'cat', x: 420, y: 470, r: 26, kind: 'missing', label: 'cat' },
      { id: 'lamp', x: 300, y: 322, r: 30, kind: 'colour', label: 'lamp light' },
      { id: 'globe', x: 150, y: 430, r: 26, kind: 'moved', label: 'moved globe', bx: 200, by: 430 },
      { id: 'clock', x: 300, y: 120, r: 26, kind: 'changed', label: 'clock time' },
      { id: 'teacup', x: 393, y: 366, r: 26, kind: 'missing', label: 'teacup' },
      { id: 'rug', x: 350, y: 508, r: 40, kind: 'changed', label: 'rug pattern' },
      { id: 'candle', x: 520, y: 380, r: 26, kind: 'extra', label: 'extra candle' },
      { id: 'plant', x: 90, y: 420, r: 26, kind: 'missing', label: 'plant' },
    ],
    draw: drawLibrary,
  },
);

// Draw one scene into a panel rect, clipping to it.
export function drawSceneInto(ctx, scene, variant, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.translate(x, y);
  ctx.scale(w / 600, h / 560);
  scene.draw(ctx, 0, 0, variant);
  ctx.restore();
}
