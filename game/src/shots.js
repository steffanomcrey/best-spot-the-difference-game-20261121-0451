// shots.js — deterministic states for screenshots, driven by query params.
//   ?shot=start            menu / level select
//   ?shot=play&seed=1      scene 1 mid-hunt, 4 of 8 found, 4 remain
//   ?shot=hint&seed=1      same state with a hint ring on an unfound difference
//   ?shot=win&seed=1       level-complete overlay, 3 stars
export function parseShot(search) {
  const q = new URLSearchParams(search || '');
  return {
    shot: q.get('shot') || 'start',
    seed: parseInt(q.get('seed') || '1', 10) || 1,
  };
}

export function applyShot(world, search) {
  const { shot } = parseShot(search);
  if (shot === 'play' || shot === 'hint') {
    const level = world.level;
    world.startLevel(0, 'medium', {
      shot: true,
      count: 8,
      timeLeft: 150,
      foundIds: [],
    });
    const firstFour = world.level.diffs.slice(0, 4).map((d) => d.id);
    firstFour.forEach((id) => world.found.add(id));
    world.score = firstFour.length * 100;
    world.streak = firstFour.length;
    world.timeLeft = 96;
    if (shot === 'hint') {
      const unfound = world.level.diffs.filter((d) => !world.found.has(d.id));
      if (unfound.length > 0) {
        world.hintDiff = unfound[0];
        world.hintUntil = 999999;
      }
    }
    return shot;
  }
  if (shot === 'win') {
    world.startLevel(0, 'medium', { shot: true, count: 8, timeLeft: 150, foundIds: [] });
    world.level.diffs.forEach((d) => world.found.add(d.id));
    world.timeLeft = 110;
    world.score = 8 * 100 + 110 * 5;
    world.completeLevel();
    return shot;
  }
  world.toMenu();
  return 'start';
}
