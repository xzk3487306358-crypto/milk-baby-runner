import { motion, useReducedMotion } from "motion/react";

const COLORS = [
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-neon",
  "bg-success",
];

const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const dist = 70 + (i % 3) * 26;
  return {
    id: `confetti-${i}`,
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist - 20,
    rotate: (i % 2 === 0 ? 1 : -1) * (180 + i * 20),
    color: COLORS[i % COLORS.length],
    round: i % 3 === 0,
  };
});

/** One-shot confetti burst; remount with a new key to replay. */
export function ConfettiBurst() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 grid place-items-center"
      aria-hidden="true"
    >
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className={`absolute size-2.5 border border-ink ${p.color} ${p.round ? "rounded-full" : "rounded-[2px]"}`}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
          animate={{
            x: p.x,
            y: [0, p.y, p.y + 60],
            opacity: [1, 1, 0],
            scale: 1,
            rotate: p.rotate,
          }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
