import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { GameOverHero } from "../components/results/GameOverHero";
import { ResultActions } from "../components/results/ResultActions";
import { StatTiles } from "../components/results/StatTiles";
import { SubmitScoreForm } from "../components/results/SubmitScoreForm";
import { useHighScore, useLastRun } from "../hooks/useProgress";
import { CHASER } from "../lib/characters";

function ResultsEmpty() {
  return (
    <section
      data-ocid="results.empty_state"
      className="flex flex-1 flex-col items-center justify-center gap-5 py-10 text-center"
    >
      <img
        src={CHASER.imagePath}
        alt={`${CHASER.name}正在等你开跑`}
        className="size-40 animate-float object-contain drop-shadow-xl"
      />
      <h1 className="text-sticker animate-pop-in font-display text-3xl sm:text-4xl">
        还没有跑过，先去跑一局！
      </h1>
      <p className="max-w-xs text-sm font-bold text-muted-foreground">
        袋鼠骑手已经在路口等着了，跑完一局就能在这里看到成绩。
      </p>
      <Link
        to="/play"
        data-ocid="results.empty_play.primary_button"
        className="animate-pulse-cta flex h-14 items-center gap-2 rounded-full border-[3px] border-ink bg-gradient-primary px-10 font-display text-xl font-black text-primary-foreground shadow-sticker transition-all duration-150 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:translate-y-1 active:shadow-sticker-pressed"
      >
        <Play className="size-5" aria-hidden="true" />
        开始奔跑
      </Link>
    </section>
  );
}

export default function ResultsPage() {
  const lastRun = useLastRun();
  const highScore = useHighScore();

  if (!lastRun) return <ResultsEmpty />;

  return (
    <div data-ocid="results.page" className="flex flex-1 flex-col gap-5 py-4">
      <GameOverHero
        characterId={lastRun.characterId}
        skinId={lastRun.skinId}
        isNewRecord={lastRun.isNewRecord}
      />
      <StatTiles
        score={lastRun.score}
        distance={lastRun.distance}
        coinsEarned={lastRun.coinsEarned}
        maxCombo={lastRun.maxCombo}
        highScore={highScore}
      />
      <SubmitScoreForm run={lastRun} />
      <ResultActions />
    </div>
  );
}
