import { cn } from "@/lib/utils";
import type { PanelBubble } from "./storyData";

const TONES: Record<PanelBubble["tone"], string> = {
  light: "bg-foreground text-primary-foreground",
  yellow: "bg-primary text-primary-foreground",
  magenta: "bg-secondary text-secondary-foreground",
  shout: "bg-destructive text-destructive-foreground -rotate-2 text-base",
};

export function SpeechBubble({ bubble }: { bubble: PanelBubble }) {
  return (
    <div
      className={cn(
        "absolute z-20 max-w-[62%] rounded-2xl border-[3px] border-ink px-3 py-1.5 font-display text-sm font-black leading-snug shadow-sticker-sm break-words",
        TONES[bubble.tone],
        bubble.className,
      )}
    >
      {bubble.text}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-[9px] size-4 rotate-45 border-b-[3px] border-r-[3px] border-ink",
          TONES[bubble.tone].split(" ")[0],
          bubble.tail === "left" ? "left-5" : "right-5",
        )}
      />
    </div>
  );
}
