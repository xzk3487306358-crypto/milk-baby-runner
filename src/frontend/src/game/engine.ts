import type { Character } from "../lib/characters";
import {
  CHASER_RULES,
  COIN,
  COMBO_TIMEOUT,
  LANE_COUNT,
  PHYSICS,
  POWER_UPS,
  POWER_UP_IDS,
  type PowerUpId,
  SCORE_PER_METER,
  START_LANE,
  comboMultiplier,
  speedAtDistance,
} from "../lib/gameConfig";
import { addCoin, laneX, spawnAhead, spawnSkyCoins } from "./spawner";
import {
  COIN_POOL,
  type CharacterTuning,
  DESPAWN_BEHIND,
  type GameState,
  MAX_STEP,
  OBSTACLE_POOL,
  type Obstacle,
  POWERUP_POOL,
} from "./types";

export const CHASER_FAR = 18;
export const CHASER_NEAR = 3.5;
const FLY_HEIGHT = 5;

export function tuningFor(character: Character): CharacterTuning {
  // h' = H·h0, airtime' = D·T0  →  v' = v0·H/D, g' = g0·H/D²
  const { jumpHeight: H, jumpDistance: D, rollSpeed } = character.ability;
  return {
    jumpVelocity: (PHYSICS.jumpVelocity * H) / D,
    gravity: (PHYSICS.gravity * H) / (D * D),
    rollDuration: PHYSICS.rollDuration / rollSpeed,
    shoutsWhenFlying: character.catchphraseTrigger === "flight",
  };
}

function emptyActive(): Record<PowerUpId, number> {
  return {
    magnet: 0,
    rocketShoes: 0,
    milkShield: 0,
    doubleCoins: 0,
    naiFamilyUltimate: 0,
  };
}

export function createGame(tuning: CharacterTuning): GameState {
  const obstacles: Obstacle[] = Array.from({ length: OBSTACLE_POOL }, () => ({
    active: false,
    type: "barrier",
    lane: 0,
    at: 0,
    speed: 0,
    openLane: -1,
    passed: false,
    cleared: false,
    clearedT: 0,
  }));
  const state: GameState = {
    status: "running",
    time: 0,
    distance: 0,
    speed: speedAtDistance(0),
    score: 0,
    coins: 0,
    combo: 0,
    multiplier: 1,
    maxCombo: 0,
    comboTimer: 0,
    runner: {
      lane: START_LANE,
      x: laneX(START_LANE),
      y: 0,
      vy: 0,
      grounded: true,
      rollTimer: 0,
      stride: 0,
    },
    tuning,
    obstacles,
    coinPool: Array.from({ length: COIN_POOL }, () => ({
      active: false,
      lane: 0,
      at: 0,
      x: 0,
      y: 0,
      magnetized: false,
    })),
    powerUps: Array.from({ length: POWERUP_POOL }, () => ({
      active: false,
      id: "magnet" as PowerUpId,
      lane: 0,
      at: 0,
      y: 0,
    })),
    active: emptyActive(),
    chaserGap: CHASER_FAR,
    lastHitTime: -1,
    invulnTimer: 0,
    slowTimer: 0,
    shake: 0,
    caughtTimer: 0,
    nextSpawnAt: 45,
    queue: [],
    events: [],
    rng: (Date.now() & 0x7fffffff) | 1,
  };
  // Welcome coin run straight ahead.
  for (let i = 0; i < 10; i++) addCoin(state, START_LANE, 12 + i * 2.2, 1);
  return state;
}

export function isFlying(s: GameState): boolean {
  return s.active.rocketShoes > 0;
}

export function isInvulnerable(s: GameState): boolean {
  return s.invulnTimer > 0 || s.active.naiFamilyUltimate > 0 || isFlying(s);
}

function bumpCombo(s: GameState, amount: number) {
  const before = s.multiplier;
  s.combo += amount;
  s.comboTimer = COMBO_TIMEOUT;
  s.maxCombo = Math.max(s.maxCombo, s.combo);
  s.multiplier = comboMultiplier(s.combo);
  if (s.multiplier > before)
    s.events.push({ kind: "comboTier", multiplier: s.multiplier });
}

function resetCombo(s: GameState) {
  if (s.combo > 0) s.events.push({ kind: "comboReset" });
  s.combo = 0;
  s.multiplier = 1;
  s.comboTimer = 0;
}

