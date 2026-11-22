import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

type MenuPath = "/play" | "/shop" | "/leaderboard" | "/story";

interface StickerLinkProps {
  to: MenuPath;
  label: string;
  hint?: string;
  icon: LucideIcon;
  ocid: string;
  tone?: "primary" | "glass";
  delay?: number;
}

const MotionLink = motion.create(Link);

export function StickerLink({
  to,
  label,
  hint,
  icon: Icon,
  ocid,
  tone = "glass",
  delay = 0,
}: StickerLinkProps) {
  const isPrimary = tone === "primary";
  return (
    <MotionLink
      to={to}
      data-ocid={ocid}
      initial={{ opacity: 0, y: 18, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 22, delay }}
      whileHover={{ scale: 1.04, rotate: isPrimary ? -1 : 1 }}
      whileTap={{ scale: 0.96, y: 3 }}
      className={
        isPrimary
          ? "group relative flex min-h-[4.5rem] w-full items-center justify-center gap-3 rounded-full border-[3px] border-ink bg-gradient-primary px-6 py-4 font-display text-3xl font-black text-primary-foreground shadow-sticker transition-shadow duration-150 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:shadow-sticker-pressed sm:text-4xl"
          : "group panel-glass flex min-h-[5.5rem] w-full flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-center shadow-sticker-sm transition-colors duration-150 hover:border-primary hover:bg-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:shadow-sticker-pressed"
      }
    >
      {isPrimary ? (
        <>
          <span
            className="pointer-events-none absolute inset-x-6 top-1.5 h-3 rounded-full bg-card opacity-25 blur-[1px]"
            aria-hidden="true"
          />
          <Icon
            className="size-8 shrink-0 fill-primary-foreground transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
          <span className="relative">{label}</span>
        </>
      ) : (
        <>
          <span className="grid size-10 place-items-center rounded-xl border-2 border-ink bg-gradient-neon text-foreground shadow-sticker-sm transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <span className="font-display text-base font-black leading-tight">
            {label}
          </span>
          {hint && (
            <span className="hidden text-xs font-semibold text-muted-foreground sm:block">
              {hint}
            </span>
          )}
        </>
      )}
    </MotionLink>
  );
}
