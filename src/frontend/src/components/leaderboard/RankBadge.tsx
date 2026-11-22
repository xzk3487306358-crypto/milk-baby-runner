import { Crown, Medal } from "lucide-react";

const MEDALS = [
  { label: "金牌", className: "bg-gradient-primary text-primary-foreground" },
  { label: "银牌", className: "bg-muted-foreground text-primary-foreground" },
  { label: "铜牌", className: "bg-warning text-primary-foreground" },
] as const;

export default function RankBadge({ rank }: { rank: number }) {
  const medal = MEDALS[rank - 1];
  if (!medal) {
    return (
      <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-border bg-muted font-mono text-sm font-bold tabular text-muted-foreground">
        {rank}
      </span>
    );
  }
  const Icon = rank === 1 ? Crown : Medal;
  return (
    <span
      className={`relative grid size-11 shrink-0 -rotate-6 place-items-center rounded-full border-[3px] border-ink shadow-sticker-sm ${medal.className}`}
    >
      <span className="sr-only">
        {medal.label} 第 {rank} 名
      </span>
      <Icon
        className="absolute -top-2.5 size-4 drop-shadow"
        aria-hidden="true"
      />
      <span
        className="font-display text-lg font-black leading-none"
        aria-hidden="true"
      >
        {rank}
      </span>
    </span>
  );
}
