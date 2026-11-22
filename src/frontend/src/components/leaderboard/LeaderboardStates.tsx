import { Link } from "@tanstack/react-router";
import { RotateCcw, TriangleAlert, Trophy } from "lucide-react";

export const stickerButton =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border-[3px] border-ink px-6 font-display text-base font-black shadow-sticker transition-all duration-150 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-1 active:shadow-sticker-pressed";

const SKELETON_IDS = Array.from({ length: 6 }, (_, i) => `skeleton-${i}`);

export function LeaderboardSkeleton() {
  return (
    <div
      data-ocid="leaderboard.loading_state"
      aria-busy="true"
      className="flex flex-col gap-2.5"
    >
      <p className="text-center font-display text-sm font-black text-muted-foreground">
        加载中…
      </p>
      {SKELETON_IDS.map((id) => (
        <div
          key={id}
          className="panel-glass flex items-center gap-3 rounded-2xl p-3"
        >
          <div className="size-10 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="size-12 shrink-0 animate-pulse rounded-xl bg-muted" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}

export function LeaderboardEmpty() {
  return (
    <div
      data-ocid="leaderboard.empty_state"
      className="panel-glass flex animate-pop-in flex-col items-center gap-4 rounded-3xl px-6 py-10 text-center"
    >
      <span className="grid size-20 -rotate-6 place-items-center rounded-full border-[3px] border-ink bg-gradient-primary text-primary-foreground shadow-sticker">
        <Trophy className="size-10" aria-hidden="true" />
      </span>
      <p className="max-w-xs font-display text-lg font-black">
        还没有人上榜，快去抢占第一！
      </p>
      <Link
        to="/play"
        data-ocid="leaderboard.empty_play.primary_button"
        className={`${stickerButton} bg-gradient-primary text-primary-foreground`}
      >
        去跑酷
      </Link>
    </div>
  );
}

interface ErrorProps {
  message: string;
  onRetry: () => void;
  retrying: boolean;
}

export function LeaderboardError({ message, onRetry, retrying }: ErrorProps) {
  return (
    <div
      data-ocid="leaderboard.error_state"
      role="alert"
      className="panel-glass flex flex-col items-center gap-4 rounded-3xl border-destructive px-6 py-10 text-center"
    >
      <span className="grid size-16 rotate-6 place-items-center rounded-full border-[3px] border-ink bg-destructive text-destructive-foreground shadow-sticker">
        <TriangleAlert className="size-8" aria-hidden="true" />
      </span>
      <p className="max-w-xs font-display text-base font-black">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        data-ocid="leaderboard.retry_button"
        className={`${stickerButton} bg-accent text-accent-foreground disabled:opacity-70`}
      >
        <RotateCcw
          className={`size-4 ${retrying ? "animate-spin" : ""}`}
          aria-hidden="true"
        />
        {retrying ? "重试中…" : "重试"}
      </button>
    </div>
  );
}
