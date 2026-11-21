// Spot the Difference entry (Node 22, standard library only): the game is this
// directory's game/ folder, plain static files a desktop browser loads offline
// (game/index.html and its ES modules, no library and no network request), and
// the program hands it in. It copies game/ and screenshots/ from beside this
// file to /output and writes /output/dossier.json, the summary the judge reads,
// with the vendored make.fun library. Six original vector-drawn scenes, each
// painted twice side by side with 8-10 planted differences, three difficulty
// tiers, streak scoring, hints and a timer. Screenshots are real renders of
// the game's own code in a browser (see shots in game/src/shots.js).
//
// Serve it locally with `node serve.ts` (or any static server over game/),
// then open http://localhost:8080. Outside the grader's container,
// MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Verification step: the screenshots this build hands in must exist and each
// fit the gate's 256 KiB cap, or the entry is refused before it is judged.
const shotsDir = join(out, 'screenshots');
const shots = readdirSync(shotsDir).filter((n) => !n.startsWith('.')).sort();
if (shots.length < 3 || shots.length > 4) throw new Error('expected 3-4 screenshots, found ' + shots.length);
for (const name of shots) {
  const size = statSync(join(shotsDir, name)).size;
  if (size > 262144) throw new Error('screenshot over 256 KiB: ' + name + ' (' + size + ' bytes)');
}
const gameFiles = readdirSync(join(out, 'game'), { recursive: true });
console.log('build summary: game files=' + gameFiles.length + ' screenshots=' + shots.join(',') + ' (' + shots.map((n) => statSync(join(shotsDir, n)).size).join('+') + ' bytes)');

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files in game/ or 48 MiB of game
// files, in all, or a path under game/ over 1000 bytes: game/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
