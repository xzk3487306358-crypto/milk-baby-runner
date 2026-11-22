import { toast } from "sonner";
import {
  useCoins,
  useEquipped,
  useProgressActions,
  useUnlocks,
} from "../../hooks/useProgress";
import { type Character, type Skin, getCharacter } from "../../lib/characters";
import { canAfford, isSkinUsable } from "../../lib/progress";

export type ShopItem =
  | { kind: "character"; character: Character }
  | { kind: "skin"; skin: Skin };

export type ItemStatus =
  | { state: "equipped" }
  | { state: "owned" }
  | { state: "affordable" }
  | { state: "short"; shortfall: number }
  | { state: "locked"; reason: string };

export interface ItemView {
  id: string;
  name: string;
  description: string;
  price: number;
  imagePath: string;
  accent: string;
  status: ItemStatus;
}

/** Derives card view + actions for a shop item from the persisted progress store. */
export function useShopItem(item: ShopItem) {
  const coins = useCoins();
  const { character: equippedCharacter, skin: equippedSkin } = useEquipped();
  const { unlockedSkinIds, unlockedCharacterIds } = useUnlocks();
  const { unlockSkin, unlockCharacter, equipSkin, equipCharacter } =
    useProgressActions();

  let view: ItemView;
  let owned: boolean;
  let equipped: boolean;
  let lockedReason: string | null = null;

  if (item.kind === "character") {
    const c = item.character;
    owned = unlockedCharacterIds.includes(c.id);
    equipped = equippedCharacter.id === c.id;
    view = {
      id: c.id,
      name: c.name,
      description: c.description,
      price: c.price,
      imagePath: c.imagePath,
      accent: c.accentColor,
      status: { state: "owned" },
    };
  } else {
    const s = item.skin;
    owned = isSkinUsable(s.id, unlockedSkinIds, unlockedCharacterIds);
    equipped = equippedSkin.id === s.id;
    if (!owned && !unlockedCharacterIds.includes(s.characterId)) {
      lockedReason = `需先解锁${getCharacter(s.characterId).name}`;
    }
    view = {
      id: s.id,
      name: s.name,
      description: s.description,
      price: s.price,
      imagePath: s.imagePath,
      accent: s.accentColor,
      status: { state: "owned" },
    };
  }

  if (equipped) view.status = { state: "equipped" };
  else if (owned) view.status = { state: "owned" };
  else if (lockedReason)
    view.status = { state: "locked", reason: lockedReason };
  else if (canAfford(coins, view.price)) view.status = { state: "affordable" };
  else view.status = { state: "short", shortfall: view.price - coins };

  const equip = () => {
    if (item.kind === "character") {
      equipCharacter(item.character.id);
    } else {
      // Switching to a skin of another character also switches the character.
      if (item.skin.characterId !== equippedCharacter.id) {
        equipCharacter(item.skin.characterId);
      }
      equipSkin(item.skin.id);
    }
    toast.success(`已装备 ${view.name}`, { duration: 4000 });
  };

  /** Store unlock actions spend the price themselves; returns true on success. */
  const unlock = (): boolean => {
    const ok =
      item.kind === "character"
        ? unlockCharacter(item.character.id)
        : unlockSkin(item.skin.id);
    if (!ok) {
      toast.error("金币不足，再去跑几圈吧！", { duration: 4000 });
      return false;
    }
    if (item.kind === "character") {
      equipCharacter(item.character.id);
    } else {
      if (item.skin.characterId !== equippedCharacter.id) {
        equipCharacter(item.skin.characterId);
      }
      equipSkin(item.skin.id);
    }
    toast.success("解锁成功！", {
      description: `${view.name} 已自动装备`,
      duration: 5000,
    });
    return true;
  };

  return { view, equip, unlock };
}