function applyInput(s: GameState) {
  const r = s.runner;
  for (const action of s.queue) {
    if (action === "left") r.lane = Math.max(0, r.lane - 1);
    else if (action === "right") r.lane = Math.min(LANE_COUNT - 1, r.lane + 1);
    else if (action === "jump" && r.grounded && !isFlying(s)) {
      r.vy = s.tuning.jumpVelocity;
      r.grounded = false;
      r.rollTimer = 0;
    } else if (action === "roll" && !isFlying(s)) {
      r.rollTimer = s.tuning.rollDuration;
      if (!r.grounded) r.vy = Math.min(r.vy, -22);
    }
  }
  s.queue.length = 0;
}

function stepRunner(s: GameState, dt: number) {
  const r = s.runner;
  const tx = laneX(r.lane);
  const k = Math.min(1, dt / (PHYSICS.laneSwitchDuration * 0.45));
  r.x += (tx - r.x) * k;
  if (isFlying(s)) {
    r.y += (FLY_HEIGHT - r.y) * Math.min(1, dt * 5);
    r.vy = 0;
    r.grounded = false;
  } else if (!r.grounded) {
    r.vy -= s.tuning.gravity * dt;
    r.y += r.vy * dt;
    if (r.y <= 0) {
      r.y = 0;
      r.vy = 0;
      r.grounded = true;
    }
  }
  if (r.rollTimer > 0) r.rollTimer = Math.max(0, r.rollTimer - dt);
  r.stride += dt * s.speed * 0.9;
}

/** Returns true when the runner's body intersects the obstacle. */
function collides(s: GameState, o: Obstacle): boolean {
  const r = s.runner;
  const rolling = r.rollTimer > 0;
  if (o.type === "roadblockRow") {
    return Math.abs(r.x - laneX(o.openLane)) > 0.9 && r.y < 3.3;
  }
  if (Math.abs(r.x - laneX(o.lane)) > 1.05) return false;
  switch (o.type) {
    case "deliveryBike":
      return r.y < 1.35;
    case "barrier":
      return r.y < 3.3;
    case "lowRail":
      return r.y < 0.85;
    case "highBar":
      return !rolling && r.y < 3.4;
    default:
      return false;
  }
}

function hit(s: GameState, o: Obstacle) {
  o.cleared = true;
  if (s.active.milkShield > 0) {
    s.active.milkShield = 0;
    s.invulnTimer = 1;
    s.shake = 0.5;
    s.events.push({ kind: "shieldBreak" });
    return;
  }
  resetCombo(s);
  s.shake = 1;
  const withinWindow =
    s.lastHitTime >= 0 &&
    s.time - s.lastHitTime <= CHASER_RULES.catchWindowSeconds;
  if (withinWindow) {
    s.status = "caught";
    s.caughtTimer = 0;
    s.events.push({ kind: "caught" });
    return;
  }
  s.lastHitTime = s.time;
  s.invulnTimer = 1.6;
  s.slowTimer = 2.2;
  s.chaserGap = CHASER_NEAR;
  s.events.push({ kind: "hit" });
}

function stepObstacles(s: GameState, dt: number) {
  const ult = s.active.naiFamilyUltimate > 0;
  for (const o of s.obstacles) {
    if (!o.active) continue;
    o.at -= o.speed * dt;
    if (o.cleared) o.clearedT += dt;
    const rel = o.at - s.distance;
    if (rel < -DESPAWN_BEHIND) {
      o.active = false;
      continue;
    }
    if (o.cleared) continue;
    if (ult && rel < 45 && rel > -1) {
      o.cleared = true;
      continue;
    }
    const depth = o.type === "deliveryBike" ? 1.1 : 0.5;
    if (Math.abs(rel) < depth && !isInvulnerable(s) && collides(s, o)) {
      hit(s, o);
      if (s.status !== "running") return;
      continue;
    }
    if (!o.passed && rel < -depth) {
      o.passed = true;
      const near =
        o.type === "roadblockRow" ||
        Math.abs(s.runner.x - laneX(o.lane)) < 3 ||
        s.runner.y > 0.5;
      if (near && !isInvulnerable(s)) {
        bumpCombo(s, 2);
        s.events.push({ kind: "nearMiss" });
      }
    }
  }
}

function collectCoin(s: GameState, x: number, y: number) {
  const double = s.active.doubleCoins > 0;
  const value = COIN.value * (double ? 2 : 1);
  s.coins += value;
  s.score += COIN.scorePoints * value * s.multiplier;
  bumpCombo(s, 1);
  s.events.push({ kind: "coin", x, y, double });
}

