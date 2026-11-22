import {
  type CharacterId,
  DEFAULT_CHARACTER_ID,
  DEFAULT_SKIN_ID,
  type SkinId,
  getSkin,
} from "./characters";

export const PROGRESS_STORAGE_KEY = "naiwa-run-progress";

export interface LastRun {
  score: number;
  distance: number;
  coinsEarned: number;
  maxCombo: number;
  isNewRecord: boolean;
  characterId: CharacterId;
  skinId: SkinId;
  /** Leaderboard entry id as a decimal string once submitted. */
  submittedEntryId: string | null;
}

export interface RunInput {
  score: number;
  distance: number;
  coinsEarned: number;
  maxCombo: number;
  characterId: CharacterId;
  skinId: SkinId;
}

export interface ProgressData {
  coins: number;
  unlockedSkinIds: SkinId[];
  unlockedCharacterIds: CharacterId[];
  equippedCharacterId: CharacterId;
  equippedSkinId: SkinId;
  highScore: number;
  totalDistance: number;
  bestCombo: number;
  savedNickname: string;
  hasSeenIntro: boolean;
  lastRun: LastRun | null;
}

export const INITIAL_PROGRESS: ProgressData = {
  coins: 0,
  unlockedSkinIds: [DEFAULT_SKIN_ID],
  unlockedCharacterIds: [DEFAULT_CHARACTER_ID],
  equippedCharacterId: DEFAULT_CHARACTER_ID,
  equippedSkinId: DEFAULT_SKIN_ID,
  highScore: 0,
  totalDistance: 0,
  bestCombo: 0,
  savedNickname: "",
  hasSeenIntro: false,
  lastRun: null,
};

export const NICKNAME_MAX_LENGTH = 12;

export function sanitizeNickname(raw: string): string {
  return raw.trim().slice(0, NICKNAME_MAX_LENGTH);
}

export function toSafeInt(n: number): number {
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
}

export function canAfford(coins: number, price: number): boolean {
  return coins >= price;
}

export function addUnique<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list : [...list, item];
}

export function isSkinUsable(
  skinId: SkinId,
  unlockedSkinIds: SkinId[],
  unlockedCharacterIds: CharacterId[],
): boolean {
  const skin = getSkin(skinId);
  if (!unlockedCharacterIds.includes(skin.characterId)) return false;
  return skin.price === 0 || unlockedSkinIds.includes(skinId);
}

export function buildLastRun(
  run: RunInput,
  previousHighScore: number,
): LastRun {
  const score = toSafeInt(run.score);
  return {
    score,
    distance: toSafeInt(run.distance),
    coinsEarned: toSafeInt(run.coinsEarned),
    maxCombo: toSafeInt(run.maxCombo),
    isNewRecord: score > previousHighScore,
    characterId: run.characterId,
    skinId: run.skinId,
    submittedEntryId: null,
  };
}

export function formatNumber(n: number | bigint): string {
  return Number(n).toLocaleString("zh-CN");
}
