import { CHARACTERS, CHASER } from "../../lib/characters";

const NAIWA = CHARACTERS[0];
const NIULAI = CHARACTERS[1];

export interface PanelCast {
  id: string;
  src: string;
  alt: string;
  /** Tailwind classes for position + size inside the panel stage. */
  className: string;
  flip?: boolean;
}

export interface PanelBubble {
  id: string;
  text: string;
  tone: "light" | "yellow" | "magenta" | "shout";
  /** Tailwind classes for position inside the stage. */
  className: string;
  tail: "left" | "right";
}

export interface StoryBeat {
  id: string;
  index: number;
  title: string;
  caption: string;
  /** Scene backdrop classes (token-based gradients/utilities only). */
  scene: string;
  sfx?: string;
  cast: PanelCast[];
  bubbles: PanelBubble[];
}

export const STORY_BEATS: StoryBeat[] = [
  {
    id: "beat-1",
    index: 1,
    title: "霓虹城的深夜",
    caption: "霓虹城的深夜，奶娃和牛来蹲在路边等外卖。",
    scene: "bg-night",
    sfx: "咕噜~",
    cast: [
      {
        id: "naiwa",
        src: NAIWA.imagePath,
        alt: "奶娃蹲在路边",
        className: "bottom-2 left-[8%] w-[42%]",
      },
      {
        id: "niulai",
        src: NIULAI.imagePath,
        alt: "牛来蹲在路边",
        className: "bottom-2 right-[8%] w-[40%]",
        flip: true,
      },
    ],
    bubbles: [
      {
        id: "b1",
        text: "外卖咋还不到…",
        tone: "light",
        className: "left-3 top-3",
        tail: "left",
      },
      {
        id: "b2",
        text: "肚子在唱歌！",
        tone: "yellow",
        className: "right-3 top-12",
        tail: "right",
      },
    ],
  },
  {
    id: "beat-2",
    index: 2,
    title: "拿错单了",
    caption: "两人误拿了美团袋鼠的外卖单，奶娃捧腹大笑三分钟。",
    scene: "bg-gradient-primary",
    sfx: "哈哈哈哈哈",
    cast: [
      {
        id: "naiwa",
        src: NAIWA.imagePath,
        alt: "奶娃捧腹大笑",
        className: "bottom-0 left-1/2 w-[58%] -translate-x-1/2",
      },
    ],
    bubbles: [
      {
        id: "b1",
        text: "这单是袋鼠的？！",
        tone: "light",
        className: "left-3 top-3",
        tail: "left",
      },
      {
        id: "b2",
        text: "笑到停不下来 ×3分钟",
        tone: "magenta",
        className: "right-3 top-14",
        tail: "right",
      },
    ],
  },
  {
    id: "beat-3",
    index: 3,
    title: "袋鼠炸毛",
    caption: "袋鼠炸毛怒喊，骑上电动车就追！",
    scene: "bg-gradient-neon",
    sfx: "嗡——",
    cast: [
      {
        id: "kangaroo",
        src: CHASER.imagePath,
        alt: "黄袋鼠骑手骑着电动车怒追",
        className: "bottom-0 right-[6%] w-[60%]",
      },
    ],
    bubbles: [
      {
        id: "b1",
        text: "胆子真是肥嘟嘟的啊！",
        tone: "shout",
        className: "left-3 top-3",
        tail: "right",
      },
    ],
  },
  {
    id: "beat-4",
    index: 4,
    title: "拽尾巴事件",
    caption: "牛来把袋鼠尾巴当成小绳头拽了一下，边跑边喊——",
    scene: "bg-night",
    sfx: "啪！",
    cast: [
      {
        id: "kangaroo",
        src: CHASER.imagePath,
        alt: "被拽尾巴的黄袋鼠",
        className: "bottom-0 left-[2%] w-[46%]",
      },
      {
        id: "niulai",
        src: NIULAI.imagePath,
        alt: "边跑边喊妈的牛来",
        className: "bottom-1 right-[4%] w-[44%]",
      },
    ],
    bubbles: [
      {
        id: "b1",
        text: "这是小绳头吗？",
        tone: "light",
        className: "left-3 top-3",
        tail: "left",
      },
      {
        id: "b2",
        text: "妈——妈——",
        tone: "yellow",
        className: "right-3 top-12",
        tail: "right",
      },
    ],
  },
  {
    id: "beat-5",
    index: 5,
    title: "家人们集合",
    caption: "全城鼠家人出动，奶娃呼叫奶家人支援！",
    scene: "bg-gradient-neon",
    sfx: "集合！",
    cast: [
      {
        id: "kangaroo",
        src: CHASER.imagePath,
        alt: "鼠家人骑手大军",
        className: "bottom-0 left-[2%] w-[38%] opacity-90",
      },
      {
        id: "naiwa",
        src: NAIWA.imagePath,
        alt: "举手呼叫支援的奶娃",
        className: "bottom-0 right-[4%] w-[46%]",
        flip: true,
      },
    ],
    bubbles: [
      {
        id: "b1",
        text: "鼠家人，冲！",
        tone: "magenta",
        className: "left-3 top-3",
        tail: "left",
      },
      {
        id: "b2",
        text: "全网呼叫奶家人！",
        tone: "yellow",
        className: "right-3 top-14",
        tail: "right",
      },
    ],
  },
  {
    id: "beat-6",
    index: 6,
    title: "黄色大逃亡",
    caption: "于是他们一路狂奔收金币赔外卖钱，永不停步的黄色大逃亡开始了。",
    scene: "bg-gradient-primary",
    sfx: "跑！！",
    cast: [
      {
        id: "niulai",
        src: NIULAI.imagePath,
        alt: "狂奔的牛来",
        className: "bottom-0 left-[2%] w-[34%]",
      },
      {
        id: "naiwa",
        src: NAIWA.imagePath,
        alt: "狂奔收金币的奶娃",
        className: "bottom-0 left-[30%] w-[40%]",
      },
      {
        id: "kangaroo",
        src: CHASER.imagePath,
        alt: "紧追不舍的黄袋鼠",
        className: "bottom-0 right-[1%] w-[32%]",
      },
    ],
    bubbles: [
      {
        id: "b1",
        text: "收金币，赔外卖钱！",
        tone: "light",
        className: "left-3 top-3",
        tail: "left",
      },
    ],
  },
];
