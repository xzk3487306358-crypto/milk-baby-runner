import { Coins } from "lucide-react";
import type { CSSProperties } from "react";
import { useCoins, useEquipped } from "../../hooks/useProgress";
import { formatNumber } from "../../lib/progress";

export function ShopHeader() {
  const coins = useCoins();
  const { character, skin } = useEquipped();

  return (
    <section
      data-ocid="shop.header.panel"
      style={{ "--glow": skin.accentColor } as CSSProperties}
      className="panel-glass relative flex items-center gap-3 overflow-hidden rounded-3xl p-3 shadow-subtle sm:gap-5 sm:p-4"
    >
      <div
        className="pointer-events-none absolute -left-10 -top-10 size-48 rounded-full opacity-40 blur-2xl bg-[var(--glow)]"
        aria-hidden="true"
      />
      <div className="relative size-24 shrink-0 animate-float rounded-2xl border-[3px] border-ink bg-night shadow-sticker sm:size-28">
        <img
          src={skin.imagePath}
          alt={`当前装备：${character.name} · ${skin.name}`}
          className="size-full object-contain p-1"
        />
      </div>
      <div className="relative flex min-w-0 flex-1 flex-col gap-1">
        <h1 className="text-sticker font-display text-3xl sm:text-4xl">
          皮肤商店
        </h1>
        <p className="truncate text-xs font-bold text-muted-foreground sm:text-sm">
          当前装备 <span className="text-foreground">{character.name}</span> ·{" "}
          <span className="text-foreground">{skin.name}</span>
        </p>
        <div
          data-ocid="shop.coins.panel"
          className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full border-2 border-ink bg-card py-1 pl-1 pr-3 shadow-sticker-sm"
        >
          <span className="grid size-7 place-items-center rounded-full border-2 border-ink bg-gradient-primary text-primary-foreground">
            <Coins className="size-4" aria-hidden="true" />
          </span>
          <span className="font-mono text-lg font-black tabular text-primary">
            {formatNumber(coins)}
          </span>
          <span className="text-xs font-bold text-muted-foreground">金币</span>
        </div>
      </div>
    </section>
  );
}
