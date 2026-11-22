export type CharacterId = "naiwa" | "niulai";

export type SkinId =
  | "naiwa-classic"
  | "naiwa-rider"
  | "naiwa-cyber"
  | "naiwa-guofeng"
  | "naiwa-astro"
  | "naiwa-gold"
  | "niulai-classic";

export interface CharacterAbility {
  /** Multiplier applied to jump height (1 = baseline). */
  jumpHeight: number;
  /** Multiplier applied to jump airtime / distance. */
  jumpDistance: number;
  /** Multiplier applied to roll speed (higher = shorter roll). */
  rollSpeed: number;
  label: string;
}

export interface Character {
  id: CharacterId;
  name: string;
  description: string;
  price: number;
  imagePath: string;
  accentColor: string;
  catchphrase: string;
  catchphraseTrigger: "laugh" | "flight";
  defaultSkinId: SkinId;
  ability: CharacterAbility;
}

export interface Skin {
  id: SkinId;
  name: string;
  description: string;
  price: number;
  characterId: CharacterId;
  imagePath: string;
  accentColor: string;
}

export interface Chaser {
  id: "kangaroo";
  name: string;
  description: string;
  imagePath: string;
  accentColor: string;
  catchphrase: string;
}

const IMG = "/assets/generated";

export const GAME_LOGO_PATH = `${IMG}/game-logo-transparent.dim_1024x512.png`;

export const CHARACTERS: Character[] = [
  {
    id: "naiwa",
    name: "奶娃",
    description: "圆滚滚的黄色快乐团子，一笑全网破防，跳得又高又远。",
    price: 0,
    imagePath: `${IMG}/naiwa-classic.dim_512x512.png`,
    accentColor: "#FFD60A",
    catchphrase: "全网呼叫奶家人！",
    catchphraseTrigger: "laugh",
    defaultSkinId: "naiwa-classic",
    ability: {
      jumpHeight: 1.25,
      jumpDistance: 1.2,
      rollSpeed: 1,
      label: "跳得更高更远",
    },
  },
  {
    id: "niulai",
    name: "牛来",
    description: "憨憨的低多边形小牛，翻滚快如闪电，起飞时会喊妈。",
    price: 1200,
    imagePath: `${IMG}/niulai-classic.dim_512x512.png`,
    accentColor: "#E07A2E",
    catchphrase: "妈——妈——",
    catchphraseTrigger: "flight",
    defaultSkinId: "niulai-classic",
    ability: {
      jumpHeight: 1,
      jumpDistance: 1,
      rollSpeed: 1.4,
      label: "翻滚速度更快",
    },
  },
];

export const SKINS: Skin[] = [
  {
    id: "naiwa-classic",
    name: "默认奶娃",
    description: "原汁原味的笑声担当，奶家人永远的初心。",
    price: 0,
    characterId: "naiwa",
    imagePath: `${IMG}/naiwa-classic.dim_512x512.png`,
    accentColor: "#FFD60A",
  },
  {
    id: "naiwa-rider",
    name: "骑手奶娃",
    description: "穿上骑手马甲，以其人之道还治其人之身。",
    price: 300,
    characterId: "naiwa",
    imagePath: `${IMG}/naiwa-rider.dim_512x512.png`,
    accentColor: "#FFB703",
  },
  {
    id: "naiwa-cyber",
    name: "赛博霓虹奶娃",
    description: "霓虹护目镜一戴，夜城最靓的仔就是我。",
    price: 600,
    characterId: "naiwa",
    imagePath: `${IMG}/naiwa-cyber.dim_512x512.png`,
    accentColor: "#22D3EE",
  },
  {
    id: "naiwa-guofeng",
    name: "国风奶娃",
    description: "汉服折扇，摇着扇子笑看袋鼠追不上。",
    price: 900,
    characterId: "naiwa",
    imagePath: `${IMG}/naiwa-guofeng.dim_512x512.png`,
    accentColor: "#E63946",
  },
  {
    id: "naiwa-astro",
    name: "宇航奶娃",
    description: "穿上宇航服，下一站直接逃出地球。",
    price: 1500,
    characterId: "naiwa",
    imagePath: `${IMG}/naiwa-astro.dim_512x512.png`,
    accentColor: "#7DD3FC",
  },
  {
    id: "naiwa-gold",
    name: "黄金奶娃",
    description: "通体流金，闪到袋鼠骑手睁不开眼。",
    price: 2500,
    characterId: "naiwa",
    imagePath: `${IMG}/naiwa-gold.dim_512x512.png`,
    accentColor: "#F5B700",
  },
  {
    id: "niulai-classic",
    name: "经典牛来",
    description: "解锁牛来后免费获得，憨笑永不过时。",
    price: 0,
    characterId: "niulai",
    imagePath: `${IMG}/niulai-classic.dim_512x512.png`,
    accentColor: "#E07A2E",
  },
];

export const CHASER: Chaser = {
  id: "kangaroo",
  name: "美团黄袋鼠骑手",
  description: "骑着电驴、背着保温箱的黄袋鼠，奶娃偷吃了它的外卖，誓要追回！",
  imagePath: `${IMG}/kangaroo-chaser.dim_512x512.png`,
  accentColor: "#FFC300",
  catchphrase: "胆子真是肥嘟嘟的啊！",
};

export const DEFAULT_CHARACTER_ID: CharacterId = "naiwa";
export const DEFAULT_SKIN_ID: SkinId = "naiwa-classic";

export function getCharacter(id: string): Character {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}

export function getSkin(id: string): Skin {
  return SKINS.find((s) => s.id === id) ?? SKINS[0];
}

export function getSkinsForCharacter(characterId: CharacterId): Skin[] {
  return SKINS.filter((s) => s.characterId === characterId);
}
