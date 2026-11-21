// levels.js — level data: which scene, how many differences, time and hints.
import { TIERS } from './config.js';
import { SCENES } from './scenes.js';
import { makeRng, shuffleWith } from './random.js';

export function sceneCount() {
  return SCENES.length;
}

export function sceneByIndex(i) {
  return SCENES[((i % SCENES.length) + SCENES.length) % SCENES.length];
}

// Build one level: a scene plus the differences the tier asks for, shuffled
// deterministically by seed so a given seed always plays the same hunt.
export function buildLevel(sceneIndex, tierKey, seed) {
  const tier = TIERS[tierKey] || TIERS.medium;
  const scene = sceneByIndex(sceneIndex);
  const rng = makeRng('level-' + scene.id + '-' + tierKey + '-' + (seed || 1));
  const picked = shuffleWith(rng, scene.diffs).slice(0, tier.diffs);
  return {
    sceneIndex: sceneIndex % SCENES.length,
    scene,
    tier,
    seed: seed || 1,
    diffs: picked,
    timeTotal: tier.time,
    hintsTotal: tier.hints,
  };
}

// A shot/demo level: exactly `count` differences, fixed order, fixed time.
export function buildShotLevel(sceneIndex, count, timeLeft) {
  const scene = sceneByIndex(sceneIndex);
  return {
    sceneIndex: sceneIndex % SCENES.length,
    scene,
    tier: { key: 'shot', label: 'Demo', diffs: count, time: timeLeft, hints: 3, blurb: count + ' differences' },
    seed: 1,
    diffs: scene.diffs.slice(0, count),
    timeTotal: timeLeft,
    hintsTotal: 3,
  };
}

export function nextSceneIndex(sceneIndex) {
  return (sceneIndex + 1) % SCENES.length;
}
