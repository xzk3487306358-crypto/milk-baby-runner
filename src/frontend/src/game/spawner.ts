import {
  LANE_COUNT,
  type ObstacleTypeId,
  POWER_UPS,
  POWER_UP_IDS,
  type PowerUpId,
} from "../lib/gameConfig";
import { type GameState, LANE_WIDTH } from "./types";

/** Deterministic xorshift RNG stored on the state (no allocations). */
export function rand(state: GameState): number {
  let x = state.rng | 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  state.rng = x;
  return ((x >>> 0) % 1_000_000) / 1_000_000;
}

function randInt(state: GameState, max: number): number {
  return Math.floor(rand(state) * max) % max;
}

export function laneX(lane: number): number {
  return (lane - (LANE_COUNT - 1) / 2) * LANE_WIDTH;
}

function addObstacle(
  state: GameState,
  type: ObstacleTypeId,
  lane: number,
  at: number,
  speed = 0,
  openLane = -1,
): void {
  for (const o of state.obstacles) {
    if (o.active) continue;
    o.active = true;
    o.type = type;
    o.lane = lane;
    o.at = at;
    o.speed = speed;
    o.openLane = openLane;
    o.passed = false;
    o.cleared = false;
    o.clearedT = 0;
    return;
  }
}

export function addCoin(
  state: GameState,
  lane: number,
  at: number,
  y: number,
): void {
  for (const c of state.coinPool) {
    if (c.active) continue;
    c.active = true;
    c.lane = lane;
    c.at = at;
    c.x = laneX(lane);
    c.y = y;
    c.magnetized = false;
    return;
  }
}

function coinRun(state: GameState, lane: number, at: number, count: number) {
  for (let i = 0; i < count; i++) addCoin(state, lane, at + i * 2.2, 1);
}

/** Arc of coins centred on `center`, matching a jump over a low obstacle. */
function coinArc(state: GameState, lane: number, center: number, height = 2.2) {
  const n = 7;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    addCoin(
      state,
      lane,
      center - 6 + t * 12,
      1 + Math.sin(t * Math.PI) * height,
    );
  }
}

function pickPowerUp(state: GameState): PowerUpId {
  let total = 0;
  for (const id of POWER_UP_IDS) total += POWER_UPS[id].weight;
  let r = rand(state) * total;
  for (const id of POWER_UP_IDS) {
    r -= POWER_UPS[id].weight;
    if (r <= 0) return id;
  }
  return "magnet";
}

function addPowerUp(state: GameState, lane: number, at: number) {
  for (const p of state.powerUps) {
    if (p.active) continue;
    p.active = true;
    p.id = pickPowerUp(state);
    p.lane = lane;
    p.at = at;
    p.y = 1.3;
    return;
  }
}

/** Spawns one obstacle segment at `at`; returns the segment length. */
function spawnSegment(state: GameState, at: number): number {
  const d = Math.min(1, state.distance / 3200);
  const r = rand(state);
  const a = randInt(state, LANE_COUNT);
  const b = (a + 1 + randInt(state, LANE_COUNT - 1)) % LANE_COUNT;
  const free = 3 - a - b;

  if (r < 0.22 - d * 0.1) {
    // Single obstacle with a coin run beside it.
    const types: ObstacleTypeId[] = ["barrier", "lowRail", "highBar"];
    const t = types[randInt(state, types.length)];
    addObstacle(state, t, a, at);
    if (t === "lowRail") coinArc(state, a, at);
    else coinRun(state, b, at - 6, 6);
  } else if (r < 0.38) {
    // Oncoming delivery bike.
    addObstacle(state, "deliveryBike", a, at + 20, 5 + d * 6);
    coinRun(state, b, at - 4, 8);
  } else if (r < 0.52 && state.distance > 120) {
    // Full row with one open lane.
    addObstacle(state, "roadblockRow", 1, at, 0, a);
    coinRun(state, a, at - 8, 6);
  } else if (r < 0.7) {
    // Two lanes blocked, one free.
    addObstacle(state, "barrier", a, at);
    addObstacle(state, rand(state) < 0.5 ? "lowRail" : "highBar", b, at);
    coinRun(state, free, at - 7, 7);
  } else if (r < 0.84 || d < 0.35) {
    // Jump-roll rhythm in one lane.
    addObstacle(state, "lowRail", a, at);
    addObstacle(state, "highBar", a, at + 11);
    coinArc(state, a, at);
    coinRun(state, b, at - 2, 7);
  } else {
    // Hard: every lane needs a different answer.
    addObstacle(state, "lowRail", a, at);
    addObstacle(state, "highBar", b, at);
    addObstacle(state, "barrier", free, at);
    if (d > 0.6) addObstacle(state, "deliveryBike", free, at + 26, 8);
    coinArc(state, a, at);
  }

  if (state.distance > 150 && rand(state) < 0.11) {
    addPowerUp(state, free, at - 10);
  }
  return 11;
}

/** Fills the track ahead of the runner. */
export function spawnAhead(state: GameState): void {
  const horizon = state.distance + 130;
  while (state.nextSpawnAt < horizon) {
    const d = Math.min(1, state.distance / 3200);
    const len = spawnSegment(state, state.nextSpawnAt);
    const gap = 30 - d * 13 + rand(state) * 8;
    state.nextSpawnAt += len + gap * (state.speed / 20);
  }
}

/** Air coin line laid out while rocket shoes are active. */
export function spawnSkyCoins(state: GameState): void {
  const start = state.distance + 14;
  for (let i = 0; i < 24; i++) {
    const lane = Math.floor(i / 8) % LANE_COUNT;
    addCoin(state, lane, start + i * 3, 5.2);
  }
}
