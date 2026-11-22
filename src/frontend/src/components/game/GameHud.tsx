import { Pause } from "lucide-react";
import type { HudSnapshot } from "../../game/hud";
import { formatNumber } from "../../lib/progress";
import { ChaserMeter } from "./ChaserMeter";
import { PowerUpPills } from "./PowerUpPills";

interface GameHudProps {
  hud: HudSnapshot;
  onPause: () => void;
  canPause: boolean;
}

export function GameHud({ hud, onPause, canPause }: GameHudProps) {
  const hot = hud.multiplier >= 4;
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col p-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div
          data-ocid="game.score.panel"
          className="panel-glass min-w-0 rounded-2xl px-3 py-2 shadow-sticker-sm sm:px-4"
        >
          <p className="font-display text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            分数
          </p>
          <p className="tabular truncate font-display text-2xl font-black leading-none text-primary sm:text-3xl">
            {formatNumber(hud.score)}
          </p>
          <p className="tabular mt-1 font-mono text-xs text-accent">
            {formatNumber(hud.distance)} 米 · {hud.phaseName}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div
            data-ocid="game.multiplier.panel"
            className={`rounded-full border-2 border-ink px-3 py-1 font-display text-xl font-black shadow-sticker-sm sm:text-2xl ${
              hot
                ? "bg-secondary text-secondary-foreground animate-pulse-cta"
                : "bg-primary text-primary-foreground"
            }`}
          >
            x{hud.multiplier}
          </div>
          {hud.combo > 0 && (
            <span className="tabular text-outline font-display text-xs font-black text-foreground">
              连击 {hud.combo}
            </span>
          )}
        </div>

        <div className="flex items-start gap-2">
          <div
            data-ocid="game.coins.panel"
            className="panel-glass flex items-center gap-1.5 rounded-full py-1.5 pl-1.5 pr-3 shadow-sticker-sm"
          >
            <span className="grid size-7 place-items-center rounded-full border-2 border-ink bg-primary font-display text-xs font-black text-primary-foreground">
              奶
            </span>
            <span className="tabular font-display text-lg font-black text-primary">
              {formatNumber(hud.coins)}
            </span>
          </div>
          <button
            type="button"
            data-ocid="game.pause.button"
            onClick={onPause}
            disabled={!canPause}
            aria-label="暂停"
            className="pointer-events-auto flex h-11 items-center gap-1 rounded-full border-2 border-ink bg-card px-3 font-display text-sm font-black text-foreground shadow-sticker-sm transition-smooth hover:-translate-y-0.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0.5 active:shadow-sticker-pressed disabled:opacity-50"
          >
            <Pause className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">暂停</span>
          </button>
        </div>
      </div>

      <PowerUpPills active={hud.active} />

      <div className="mt-auto pb-[env(safe-area-inset-bottom)]">
        <ChaserMeter
          proximity={hud.proximity}
          meters={hud.chaserMeters}
          danger={hud.danger}
        />
      </div>
    </div>
  );
}
