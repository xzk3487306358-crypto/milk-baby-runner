import { Link } from "@tanstack/react-router";
import { Home, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { CharacterRoster } from "../components/story/CharacterRoster";
import { ComicPanel } from "../components/story/ComicPanel";
import { STORY_BEATS } from "../components/story/storyData";

const BTN_BASE =
  "flex h-14 items-center justify-center gap-2 rounded-full border-[3px] border-ink px-8 font-display text-lg font-black shadow-sticker transition-all duration-150 hover:-translate-y-0.5 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-1 active:shadow-sticker-pressed";

export default function StoryPage() {
  const reduce = useReducedMotion();

  return (
    <section data-ocid="story.page" className="flex flex-col py-4">
      <motion.header
        initial={reduce ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="inline-block -rotate-2 rounded-full border-2 border-ink bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground shadow-sticker-sm">
          前情提要 · 共六格
        </span>
        <h1 className="text-sticker mt-3 font-display text-4xl md:text-5xl">
          奶娃的故事
        </h1>
        <p className="mt-2 text-sm font-semibold text-muted-foreground">
          袋鼠骑手为什么追着奶娃不放？往下滑看真相
        </p>
      </motion.header>

      <div
        data-ocid="story.panel.list"
        className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {STORY_BEATS.map((beat) => (
          <ComicPanel key={beat.id} beat={beat} />
        ))}
      </div>

      <CharacterRoster />

      <div className="mt-10 mb-4 flex flex-col items-stretch gap-4 sm:flex-row sm:justify-center">
        <Link
          to="/play"
          data-ocid="story.start_escape.primary_button"
          className={`${BTN_BASE} bg-gradient-primary text-primary-foreground`}
        >
          <Play className="size-5" aria-hidden="true" />
          开始逃亡
        </Link>
        <Link
          to="/"
          data-ocid="story.back_menu.secondary_button"
          className={`${BTN_BASE} panel-glass text-foreground`}
        >
          <Home className="size-5" aria-hidden="true" />
          返回主菜单
        </Link>
      </div>
    </section>
  );
}
