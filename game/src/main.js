// main.js — boot and game loop for Spot the Difference.
import { CANVAS_W, CANVAS_H } from './config.js';
import { World } from './world.js';
import { SoundEngine } from './audio.js';
import { render } from './render.js';
import { attachInput } from './input.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

const sound = new SoundEngine();
const world = new World(sound);
attachInput(canvas, world, sound);
applyShot(world, window.location.search);

// Test hook: Playwright and the shot harness read game state here.
window.__game = { world, sound, canvas };

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  world.update(dt);
  render(ctx, world, now / 1000);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
