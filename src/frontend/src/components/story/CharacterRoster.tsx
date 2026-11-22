import { motion, useReducedMotion } from "motion/react";
import { CHARACTERS, CHASER } from "../../lib/characters";

interface RosterEntry {
  id: string;
  name: string;
  role: string;
  description: string;
  catchphrase: string;
  imagePath: string;
}

const ROSTER: RosterEntry[] = [
  ...CHARACTERS.map((c) => ({
    id: c.id,
    name: c.name,
    role: "逃亡者",
    description: c.description,
    catchphrase: c.catchphrase,
    imagePath: c.imagePath,
  })),
  {
    id: CHASER.id,
    name: CHASER.name,
    role: "追击者",
    description: CHASER.description,
    catchphrase: CHASER.catchphrase,
    imagePath: CHASER.imagePath,
  },
];

export function CharacterRoster() {
  const reduce = useReducedMotion();

  return (
    <section data-ocid="story.roster.section" className="mt-12">
      <h2 className="text-sticker text-center font-display text-3xl md:text-4xl">
        登场角色
      </h2>
      <p className="mt-2 text-center text-sm font-semibold text-muted-foreground">
        三位主角，一场停不下来的追逐
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {ROSTER.map((r, i) => (
          <motion.div
            key={r.id}
            data-ocid={`story.roster.item.${i + 1}`}
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              delay: i * 0.08,
              type: "spring",
              stiffness: 200,
              damping: 16,
            }}
            className="panel-glass flex items-center gap-4 rounded-lg p-4 md:flex-col md:text-center"
          >
            <div className="halftone relative shrink-0 rounded-full border-[3px] border-ink bg-gradient-primary p-1 shadow-sticker-sm">
              <img
                src={r.imagePath}
                alt={`${r.name}原创二创插画`}
                loading="lazy"
                className="size-20 rounded-full object-contain md:size-28"
              />
            </div>
            <div className="min-w-0">
              <span
                className={`inline-block rounded-full border-2 border-ink px-2 py-0.5 text-xs font-black ${
                  r.role === "追击者"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-accent text-accent-foreground"
                }`}
              >
                {r.role}
              </span>
              <h3 className="mt-1 font-display text-xl font-black text-primary">
                {r.name}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-card-foreground">
                {r.description}
              </p>
              <p className="mt-2 font-display text-base font-black text-accent break-words">
                “{r.catchphrase}”
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <p
        data-ocid="story.parody_note"
        className="mx-auto mt-6 max-w-md rounded-lg border-2 border-dashed border-neon bg-muted/60 px-4 py-3 text-center text-xs font-semibold leading-relaxed text-muted-foreground"
      >
        温馨提示：本页及游戏内所有角色形象均为本游戏原创的二次创作风格插画，仅供娱乐玩梗，与任何品牌官方形象无关。
      </p>
    </section>
  );
}
