import { Link } from "@tanstack/react-router";
import { ChevronLeft, Play, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import {
  LeaderboardCards,
  LeaderboardTable,
} from "../components/leaderboard/LeaderboardList";
import {
  LeaderboardEmpty,
  LeaderboardError,
  LeaderboardSkeleton,
  stickerButton,
} from "../components/leaderboard/LeaderboardStates";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useLastRun } from "../hooks/useProgress";

export default function LeaderboardPage() {
  const { data, isLoading, errorMessage, refetch, isFetching } =
    useLeaderboard();
  const lastRun = useLastRun();
  const myEntryId = lastRun?.submittedEntryId ?? null;
  const entries = data ?? [];

  let body: ReactNode;
  if (errorMessage) {
    body = (
      <LeaderboardError
        message={errorMessage}
        retrying={isFetching}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  } else if (isLoading) {
    body = <LeaderboardSkeleton />;
  } else if (entries.length === 0) {
    body = <LeaderboardEmpty />;
  } else {
    body = (
      <>
        <LeaderboardTable entries={entries} myEntryId={myEntryId} />
        <LeaderboardCards entries={entries} myEntryId={myEntryId} />
      </>
    );
  }

  return (
    <section
      data-ocid="leaderboard.page"
      className="flex flex-1 flex-col gap-5 py-4"
    >
      <header className="flex animate-pop-in flex-col items-center gap-1 text-center motion-reduce:animate-none">
        <span className="mb-1 grid size-14 -rotate-6 place-items-center rounded-full border-[3px] border-ink bg-gradient-primary text-primary-foreground shadow-sticker">
          <Trophy className="size-7" aria-hidden="true" />
        </span>
        <h1 className="text-sticker font-display text-4xl md:text-5xl">
          全球排行榜
        </h1>
        <p className="rounded-full bg-secondary px-3 py-0.5 font-display text-sm font-black text-secondary-foreground">
          前 50 名
        </p>
      </header>

      <div className="flex-1">{body}</div>

      <nav
        aria-label="排行榜操作"
        className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center"
      >
        <Link
          to="/"
          data-ocid="leaderboard.back_menu.link"
          className={`${stickerButton} panel-glass text-foreground`}
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
          返回主菜单
        </Link>
        <Link
          to="/play"
          data-ocid="leaderboard.play.primary_button"
          className={`${stickerButton} bg-gradient-primary text-primary-foreground`}
        >
          <Play className="size-5 fill-current" aria-hidden="true" />
          去跑酷
        </Link>
      </nav>
    </section>
  );
}
