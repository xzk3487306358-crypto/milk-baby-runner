import { motion } from "motion/react";
import { CHASER } from "../../lib/characters";
import { CHASER_RULES } from "../../lib/gameConfig";

/** Comic freeze-frame shown while the kangaroo grabs the runner. */
export function CaughtOverlay({ runnerImage }: { runnerImage: string }) {
  return (
    <div
      data-ocid="game.caught.panel"
      role="alert"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-background/40 speed-lines"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="absolute inset-0 bg-foreground"
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      />
      <div className="absolute inset-x-0 top-[14%] flex flex-col items-center gap-4 px-4">
        <motion.h2
          className="text-sticker font-display text-6xl sm:text-8xl"
          initial={{ scale: 3, rotate: -14, opacity: 0 }}
          animate={{ scale: 1, rotate: -6, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 12 }}
        >
          被抓住了！
        </motion.h2>
        <div className="relative mt-4 flex items-end">
          <motion.img
            src={CHASER.imagePath}
            alt={CHASER.name}
            className="relative z-10 size-36 rounded-full border-4 border-ink object-cover shadow-sticker sm:size-44"
            initial={{ x: 160, rotate: 25 }}
            animate={{ x: 24, rotate: -8 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 14,
              delay: 0.15,
            }}
          />
          <motion.img
            src={runnerImage}
            alt="被抓住的角色"
            className="size-28 rounded-full border-4 border-ink object-cover shadow-sticker sm:size-36"
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -18, 14, -10, 0], y: [0, -10, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
          <div className="absolute -top-20 left-1/2 w-64 -translate-x-1/2">
            <motion.p
              className="rounded-3xl border-4 border-ink bg-foreground px-4 py-3 text-center font-display text-xl font-black text-background shadow-sticker"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 14,
                delay: 0.45,
              }}
            >
              {CHASER_RULES.caughtText}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
