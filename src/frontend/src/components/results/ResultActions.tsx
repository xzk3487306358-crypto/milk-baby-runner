import { Link } from "@tanstack/react-router";
import { Home, RotateCcw } from "lucide-react";

const BASE =
  "flex h-14 items-center justify-center gap-2 rounded-full border-[3px] border-ink font-display text-xl font-black shadow-sticker transition-all duration-150 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-1 active:shadow-sticker-pressed";

export function ResultActions() {
  return (
    <nav
      aria-label="结算操作"
      style={{ animationDelay: "650ms" }}
      className="animate-slide-up grid grid-cols-1 gap-3 md:grid-cols-2"
    >
      <Link
        to="/play"
        data-ocid="results.play_again.primary_button"
        className={`${BASE} animate-pulse-cta bg-gradient-primary text-primary-foreground hover:animate-none`}
      >
        <RotateCcw className="size-5" aria-hidden="true" />
        再来一局
      </Link>
      <Link
        to="/"
        data-ocid="results.back_menu.secondary_button"
        className={`${BASE} bg-card text-foreground hover:bg-muted`}
      >
        <Home className="size-5" aria-hidden="true" />
        返回主菜单
      </Link>
    </nav>
  );
}
