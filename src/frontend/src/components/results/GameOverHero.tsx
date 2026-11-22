import { Sparkles } from "lucide-react";
import { CHASER, getCharacter, getSkin } from "../../lib/characters";

interface GameOverHeroProps {
  characterId: string;
  skinId: string;
  isNewRecord: boolean;
}

export function GameOverHero({
  characterId,
  skinId,
  isNewRecord,
}: GameOverHeroProps) {
  const character = getCharacter(characterId);
  const skin = getSkin(skinId);
  const runnerImage =
    skin.characterId === character.id ? skin.imagePath : character.imagePath;
  const runnerName =
    skin.characterId === character.id ? skin.name : character.name;

  return (
    <section
      data-ocid="results.hero.section"
      className="relative flex flex-col items-center pt-2 text-center"
    >
      <div className="relative flex h-40 w-full max-w-xs items-end justify-center sm:h-48">
        <img
          src={runnerImage}
          alt={`${runnerName}，被抓住了一脸懵`}
          className="animate-pop-in relative z-10 size-32 -rotate-6 object-contain drop-shadow-xl sm:size-40"
        />
        <img
          src={CHASER.imagePath}
          alt={`${CHASER.name}，追上了奶娃`}
          style={{ animationDelay: "120ms" }}
          className="animate-pop-in -ml-8 size-36 object-contain drop-shadow-xl sm:size-44"
        />
        {isNewRecord && (
          <span
            data-ocid="results.new_record.badge"
            style={{ animationDelay: "500ms" }}
            className="animate-pop-in absolute -top-1 right-0 z-20 sm:-right-4"
          >
            <span className="animate-wiggle flex items-center gap-1 rounded-full border-[3px] border-ink bg-secondary px-3 py-1.5 font-display text-base font-black text-secondary-foreground shadow-sticker sm:text-lg">
              <Sparkles className="size-4" aria-hidden="true" />
              新纪录！
            </span>
          </span>
        )}
      </div>
      <h1
        style={{ animationDelay: "200ms" }}
        className="text-sticker animate-pop-in mt-3 font-display text-4xl sm:text-5xl"
      >
        被袋鼠抓住了！
      </h1>
      <p
        style={{ animationDelay: "300ms" }}
        className="animate-slide-up mt-2 max-w-xs text-sm font-bold text-muted-foreground"
      >
        「{CHASER.catchphrase}」外卖没追回来，下一局一定跑得更远！
      </p>
    </section>
  );
}
