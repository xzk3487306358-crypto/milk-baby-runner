import { Home, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

const BTN =
  "flex h-14 w-full items-center justify-center gap-2 rounded-full border-[3px] border-ink font-display text-xl font-black shadow-sticker transition-smooth hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring active:translate-y-1 active:shadow-sticker-pressed";

export function PauseOverlay({
  onResume,
  onRestart,
  onMenu,
}: PauseOverlayProps) {
  const resumeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    resumeRef.current?.focus();
  }, []);

  return (
    <dialog
      open
      data-ocid="game.pause.dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
      className="absolute inset-0 z-30 m-0 grid h-full max-h-none w-full max-w-none place-items-center border-0 bg-background/70 p-6 text-foreground backdrop-blur-sm"
    >
      <div className="panel-glass w-full max-w-xs animate-pop-in rounded-3xl p-6 text-center shadow-sticker">
        <h2 id="pause-title" className="text-sticker font-display text-5xl">
          暂停中
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          袋鼠骑手也停下来喘口气了
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            ref={resumeRef}
            type="button"
            data-ocid="game.pause.resume_button"
            onClick={onResume}
            className={`${BTN} bg-gradient-primary text-primary-foreground`}
          >
            <Play className="size-5" aria-hidden="true" />
            继续
          </button>
          <button
            type="button"
            data-ocid="game.pause.restart_button"
            onClick={onRestart}
            className={`${BTN} bg-secondary text-secondary-foreground`}
          >
            <RotateCcw className="size-5" aria-hidden="true" />
            重新开始
          </button>
          <button
            type="button"
            data-ocid="game.pause.menu_button"
            onClick={onMenu}
            className={`${BTN} bg-card text-foreground`}
          >
            <Home className="size-5" aria-hidden="true" />
            返回主菜单
          </button>
        </div>
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          按 Esc 继续
        </p>
      </div>
    </dialog>
  );
}
