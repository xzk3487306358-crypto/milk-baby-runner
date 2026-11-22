import type { ObstacleTypeId, PowerUpId } from "../lib/gameConfig";

/** World layout constants shared by engine and renderer. */
export const LANE_WIDTH = 2.4;
export const SPAWN_AHEAD = 130;
export const DESPAWN_BEHIND = 12;
export const MAX_STEP = 1 / 30;

export const OBSTACLE_POOL = 48;
export const COIN_POOL = 180;
export const POWERUP_POOL = 6;

export type GameStatus = "running" | "caught" | "over";

export type InputAction = "left" | "right" | "jump" | "roll";

export interface CharacterTuning {
  jumpVelocity: number;
  gravity: number;
  rollDuration: number;
  /** niulai shouts while airborne. */
  shoutsWhenFlying: boolean;
}

export interface Runner {
  lane: number;
  x: number;
  y: number;
  vy: number;
  grounded: boolean;
  rollTimer: number;
  /** Visual run cycle phase. */
  stride: number;
}

export interface Obstacle {
  active: boolean;
  type: ObstacleTypeId;
  lane: number;
  /** Absolute track position in meters. */
  at: number;
  /** Forward speed toward the runner (m/s), only bikes move. */
  speed: number;
  /** For roadblockRow: the single open lane. */
  openLane: number;
  passed: boolean;
  /** Knocked away by shield, hit or ultimate. */
  cleared: boolean;
  clearedT: number;
}

export interface Coin {
  active: boolean;
  lane: number;
  at: number;
  x: number;
  y: number;
  magnetized: boolean;
}

export interface PowerUpItem {
  active: boolean;
  id: PowerUpId;
  lane: number;
  at: number;
  y: number;
}

export type GameEvent =
  | { kind: "coin"; x: number; y: number; double: boolean }
  | { kind: "nearMiss" }
  | { kind: "comboTier"; multiplier: number }
  | { kind: "comboReset" }
  | { kind: "hit" }
  | { kind: "shieldBreak" }
  | { kind: "powerUp"; id: PowerUpId }
  | { kind: "ultimateClear" }
  | { kind: "caught" }
  | { kind: "over" };

export interface GameState {
  status: GameStatus;
  time: number;
  distance: number;
  speed: number;
  score: number;
  coins: number;
  combo: number;
  multiplier: number;
  maxCombo: number;
  comboTimer: number;
  runner: Runner;
  tuning: CharacterTuning;
  obstacles: Obstacle[];
  coinPool: Coin[];
  powerUps: PowerUpItem[];
  /** Remaining seconds per power-up id; 0 = inactive. */
  active: Record<PowerUpId, number>;
  /** Meters between chaser and runner. */
  chaserGap: number;
  /** Time of the last hit, -1 if none inside the window. */
  lastHitTime: number;
  invulnTimer: number;
  slowTimer: number;
  shake: number;
  caughtTimer: number;
  nextSpawnAt: number;
  queue: InputAction[];
  events: GameEvent[];
  rng: number;
}
