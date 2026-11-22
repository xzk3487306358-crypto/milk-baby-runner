import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  type CharacterId,
  type SkinId,
  getCharacter,
  getSkin,
} from "../lib/characters";
import {
  INITIAL_PROGRESS,
  PROGRESS_STORAGE_KEY,
  type ProgressData,
  type RunInput,
  addUnique,
  buildLastRun,
  canAfford,
  isSkinUsable,
  sanitizeNickname,
  toSafeInt,
} from "../lib/progress";

export interface ProgressActions {
  addCoins: (amount: number) => void;
  /** Returns true when the coins were spent. */
  spendCoins: (amount: number) => boolean;
  /** Spends the skin price and unlocks it. Returns true on success. */
  unlockSkin: (skinId: SkinId) => boolean;
  /** Spends the character price, unlocks it and its free skins. Returns true on success. */
  unlockCharacter: (characterId: CharacterId) => boolean;
  equipSkin: (skinId: SkinId) => void;
  equipCharacter: (characterId: CharacterId) => void;
  recordRun: (run: RunInput) => void;
  setLastRunEntryId: (entryId: string) => void;
  setNickname: (nickname: string) => void;
  markIntroSeen: () => void;
}

export type ProgressState = ProgressData & ProgressActions;

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...INITIAL_PROGRESS,

      addCoins: (amount) => {
        const n = toSafeInt(amount);
        if (n > 0) set((s) => ({ coins: s.coins + n }));
      },

      spendCoins: (amount) => {
        const n = toSafeInt(amount);
        if (!canAfford(get().coins, n)) return false;
        set((s) => ({ coins: s.coins - n }));
        return true;
      },

      unlockSkin: (skinId) => {
        const s = get();
        const skin = getSkin(skinId);
        if (s.unlockedSkinIds.includes(skin.id)) return true;
        if (!s.unlockedCharacterIds.includes(skin.characterId)) return false;
        if (!get().spendCoins(skin.price)) return false;
        set((st) => ({
          unlockedSkinIds: addUnique(st.unlockedSkinIds, skin.id),
        }));
        return true;
      },

      unlockCharacter: (characterId) => {
        const s = get();
        const character = getCharacter(characterId);
        if (s.unlockedCharacterIds.includes(character.id)) return true;
        if (!get().spendCoins(character.price)) return false;
        set((st) => ({
          unlockedCharacterIds: addUnique(
            st.unlockedCharacterIds,
            character.id,
          ),
          unlockedSkinIds: addUnique(
            st.unlockedSkinIds,
            character.defaultSkinId,
          ),
        }));
        return true;
      },

      equipSkin: (skinId) => {
        const s = get();
        if (!isSkinUsable(skinId, s.unlockedSkinIds, s.unlockedCharacterIds))
          return;
        const skin = getSkin(skinId);
        set({ equippedSkinId: skin.id, equippedCharacterId: skin.characterId });
      },

      equipCharacter: (characterId) => {
        const s = get();
        if (!s.unlockedCharacterIds.includes(characterId)) return;
        const current = getSkin(s.equippedSkinId);
        const skinId =
          current.characterId === characterId
            ? current.id
            : getCharacter(characterId).defaultSkinId;
        set({ equippedCharacterId: characterId, equippedSkinId: skinId });
      },

      recordRun: (run) => {
        const s = get();
        const lastRun = buildLastRun(run, s.highScore);
        set({
          lastRun,
          coins: s.coins + lastRun.coinsEarned,
          highScore: Math.max(s.highScore, lastRun.score),
          totalDistance: s.totalDistance + lastRun.distance,
          bestCombo: Math.max(s.bestCombo, lastRun.maxCombo),
        });
      },

      setLastRunEntryId: (entryId) => {
        const lr = get().lastRun;
        if (lr) set({ lastRun: { ...lr, submittedEntryId: entryId } });
      },

      setNickname: (nickname) =>
        set({ savedNickname: sanitizeNickname(nickname) }),

      markIntroSeen: () => set({ hasSeenIntro: true }),
    }),
    {
      name: PROGRESS_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s): ProgressData => ({
        coins: s.coins,
        unlockedSkinIds: s.unlockedSkinIds,
        unlockedCharacterIds: s.unlockedCharacterIds,
        equippedCharacterId: s.equippedCharacterId,
        equippedSkinId: s.equippedSkinId,
        highScore: s.highScore,
        totalDistance: s.totalDistance,
        bestCombo: s.bestCombo,
        savedNickname: s.savedNickname,
        hasSeenIntro: s.hasSeenIntro,
        lastRun: s.lastRun,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ProgressData>;
        return {
          ...current,
          ...p,
          unlockedCharacterIds: addUnique(
            p.unlockedCharacterIds ?? current.unlockedCharacterIds,
            "naiwa" as CharacterId,
          ),
          unlockedSkinIds: addUnique(
            p.unlockedSkinIds ?? current.unlockedSkinIds,
            "naiwa-classic" as SkinId,
          ),
        };
      },
    },
  ),
);
