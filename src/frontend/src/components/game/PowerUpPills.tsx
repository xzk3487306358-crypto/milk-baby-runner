import { Magnet, Rocket, Shield, Sparkles, Zap } from "lucide-react";
import type { ComponentType } from "react";
import type { ActivePowerUp } from "../../game/hud";
import { POWER_UPS, type PowerUpId } from "../../lib/gameConfig";

export const POWER_UP_STYLE: Record<
  PowerUpId,
  { icon: ComponentType<{ className?: string }>; label: string; tone: string }
> = {
  magnet: {
    icon: Magnet,
    label: "磁铁",
    tone: "bg-accent text-accent-foreground",
  },
  rocketShoes: {
    icon: Rocket,
    label: "火箭鞋",
    tone: "bg-warning text-primary-foreground",
  },
  milkShield: {
    icon: Shield,
    label: "奶盾",
    tone: "bg-foreground text-background",
  },
  doubleCoins: {
    icon: Sparkles,
    label: "双倍金币",
    tone: "bg-primary text-primary-foreground",
  },
  naiFamilyUltimate: {
    icon: Zap,
    label: "奶家人大招",
    tone: "bg-secondary text-secondary-foreground",
  },
};

export function PowerUpPills({ active }: { active: ActivePowerUp[] }) {
  if (active.length === 0) return null;
  return (
    <ul
      data-ocid="game.powerups.list"
      className="mt-3 flex flex-wrap justify-center gap-2"
    >
      {active.map((p, i) => {
        const style = POWER_UP_STYLE[p.id];
        const Icon = style.icon;
        return (
          <li
            key={p.id}
            data-ocid={`game.powerups.item.${i + 1}`}
            className={`relative flex items-center gap-1.5 overflow-hidden rounded-full border-2 border-ink py-1 pl-2 pr-3 font-display text-xs font-black shadow-sticker-sm animate-pop-in ${style.tone} ${
              p.remaining < 2 ? "animate-pulse" : ""
            }`}
            title={POWER_UPS[p.id].description}
          >
            <span
              className="absolute inset-y-0 left-0 origin-left bg-background/40"
              style={{ width: "100%", transform: `scaleX(${1 - p.progress})` }}
              aria-hidden="true"
            />
            <Icon className="relative size-3.5" />
            <span className="relative">{style.label}</span>
            <span className="tabular relative font-mono">
              {p.remaining.toFixed(1)}s
            </span>
          </li>
        );
      })}
    </ul>
  );
}
