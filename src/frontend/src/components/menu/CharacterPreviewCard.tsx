import { Link } from "@tanstack/react-router";
import { Shirt, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEquipped } from "../../hooks/useProgress";

export function CharacterPreviewCard() {
  const { character, skin } = useEquipped();
  const reduce = useReducedMotion();

  return (
    <motion.article
      data-ocid="menu.character.card"
      initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl border-[3px] border-ink bg-card shadow-sticker"
    >
      <div className="relative bg-night">
        <div className="absolute inset-0 speed-lines" aria-hidden="true" />
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 halftone opacity-70"
          aria-hidden="true"
        />
        <div
          className="absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-3xl"
          aria-hidden="true"
        />
        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border-2 border-ink bg-secondary px-2.5 py-0.5 font-display text-xs font-black text-secondary-foreground shadow-sticker-sm">
          <Sparkles className="size-3.5" aria-hidden="true" />
          当前出战
        </span>
        <span className="absolute right-3 top-3 z-10 rounded-full border-2 border-ink bg-accent px-2.5 py-0.5 font-display text-xs font-black text-accent-foreground shadow-sticker-sm">
          {character.ability.label}
        </span>
        <motion.img
          key={skin.id}
          src={skin.imagePath}
          alt={`${character.name}·${skin.name}`}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={
            reduce
              ? { opacity: 1, scale: 1 }
              : { opacity: 1, scale: 1, y: [0, -10, 0] }
          }
          transition={{
            opacity: { duration: 0.3 },
            scale: { type: "spring", stiffness: 300, damping: 16 },
            y: {
              duration: 2.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
          className="relative mx-auto aspect-square w-56 object-contain drop-shadow-[0_10px_0_oklch(0.12_0.04_290/0.6)] sm:w-64"
        />
        <div
          className="mx-auto -mt-4 mb-3 h-3 w-32 rounded-full bg-ink opacity-60 blur-sm"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col gap-2 border-t-[3px] border-ink p-4">
        <div className="flex min-w-0 items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sticker truncate font-display text-3xl">
              {character.name}
            </h2>
            <p className="truncate text-sm font-bold text-accent">
              皮肤：{skin.name}
            </p>
          </div>
          <Link
            to="/shop"
            data-ocid="menu.change_skin.link"
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border-2 border-ink bg-muted px-4 font-display text-sm font-black text-foreground shadow-sticker-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent active:translate-y-0.5 active:shadow-sticker-pressed"
          >
            <Shirt className="size-4" aria-hidden="true" />
            换装
          </Link>
        </div>
        <p className="relative rounded-2xl border-2 border-ink bg-primary px-3 py-2 font-display text-base font-black text-primary-foreground shadow-sticker-sm">
          <span className="sr-only">口头禅：</span>“{character.catchphrase}”
        </p>
      </div>
    </motion.article>
  );
}
