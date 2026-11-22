import {
  POWER_UPS,
  POWER_UP_IDS,
  type PowerUpId,
  phaseAtDistance,
} from "../lib/gameConfig";
import { chaserProximity } from "./engine";
import type { GameState } from "./types";

export interface ActivePowerUp {
  id: PowerUpId;
  remaining: number;
  progress: number;
}

export interface HudSnapshot {
  score: number;
  coins: number;
  distance: number;
  multiplier: number;
  combo: number;
  proximity: number;
  chaserMeters: number;
  danger: boolean;
  phaseName: string;
  active: ActivePowerUp[];
}

export const EMPTY_HUD: HudSnapshot = {
  score: 0,
  coins: 0,
  distance: 0,
  multiplier: 1,
  combo: 0,
  proximity: 0,
  chaserMeters: 18,
  danger: false,
  phaseName: "白天",
  active: [],
};

/** Sampled ~10×/s for the React HUD; never called from the hot loop body. */
export function readHud(s: GameState): HudSnapshot {
  const active: ActivePowerUp[] = [];
  for (const id of POWER_UP_IDS) {
    const left = s.active[id];
    if (left > 0)
      active.push({
        id,
        remaining: left,
        progress: left / POWER_UPS[id].duration,
      });
  }
  return {
    score: Math.floor(s.score),
    coins: s.coins,
    distance: Math.floor(s.distance),
    multiplier: s.multiplier,
    combo: s.combo,
    proximity: chaserProximity(s),
    chaserMeters: Math.max(0, Math.round(s.chaserGap)),
    danger: s.lastHitTime >= 0,
    phaseName: phaseAtDistance(s.distance).name,
    active,
  };
}
