/** Shared tuning constants consumed by the game engine and UI. */

export const LANE_COUNT = 3;
/** Lane indices: 0 = left, 1 = center, 2 = right. */
export const START_LANE = 1;

export const SPEED = {
  /** Base forward speed in meters per second. */
  base: 14,
  /** Absolute maximum speed. */
  max: 42,
  /** Speed gained per second of running, before easing. */
  acceleration: 0.35,
  /** Distance (m) over which acceleration eases toward max. */
  easeDistance: 6000,
} as const;

/** Eased speed curve: fast ramp early, approaches max asymptotically. */
export function speedAtDistance(distance: number): number {
  const t = 1 - Math.exp(-Math.max(0, distance) / SPEED.easeDistance);
  return SPEED.base + (SPEED.max - SPEED.base) * t;
}

export const PHYSICS = {
  gravity: 48,
  jumpVelocity: 15,
  rollDuration: 0.6,
  laneSwitchDuration: 0.12,
} as const;

export type ObstacleTypeId =
  | "deliveryBike"
  | "barrier"
  | "lowRail"
  | "highBar"
  | "roadblockRow";

export interface ObstacleType {
  id: ObstacleTypeId;
  name: string;
  /** How the player avoids it. */
  avoid: "laneChange" | "jump" | "roll" | "jumpOrLane";
  /** Number of lanes occupied. */
  lanes: number;
  moving: boolean;
}

export const OBSTACLES: Record<ObstacleTypeId, ObstacleType> = {
  deliveryBike: {
    id: "deliveryBike",
    name: "外卖电驴",
    avoid: "laneChange",
    lanes: 1,
    moving: true,
  },
  barrier: {
    id: "barrier",
    name: "施工路障",
    avoid: "jumpOrLane",
    lanes: 1,
    moving: false,
  },
  lowRail: {
    id: "lowRail",
    name: "低栏杆",
    avoid: "jump",
    lanes: 1,
    moving: false,
  },
  highBar: {
    id: "highBar",
    name: "高横杆",
    avoid: "roll",
    lanes: 1,
    moving: false,
  },
  roadblockRow: {
    id: "roadblockRow",
    name: "整排路障",
    avoid: "jump",
    lanes: 3,
    moving: false,
  },
};

export const OBSTACLE_IDS = Object.keys(OBSTACLES) as ObstacleTypeId[];

export type PowerUpId =
  | "magnet"
  | "rocketShoes"
  | "milkShield"
  | "doubleCoins"
  | "naiFamilyUltimate";

export interface PowerUp {
  id: PowerUpId;
  name: string;
  description: string;
  /** Duration in seconds. */
  duration: number;
  /** Spawn weight relative to other power-ups. */
  weight: number;
}

export const POWER_UPS: Record<PowerUpId, PowerUp> = {
  magnet: {
    id: "magnet",
    name: "金币磁铁",
    description: "自动吸附附近车道的金币",
    duration: 10,
    weight: 30,
  },
  rocketShoes: {
    id: "rocketShoes",
    name: "火箭鞋",
    description: "超级弹跳，跳得飞起",
    duration: 8,
    weight: 22,
  },
  milkShield: {
    id: "milkShield",
    name: "奶瓶护盾",
    description: "抵挡一次撞击",
    duration: 12,
    weight: 20,
  },
  doubleCoins: {
    id: "doubleCoins",
    name: "双倍金币",
    description: "拾取金币翻倍",
    duration: 12,
    weight: 20,
  },
  naiFamilyUltimate: {
    id: "naiFamilyUltimate",
    name: "奶家人大招",
    description: "全网呼叫奶家人！无敌冲刺并清屏",
    duration: 5,
    weight: 8,
  },
};

export const POWER_UP_IDS = Object.keys(POWER_UPS) as PowerUpId[];

/** Combo multiplier steps; index = tier. Reaching each threshold of consecutive actions bumps the tier. */
export const COMBO_STEPS = [
  { multiplier: 1, threshold: 0 },
  { multiplier: 2, threshold: 10 },
  { multiplier: 3, threshold: 25 },
  { multiplier: 4, threshold: 45 },
  { multiplier: 5, threshold: 70 },
  { multiplier: 6, threshold: 100 },
  { multiplier: 7, threshold: 135 },
  { multiplier: 8, threshold: 175 },
] as const;

export const MAX_COMBO_MULTIPLIER = 8;
/** Seconds without a combo action before the combo resets. */
export const COMBO_TIMEOUT = 2.5;

export function comboMultiplier(combo: number): number {
  let m = 1;
  for (const step of COMBO_STEPS) {
    if (combo >= step.threshold) m = step.multiplier;
  }
  return m;
}

export const CHASER_RULES = {
  /** Hits before the chaser catches you. */
  hitsToCatch: 2,
  /** Window (seconds) after the first hit in which a second hit catches you. */
  catchWindowSeconds: 6,
  warningText: "袋鼠骑手追上来了！",
  caughtText: "胆子真是肥嘟嘟的啊！",
} as const;

export const COIN = {
  value: 1,
  /** Score points per coin before multipliers. */
  scorePoints: 10,
} as const;

/** Score points earned per meter. */
export const SCORE_PER_METER = 1;

export type DayPhaseId = "day" | "dusk" | "neonNight" | "dawn";

export interface DayPhase {
  id: DayPhaseId;
  name: string;
  /** Distance (m) at which this phase begins, within one cycle. */
  startDistance: number;
  skyTop: string;
  skyBottom: string;
}

export const DAY_CYCLE_LENGTH = 4000;

export const DAY_PHASES: DayPhase[] = [
  {
    id: "day",
    name: "白天",
    startDistance: 0,
    skyTop: "#5EC8FF",
    skyBottom: "#FFE38A",
  },
  {
    id: "dusk",
    name: "黄昏",
    startDistance: 1000,
    skyTop: "#7B2FF7",
    skyBottom: "#FF7A59",
  },
  {
    id: "neonNight",
    name: "霓虹夜",
    startDistance: 2000,
    skyTop: "#120A2E",
    skyBottom: "#5A189A",
  },
  {
    id: "dawn",
    name: "清晨",
    startDistance: 3200,
    skyTop: "#3A86FF",
    skyBottom: "#FFB4C8",
  },
];

export function phaseAtDistance(distance: number): DayPhase {
  const d =
    ((distance % DAY_CYCLE_LENGTH) + DAY_CYCLE_LENGTH) % DAY_CYCLE_LENGTH;
  let phase = DAY_PHASES[0];
  for (const p of DAY_PHASES) {
    if (d >= p.startDistance) phase = p;
  }
  return phase;
}
