import { CHASER } from "../../lib/characters";

interface ChaserMeterProps {
  proximity: number;
  meters: number;
  danger: boolean;
}

/** Always-visible track showing how close the kangaroo rider is. */
export function ChaserMeter({ proximity, meters, danger }: ChaserMeterProps) {
  const pct = Math.round(proximity * 100);
  return (
    <div
      data-ocid="game.chaser.panel"
      className={`panel-glass mx-auto flex w-full max-w-md items-center gap-3 rounded-full px-3 py-2 ${
        danger ? "border-destructive" : ""
      }`}
    >
      <img
        src={CHASER.imagePath}
        alt="袋鼠骑手"
        className={`size-9 shrink-0 rounded-full border-2 border-ink object-cover ${
          danger ? "animate-wiggle" : ""
        }`}
      />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between font-display text-[11px] font-black">
          <span
            className={danger ? "text-destructive" : "text-muted-foreground"}
          >
            {danger ? "袋鼠就在身后！" : "袋鼠距离"}
          </span>
          <span className="tabular font-mono text-foreground">{meters} 米</span>
        </div>
        <div
          className="relative h-2.5 overflow-hidden rounded-full bg-muted"
          role="meter"
          aria-label="袋鼠追近程度"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          <div
            className={`absolute inset-y-0 left-0 origin-left rounded-full transition-transform duration-200 ${
              danger ? "bg-destructive" : "bg-gradient-primary"
            }`}
            style={{
              width: "100%",
              transform: `scaleX(${Math.max(0.04, proximity)})`,
            }}
          />
        </div>
      </div>
      <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink bg-primary font-display text-sm font-black text-primary-foreground">
        你
      </span>
    </div>
  );
}
