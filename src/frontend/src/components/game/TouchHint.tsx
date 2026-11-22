import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

const HINTS = [
  { icon: ArrowLeft, label: "左滑换道" },
  { icon: ArrowRight, label: "右滑换道" },
  { icon: ArrowUp, label: "上滑跳跃" },
  { icon: ArrowDown, label: "下滑翻滚" },
];

export function TouchHint() {
  return (
    <div
      data-ocid="game.touch_hint.panel"
      className="pointer-events-none absolute inset-x-0 bottom-28 flex justify-center px-6"
    >
      <div className="panel-glass grid w-full max-w-xs animate-pop-in grid-cols-2 gap-2 rounded-3xl p-4 shadow-sticker">
        <p className="col-span-2 text-center font-display text-lg font-black text-primary">
          滑动屏幕开跑！
        </p>
        {HINTS.map((h) => (
          <div
            key={h.label}
            className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-2 font-display text-sm font-black"
          >
            <h.icon
              className="size-5 animate-float text-accent"
              aria-hidden="true"
            />
            {h.label}
          </div>
        ))}
      </div>
    </div>
  );
}
