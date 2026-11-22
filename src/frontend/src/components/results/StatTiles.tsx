import { Coins, Flame, Footprints, Star, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { formatNumber } from "../../lib/progress";

function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || target <= 0) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);
  return value;
}

interface StatTileProps {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  tone: string;
  delayMs: number;
  featured?: boolean;
}

function StatTile({
  id,
  label,
  value,
  prefix,
  suffix,
  icon: Icon,
  tone,
  delayMs,
  featured,
}: StatTileProps) {
  const shown = useCountUp(value);
  return (
    <div
      data-ocid={`results.stat.${id}.card`}
      style={{ animationDelay: `${delayMs}ms` }}
      className={`panel-glass animate-pop-in flex min-w-0 flex-col gap-1 rounded-2xl p-3 shadow-sticker transition-transform duration-200 hover:-translate-y-0.5 ${
        featured ? "col-span-2 items-center py-4 text-center" : ""
      }`}
    >
      <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground sm:text-sm">
        <span
          className={`grid size-6 shrink-0 place-items-center rounded-full border-2 border-ink ${tone}`}
        >
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
        {label}
      </span>
      <span
        className={`truncate font-mono font-black tabular ${
          featured
            ? "text-sticker text-5xl sm:text-6xl"
            : "text-2xl text-foreground sm:text-3xl"
        }`}
      >
        {prefix}
        {formatNumber(shown)}
        {suffix && (
          <span className="ml-1 text-base font-bold text-muted-foreground">
            {suffix}
          </span>
        )}
      </span>
    </div>
  );
}

interface StatTilesProps {
  score: number;
  distance: number;
  coinsEarned: number;
  maxCombo: number;
  highScore: number;
}

export function StatTiles({
  score,
  distance,
  coinsEarned,
  maxCombo,
  highScore,
}: StatTilesProps) {
  return (
    <section
      aria-label="本局成绩"
      data-ocid="results.stats.section"
      className="grid grid-cols-2 gap-3"
    >
      <StatTile
        id="score"
        label="分数"
        value={score}
        icon={Star}
        tone="bg-gradient-primary text-primary-foreground"
        delayMs={150}
        featured
      />
      <StatTile
        id="distance"
        label="距离"
        value={distance}
        suffix="米"
        icon={Footprints}
        tone="bg-neon text-primary-foreground"
        delayMs={250}
      />
      <StatTile
        id="coins"
        label="本局金币"
        value={coinsEarned}
        prefix="+"
        icon={Coins}
        tone="bg-warning text-primary-foreground"
        delayMs={330}
      />
      <StatTile
        id="combo"
        label="最高连击"
        value={maxCombo}
        prefix="x"
        icon={Flame}
        tone="bg-secondary text-secondary-foreground"
        delayMs={410}
      />
      <StatTile
        id="high_score"
        label="历史最高"
        value={highScore}
        icon={Trophy}
        tone="bg-accent text-accent-foreground"
        delayMs={490}
      />
    </section>
  );
}
