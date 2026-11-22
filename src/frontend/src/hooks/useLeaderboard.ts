import { type LeaderboardEntry, createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const LEADERBOARD_KEY = ["leaderboard"] as const;

export function toChineseError(err: unknown, fallback: string): string {
  if (err instanceof Error && /[\u4e00-\u9fa5]/.test(err.message)) {
    return err.message;
  }
  if (typeof err === "string" && /[\u4e00-\u9fa5]/.test(err)) return err;
  return fallback;
}

export function useLeaderboard() {
  const { actor, isFetching } = useActor(createActor);
  const query = useQuery<LeaderboardEntry[]>({
    queryKey: LEADERBOARD_KEY,
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getLeaderboard();
      } catch (e) {
        throw new Error(toChineseError(e, "排行榜加载失败，请稍后再试"));
      }
    },
    enabled: !!actor && !isFetching,
  });
  return {
    ...query,
    isLoading: query.isLoading || !actor || isFetching,
    errorMessage: query.error
      ? toChineseError(query.error, "排行榜加载失败，请稍后再试")
      : null,
  };
}

export interface SubmitScoreInput {
  nickname: string;
  score: number;
  distance: number;
  characterId: string;
  skinId: string;
}

export function useSubmitScore() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<LeaderboardEntry, Error, SubmitScoreInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("服务器连接中，请稍后再试");
      let result: Awaited<ReturnType<typeof actor.submitScore>>;
      try {
        result = await actor.submitScore(
          input.nickname,
          BigInt(Math.max(0, Math.floor(input.score))),
          BigInt(Math.max(0, Math.floor(input.distance))),
          input.characterId,
          input.skinId,
        );
      } catch (e) {
        throw new Error(toChineseError(e, "提交成绩失败，请检查网络后重试"));
      }
      if (result.__kind__ === "err") {
        throw new Error(toChineseError(result.err, `提交失败：${result.err}`));
      }
      return result.ok;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LEADERBOARD_KEY });
      void queryClient.invalidateQueries({ queryKey: ["entryRank"] });
    },
  });
}

export function useEntryRank(id: bigint | string | null | undefined) {
  const { actor, isFetching } = useActor(createActor);
  const idStr = id === null || id === undefined ? null : id.toString();
  const query = useQuery<bigint | null>({
    queryKey: ["entryRank", idStr],
    queryFn: async () => {
      if (!actor || idStr === null) return null;
      try {
        return await actor.getEntryRank(BigInt(idStr));
      } catch (e) {
        throw new Error(toChineseError(e, "排名查询失败，请稍后再试"));
      }
    },
    enabled: !!actor && !isFetching && idStr !== null,
  });
  return {
    ...query,
    errorMessage: query.error
      ? toChineseError(query.error, "排名查询失败，请稍后再试")
      : null,
  };
}
