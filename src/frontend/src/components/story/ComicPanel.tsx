import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { SpeechBubble } from "./SpeechBubble";
import type { StoryBeat } from "./storyData";

export function ComicPanel({ beat }: { beat: StoryBeat }) {
  const reduce = useReducedMotion();
  const tilt = beat.index % 2 === 0 ? 1.2 : -1.2;

  return (
    <motion.article
      data-ocid={`story.panel.${beat.index}`}
      initial={reduce ? false : { opacity: 0, y: 40, rotate: tilt * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      className="relative overflow-hidden rounded-lg border-[4px] border-ink bg-card shadow-sticker"
    >
      {/* halftone border frame */}
      <div className="halftone bg-secondary/40 p-2">
        <div
          className={cn(
            "relative aspect-[4/3] overflow-hidden rounded-md border-[3px] border-ink",
            beat.scene,
          )}
        >
          <div className="pointer-events-none absolute inset-0 halftone opacity-70" />
          <div className="pointer-events-none absolute inset-0 speed-lines" />

          <span className="absolute bottom-2 left-2 z-30 flex size-9 items-center justify-center rounded-full border-[3px] border-ink bg-primary font-display text-lg font-black text-primary-foreground shadow-sticker-sm">
            {beat.index}
          </span>

          {beat.sfx && (
            <span
              aria-hidden="true"
              className="text-sticker absolute right-3 bottom-3 z-30 -rotate-6 font-display text-2xl"
            >
              {beat.sfx}
            </span>
          )}

          {beat.cast.map((c) => (
            <img
              key={c.id}
              src={c.src}
              alt={c.alt}
              loading="lazy"
              className={cn(
                "absolute z-10 h-auto drop-shadow-[0_6px_0_oklch(0.12_0.04_290)]",
                c.className,
                c.flip && "-scale-x-100",
              )}
            />
          ))}

          {beat.bubbles.map((b) => (
            <SpeechBubble key={b.id} bubble={b} />
          ))}
        </div>
      </div>

      <div className="border-t-[3px] border-ink bg-card px-4 py-3">
        <h3 className="font-display text-lg font-black text-primary">
          第{beat.index}格 · {beat.title}
        </h3>
        <p className="mt-1 text-sm font-semibold leading-relaxed text-card-foreground">
          {beat.caption}
        </p>
      </div>
    </motion.article>
  );
}
