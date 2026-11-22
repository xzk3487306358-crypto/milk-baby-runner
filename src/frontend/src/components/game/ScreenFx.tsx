import { motion, useReducedMotion } from "motion/react";
import type { PowerUpId } from "../../lib/gameConfig";

export type FlashKind = PowerUpId | "hit" | "shield";

export interface FlashEvent {
  key: number;
  kind: FlashKind;
}

const FLASH: Record<
  FlashKind,
  { className: string; text: string; textClass: string }
> = {
  magnet: {
    className:
      "bg-[radial-gradient(circle_at_50%_60%,transparent_25%,oklch(var(--accent)/0.55)_60%,transparent_75%)]",
    text: "金币磁铁！",
    textClass: "text-accent",
  },
  rocketShoes: {
    className:
      "bg-[linear-gradient(to_top,oklch(var(--warning)/0.7),transparent_55%)] speed-lines",
    text: "火箭鞋起飞！",
    textClass: "text-warning",
  },
  milkShield: {
    className:
      "shadow-[inset_0_0_120px_30px_oklch(var(--foreground)/0.75)] bg-accent/10",
    text: "奶盾护体！",
    textClass: "text-foreground",
  },
  doubleCoins: {
    className: "bg-primary/35 halftone",
    text: "双倍金币！",
    textClass: "text-primary",
  },
  naiFamilyUltimate: {
    className:
      "bg-[conic-gradient(from_0deg,oklch(var(--secondary)/0.7),oklch(var(--primary)/0.7),oklch(var(--accent)/0.6),oklch(var(--secondary)/0.7))]",
    text: "全网呼叫奶家人！",
    textClass: "text-sticker",
  },
  hit: {
    className:
      "bg-[radial-gradient(circle,transparent_35%,oklch(var(--destructive)/0.8))] animate-shake",
    text: "袋鼠追近了！",
    textClass: "text-destructive",
  },
  shield: {
    className: "bg-foreground/60",
    text: "奶盾挡住了！",
    textClass: "text-accent",
  },
};

export function ScreenFlash({ flash }: { flash: FlashEvent | null }) {
  const reduce = useReducedMotion();
  if (!flash) return null;
  const f = FLASH[flash.kind];
  const big = flash.kind === "naiFamilyUltimate" || flash.kind === "hit";
  return (
    <div
      key={flash.key}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-live="polite"
    >
      <motion.div
        className={`absolute inset-0 ${f.className}`}
        initial={{ opacity: 0, scale: reduce ? 1 : 1.25 }}
        animate={{ opacity: [0, 1, 0], scale: 1 }}
        transition={{ duration: big ? 1.4 : 0.9, ease: "easeOut" }}
      />
      <motion.p
        data-ocid="game.flash.toast"
        className={`text-outline absolute inset-x-0 top-[30%] px-4 text-center font-display font-black ${
          big ? "text-4xl sm:text-6xl" : "text-3xl sm:text-5xl"
        } ${f.textClass}`}
        initial={{ opacity: 0, scale: reduce ? 1 : 0.4, rotate: -6 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.2, 1, 1], rotate: 0 }}
        transition={{ duration: big ? 1.8 : 1.2, times: [0, 0.2, 0.7, 1] }}
      >
        {f.text}
      </motion.p>
    </div>
  );
}

export interface BurstEvent {
  key: number;
  multiplier: number;
}

/** Large animated combo text when the multiplier steps up. */
export function ComboBurst({ burst }: { burst: BurstEvent | null }) {
  if (!burst) return null;
  const max = burst.multiplier >= 8;
  return (
    <div
      key={burst.key}
      data-ocid="game.combo.toast"
      className="pointer-events-none absolute inset-x-0 top-[44%] flex flex-col items-center"
      aria-live="polite"
    >
      <span className="text-sticker animate-combo-burst font-display text-7xl sm:text-8xl">
        x{burst.multiplier}!
      </span>
      <span className="text-outline -mt-1 animate-combo-burst font-display text-2xl font-black text-secondary sm:text-3xl">
        {max ? "满倍连击！" : "连击！"}
      </span>
    </div>
  );
}
