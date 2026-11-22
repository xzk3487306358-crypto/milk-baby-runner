import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, Coins } from "lucide-react";
import type { ReactNode } from "react";
import { useCoins } from "../hooks/useProgress";
import { GAME_LOGO_PATH } from "../lib/characters";
import { formatNumber } from "../lib/progress";

export function CoinPill() {
  const coins = useCoins();
  return (
    <div
      data-ocid="topbar.coins.panel"
      className="panel-glass flex min-w-0 items-center gap-1.5 rounded-full py-1 pl-1 pr-3 shadow-subtle"
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-ink bg-gradient-primary text-primary-foreground">
        <Coins className="size-4" aria-hidden="true" />
      </span>
      <span className="sr-only">金币</span>
      <span className="truncate font-mono text-sm font-bold tabular sm:text-base">
        {formatNumber(coins)}
      </span>
    </div>
  );
}

interface PagePlaceholderProps {
  pageId: string;
  title: string;
  subtitle: string;
}

/** Temporary page body shared by route shells until page tasks replace them. */
export function PagePlaceholder({
  pageId,
  title,
  subtitle,
}: PagePlaceholderProps) {
  return (
    <section
      data-ocid={`${pageId}.page`}
      className="flex flex-1 flex-col items-center justify-center gap-5 py-10 text-center"
    >
      <img
        src={GAME_LOGO_PATH}
        alt="奶娃大逃亡 游戏标志"
        className="w-64 max-w-full animate-float drop-shadow-xl"
      />
      <h1 className="text-sticker animate-pop-in font-display text-4xl md:text-5xl">
        {title}
      </h1>
      <p className="max-w-xs text-base font-semibold text-muted-foreground">
        {subtitle}
      </p>
      <Link
        to="/"
        data-ocid={`${pageId}.back_menu.link`}
        className="rounded-full border-[3px] border-ink bg-gradient-primary px-8 py-3 font-display text-lg font-black text-primary-foreground shadow-sticker transition-all duration-150 hover:scale-105 active:translate-y-1 active:shadow-sticker-pressed"
      >
        返回主菜单
      </Link>
    </section>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isMenu = pathname === "/";
  const year = new Date().getFullYear();
  const host = typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-night text-foreground">
      <div
        className="pointer-events-none fixed inset-0 halftone opacity-60"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 speed-lines"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col md:max-w-2xl">
        <header className="sticky top-0 z-30 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
          <div className="flex items-center gap-2">
            {isMenu ? (
              <span className="text-sticker min-w-0 truncate font-display text-xl sm:text-2xl">
                奶娃大逃亡
              </span>
            ) : (
              <Link
                to="/"
                data-ocid="topbar.back_menu.link"
                className="panel-glass flex h-11 min-w-0 shrink-0 items-center gap-1 rounded-full pl-2 pr-4 font-display text-sm font-black transition-transform duration-150 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronLeft
                  className="size-5 text-primary"
                  aria-hidden="true"
                />
                返回主菜单
              </Link>
            )}
            {!isMenu && (
              <span className="text-sticker hidden min-w-0 flex-1 truncate text-center font-display text-lg sm:block">
                奶娃大逃亡
              </span>
            )}
            <div className="ml-auto flex min-w-0 justify-end">
              <CoinPill />
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col px-3 pb-4">{children}</main>

        <footer className="px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-xs font-semibold text-muted-foreground">
          © {year}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(host)}`}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-accent underline-offset-2 hover:text-accent"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
