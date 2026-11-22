import { Color } from "three";
import {
  DAY_CYCLE_LENGTH,
  DAY_PHASES,
  type DayPhaseId,
  phaseAtDistance,
} from "../lib/gameConfig";

interface PhaseLook {
  fog: string;
  ambient: number;
  sun: number;
  neon: number;
  fogNear: number;
}

const LOOK: Record<DayPhaseId, PhaseLook> = {
  day: { fog: "#BFE3FF", ambient: 1.25, sun: 1.6, neon: 0.55, fogNear: 60 },
  dusk: { fog: "#C85A8A", ambient: 0.85, sun: 0.9, neon: 1.3, fogNear: 45 },
  neonNight: {
    fog: "#2A1250",
    ambient: 0.5,
    sun: 0.25,
    neon: 2.6,
    fogNear: 30,
  },
  dawn: { fog: "#E9B7D8", ambient: 1.0, sun: 1.1, neon: 0.9, fogNear: 50 },
};

const BLEND = 260;

interface Preset {
  top: Color;
  bottom: Color;
  fog: Color;
  look: PhaseLook;
  start: number;
}

const PRESETS: Preset[] = DAY_PHASES.map((p) => ({
  top: new Color(p.skyTop),
  bottom: new Color(p.skyBottom),
  fog: new Color(LOOK[p.id].fog),
  look: LOOK[p.id],
  start: p.startDistance,
}));

export interface Atmosphere {
  skyTop: Color;
  skyBottom: Color;
  fog: Color;
  ambient: number;
  sun: number;
  neon: number;
  fogNear: number;
}

export function createAtmosphere(): Atmosphere {
  return {
    skyTop: new Color(),
    skyBottom: new Color(),
    fog: new Color(),
    ambient: 1,
    sun: 1,
    neon: 1,
    fogNear: 50,
  };
}

/** Writes the blended atmosphere for `distance` into `out` (no allocations). */
export function sampleAtmosphere(distance: number, out: Atmosphere): void {
  const d =
    ((distance % DAY_CYCLE_LENGTH) + DAY_CYCLE_LENGTH) % DAY_CYCLE_LENGTH;
  const phase = phaseAtDistance(distance);
  const i = DAY_PHASES.indexOf(phase);
  const cur = PRESETS[i];
  const next = PRESETS[(i + 1) % PRESETS.length];
  const end = i + 1 < PRESETS.length ? next.start : DAY_CYCLE_LENGTH;
  const t = Math.min(1, Math.max(0, (d - (end - BLEND)) / BLEND));
  const e = t * t * (3 - 2 * t);
  out.skyTop.copy(cur.top).lerp(next.top, e);
  out.skyBottom.copy(cur.bottom).lerp(next.bottom, e);
  out.fog.copy(cur.fog).lerp(next.fog, e);
  out.ambient = cur.look.ambient + (next.look.ambient - cur.look.ambient) * e;
  out.sun = cur.look.sun + (next.look.sun - cur.look.sun) * e;
  out.neon = cur.look.neon + (next.look.neon - cur.look.neon) * e;
  out.fogNear = cur.look.fogNear + (next.look.fogNear - cur.look.fogNear) * e;
}