function stepCoins(s: GameState, dt: number) {
  const r = s.runner;
  const magnet = s.active.magnet > 0 || s.active.naiFamilyUltimate > 0;
  const k = Math.min(1, dt * 9);
  for (const c of s.coinPool) {
    if (!c.active) continue;
    const rel = c.at - s.distance;
    if (rel < -DESPAWN_BEHIND) {
      c.active = false;
      continue;
    }
    if (magnet && rel < 22 && rel > -1) c.magnetized = true;
    if (c.magnetized) {
      c.x += (r.x - c.x) * k;
      c.y += (r.y + 1 - c.y) * k;
      c.at += (s.distance + 0.2 - c.at) * k;
    }
    if (
      Math.abs(c.at - s.distance) < 0.9 &&
      Math.abs(c.x - r.x) < 1.05 &&
      Math.abs(c.y - (r.y + 0.9)) < 1.4
    ) {
      c.active = false;
      collectCoin(s, c.x, c.y);
    }
  }
}

function activatePowerUp(s: GameState, id: PowerUpId) {
  s.active[id] = POWER_UPS[id].duration;
  s.events.push({ kind: "powerUp", id });
  if (id === "rocketShoes") spawnSkyCoins(s);
  if (id === "naiFamilyUltimate") {
    for (const o of s.obstacles) {
      if (o.active && !o.cleared && o.at - s.distance < 90) o.cleared = true;
    }
    s.shake = 0.6;
    s.events.push({ kind: "ultimateClear" });
  }
}

function stepPowerUps(s: GameState, dt: number) {
  const r = s.runner;
  for (const p of s.powerUps) {
    if (!p.active) continue;
    const rel = p.at - s.distance;
    if (rel < -DESPAWN_BEHIND) {
      p.active = false;
      continue;
    }
    if (
      Math.abs(rel) < 1 &&
      Math.abs(laneX(p.lane) - r.x) < 1.2 &&
      Math.abs(p.y - (r.y + 0.9)) < 2
    ) {
      p.active = false;
      activatePowerUp(s, p.id);
    }
  }
  for (const id of POWER_UP_IDS) {
    if (s.active[id] > 0) s.active[id] = Math.max(0, s.active[id] - dt);
  }
}

function stepChaser(s: GameState, dt: number) {
  if (
    s.lastHitTime >= 0 &&
    s.time - s.lastHitTime > CHASER_RULES.catchWindowSeconds
  )
    s.lastHitTime = -1;
  if (s.lastHitTime < 0) {
    s.chaserGap = Math.min(CHASER_FAR, s.chaserGap + dt * 2.4);
  } else {
    // Hovers close while the catch window is open.
    s.chaserGap += (CHASER_NEAR + 1.5 - s.chaserGap) * Math.min(1, dt * 0.6);
  }
}

/** One simulation step. Mutates state in place; dt is capped. */
export function stepGame(s: GameState, rawDt: number): void {
  const dt = Math.min(MAX_STEP, Math.max(0, rawDt));
  s.events.length = 0;
  s.shake = Math.max(0, s.shake - dt * 2.2);

  if (s.status === "caught") {
    s.queue.length = 0;
    s.caughtTimer += dt;
    s.chaserGap += (0.6 - s.chaserGap) * Math.min(1, dt * 6);
    if (s.caughtTimer > 2.6) {
      s.status = "over";
      s.events.push({ kind: "over" });
    }
    return;
  }
  if (s.status !== "running") return;

  s.time += dt;
  applyInput(s);
  s.slowTimer = Math.max(0, s.slowTimer - dt);
  s.invulnTimer = Math.max(0, s.invulnTimer - dt);
  const slow = s.slowTimer > 0 ? 0.62 + 0.38 * (1 - s.slowTimer / 2.2) : 1;
  const dash = s.active.naiFamilyUltimate > 0 ? 1.55 : 1;
  s.speed = speedAtDistance(s.distance) * slow * dash;
  const dDist = s.speed * dt;
  s.distance += dDist;
  s.score += dDist * SCORE_PER_METER * s.multiplier;

  // comboTimer only drives the HUD glow; only a hit resets the combo.
  if (s.comboTimer > 0) s.comboTimer = Math.max(0, s.comboTimer - dt);

  stepRunner(s, dt);
  spawnAhead(s);
  stepObstacles(s, dt);
  if (s.status !== "running") return;
  stepCoins(s, dt);
  stepPowerUps(s, dt);
  stepChaser(s, dt);
}

/** Proximity 0 (far) … 1 (caught) for the HUD meter. */
export function chaserProximity(s: GameState): number {
  const t = (CHASER_FAR - s.chaserGap) / (CHASER_FAR - 0.6);
  return Math.min(1, Math.max(0, t));
}
