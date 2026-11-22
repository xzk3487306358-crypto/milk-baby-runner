import { BookOpen, Play, Shirt, Trophy } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CharacterPreviewCard } from "../components/menu/CharacterPreviewCard";
import { IntroOverlay } from "../components/menu/IntroOverlay";
import { StatsStrip } from "../components/menu/StatsStrip";
import { StickerLink } from "../components/menu/StickerLink";
import { useProgressActions } from "../hooks/useProgress";
import { GAME_LOGO_PATH } from "../lib/characters";
import { useProgressStore } from "../store/progressStore";

const SECONDARY_LINKS = [
  {
    to: "/shop",
    label: "皮肤商店",
    hint: "解锁新造型",
    icon: Shirt,
    ocid: "menu.shop.link",
  },
  {
    to: "/leaderboard",
    label: "排行榜",
    hint: "全网前 50",
    icon: Trophy,
    ocid: "menu.leaderboard.link",
  },
  {
    to: "/story",
    label: "背景故事",
    hint: "外卖风波",
    icon: BookOpen,
    ocid: "menu.story.link",
  },
] as const;

export default function MainMenuPage() {
  const hasSeenIntro = useProgressStore((s) => s.hasSeenIntro);
  const { markIntroSeen } = useProgressActions();
  const reduce = useReducedMotion();

  return (
    <section
      data-ocid="menu.page"
      className="grid flex-1 grid-cols-1 content-center gap-5 py-4 md:grid-cols-2 md:gap-x-6 md:gap-y-4"
    >
      <div className="flex flex-col gap-4 md:col-start-2 md:row-start-1 md:self-end">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="relative"
        >
          <h1 className="sr-only">奶娃大逃亡</h1>
          <motion.img
            src={GAME_LOGO_PATH}
            alt="奶娃大逃亡 游戏标志"
            animate={reduce ? undefined : { y: [0, -6, 0] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="mx-auto w-full max-w-xs drop-shadow-[0_8px_0_oklch(0.12_0.04_290/0.7)] md:max-w-none"
          />
          <p className="mt-1 text-center font-display text-sm font-black tracking-wide text-accent">
            霓虹夜城 · 三车道狂奔 · 别被袋鼠追上！
          </p>
        </motion.div>

        <StatsStrip />
      </div>

      <div className="md:col-start-1 md:row-span-2 md:row-start-1 md:self-center">
        <CharacterPreviewCard />
      </div>

      <div className="flex flex-col gap-4 md:col-start-2 md:row-start-2 md:self-start">
        <MenuActions />
      </div>

      <AnimatePresence>
        {!hasSeenIntro && <IntroOverlay onDone={markIntroSeen} />}
      </AnimatePresence>
    </section>
  );
}

function MenuActions() {
  return (
    <>
      <StickerLink
        to="/play"
        label="开始游戏"
        icon={Play}
        tone="primary"
        ocid="menu.start.primary_button"
        delay={0.3}
      />
      <nav aria-label="游戏菜单" className="grid grid-cols-3 gap-3">
        {SECONDARY_LINKS.map((l, i) => (
          <StickerLink
            key={l.to}
            to={l.to}
            label={l.label}
            hint={l.hint}
            icon={l.icon}
            ocid={l.ocid}
            delay={0.4 + i * 0.07}
          />
        ))}
      </nav>
    </>
  );
}
