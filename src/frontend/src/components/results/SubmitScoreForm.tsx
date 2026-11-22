import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Send, Trophy } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useEntryRank, useSubmitScore } from "../../hooks/useLeaderboard";
import { useProgressActions } from "../../hooks/useProgress";
import {
  type LastRun,
  NICKNAME_MAX_LENGTH,
  formatNumber,
  sanitizeNickname,
} from "../../lib/progress";
import { useProgressStore } from "../../store/progressStore";

const NICKNAME_MIN_LENGTH = 2;

function validateNickname(raw: string): string | null {
  const length = Array.from(raw.trim()).length;
  if (length === 0) return "请先输入昵称";
  if (length < NICKNAME_MIN_LENGTH)
    return `昵称至少需要 ${NICKNAME_MIN_LENGTH} 个字`;
  if (length > NICKNAME_MAX_LENGTH)
    return `昵称最多 ${NICKNAME_MAX_LENGTH} 个字`;
  return null;
}

function SubmittedRank({ entryId }: { entryId: string }) {
  const rank = useEntryRank(entryId);
  let rankText = "正在计算全球排名…";
  if (rank.errorMessage) rankText = rank.errorMessage;
  else if (rank.data !== undefined && rank.data !== null)
    rankText = `全球第 ${formatNumber(rank.data)} 名`;
  else if (rank.isFetched) rankText = "暂未进入排行榜前列，再接再厉！";

  return (
    <div
      data-ocid="results.submit.success_state"
      className="animate-pop-in flex flex-col items-center gap-2 text-center"
    >
      <span className="flex items-center gap-2 font-display text-2xl font-black text-success">
        <CheckCircle2 className="size-6" aria-hidden="true" />
        提交成功！
      </span>
      <p
        aria-live="polite"
        className="font-display text-lg font-black text-foreground"
      >
        {rankText}
      </p>
      <Link
        to="/leaderboard"
        data-ocid="results.view_leaderboard.link"
        className="flex items-center gap-1.5 rounded-full border-2 border-neon px-4 py-2 text-sm font-black text-neon transition-all duration-150 hover:scale-105 hover:bg-neon hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Trophy className="size-4" aria-hidden="true" />
        查看排行榜
      </Link>
    </div>
  );
}

export function SubmitScoreForm({ run }: { run: LastRun }) {
  const savedNickname = useProgressStore((s) => s.savedNickname);
  const { setNickname, setLastRunEntryId } = useProgressActions();
  const submit = useSubmitScore();
  const [nickname, setNicknameDraft] = useState(savedNickname);
  const [touched, setTouched] = useState(false);

  const submitted = run.submittedEntryId !== null;
  const validationError = validateNickname(nickname);
  const showValidation = touched && validationError !== null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    if (validationError || submitted || submit.isPending) return;
    const clean = sanitizeNickname(nickname);
    submit.mutate(
      {
        nickname: clean,
        score: run.score,
        distance: run.distance,
        characterId: run.characterId,
        skinId: run.skinId,
      },
      {
        onSuccess: (entry) => {
          setNickname(clean);
          setLastRunEntryId(entry.id.toString());
        },
      },
    );
  };

  return (
    <section
      data-ocid="results.submit.panel"
      style={{ animationDelay: "550ms" }}
      className="panel-glass animate-slide-up rounded-3xl p-4 shadow-elevated"
    >
      <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-black">
        <Trophy className="size-5 text-primary" aria-hidden="true" />
        冲上全球排行榜
      </h2>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="results-nickname" className="text-sm font-bold">
            你的昵称（{NICKNAME_MIN_LENGTH}–{NICKNAME_MAX_LENGTH} 个字）
          </Label>
          <Input
            id="results-nickname"
            data-ocid="results.nickname.input"
            value={nickname}
            maxLength={NICKNAME_MAX_LENGTH}
            disabled={submitted || submit.isPending}
            autoComplete="nickname"
            placeholder="比如：奶家人一号"
            aria-invalid={showValidation}
            aria-describedby={
              showValidation ? "results-nickname-error" : undefined
            }
            onChange={(e) => setNicknameDraft(e.target.value)}
            onBlur={() => setTouched(true)}
            className="h-12 rounded-xl border-2 border-input bg-background/60 text-base font-bold focus-visible:border-neon"
          />
          {showValidation && (
            <p
              id="results-nickname-error"
              data-ocid="results.nickname.field_error"
              className="text-sm font-bold text-destructive"
            >
              {validationError}
            </p>
          )}
        </div>
        <button
          type="submit"
          data-ocid="results.submit.submit_button"
          disabled={submitted || submit.isPending}
          className="flex h-12 items-center justify-center gap-2 rounded-full border-[3px] border-ink bg-gradient-neon font-display text-lg font-black text-primary-foreground shadow-sticker transition-all duration-150 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:translate-y-1 active:shadow-sticker-pressed disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
        >
          {submit.isPending ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              提交中…
            </>
          ) : submitted ? (
            <>
              <CheckCircle2 className="size-5" aria-hidden="true" />
              已提交
            </>
          ) : (
            <>
              <Send className="size-5" aria-hidden="true" />
              提交到排行榜
            </>
          )}
        </button>
        {submit.isError && !submitted && (
          <p
            role="alert"
            data-ocid="results.submit.error_state"
            className="rounded-xl border-2 border-destructive/60 bg-destructive/15 px-3 py-2 text-sm font-bold text-destructive"
          >
            {submit.error.message || "提交成绩失败，请稍后再试"}
          </p>
        )}
      </form>
      {run.submittedEntryId !== null && (
        <div className="mt-4 border-t-2 border-dashed border-border pt-4">
          <SubmittedRank entryId={run.submittedEntryId} />
        </div>
      )}
    </section>
  );
}
