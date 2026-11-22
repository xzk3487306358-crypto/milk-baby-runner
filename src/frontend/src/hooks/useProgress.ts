import { useShallow } from "zustand/react/shallow";
import { getCharacter, getSkin } from "../lib/characters";
import { useProgressStore } from "../store/progressStore";

export function useCoins(): number {
  return useProgressStore((s) => s.coins);
}

export function useHighScore(): number {
  return useProgressStore((s) => s.highScore);
}

export function useLastRun() {
  return useProgressStore((s) => s.lastRun);
}

export function useEquipped() {
  const { characterId, skinId } = useProgressStore(
    useShallow((s) => ({
      characterId: s.equippedCharacterId,
      skinId: s.equippedSkinId,
    })),
  );
  return { character: getCharacter(characterId), skin: getSkin(skinId) };
}

export function useStats() {
  return useProgressStore(
    useShallow((s) => ({
      highScore: s.highScore,
      totalDistance: s.totalDistance,
      bestCombo: s.bestCombo,
      coins: s.coins,
    })),
  );
}

export function useUnlocks() {
  return useProgressStore(
    useShallow((s) => ({
      unlockedSkinIds: s.unlockedSkinIds,
      unlockedCharacterIds: s.unlockedCharacterIds,
    })),
  );
}

export function useProgressActions() {
  return useProgressStore(
    useShallow((s) => ({
      addCoins: s.addCoins,
      spendCoins: s.spendCoins,
      unlockSkin: s.unlockSkin,
      unlockCharacter: s.unlockCharacter,
      equipSkin: s.equipSkin,
      equipCharacter: s.equipCharacter,
      recordRun: s.recordRun,
      setLastRunEntryId: s.setLastRunEntryId,
      setNickname: s.setNickname,
      markIntroSeen: s.markIntroSeen,
    })),
  );
}
