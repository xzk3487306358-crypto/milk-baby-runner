import type { LeaderboardEntry } from "@/backend";
import { getCharacter, getSkin } from "../../lib/characters";

export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatSubmittedAt(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  return date ? dateFormatter.format(date) : "—";
}

export function getEntryLook(entry: LeaderboardEntry) {
  const character = getCharacter(entry.characterId);
  const skin = getSkin(entry.skinId);
  const resolvedSkin =
    skin.characterId === character.id ? skin : getSkin(character.defaultSkinId);
  return { character, skin: resolvedSkin };
}
