import type { LeaderboardEntry } from "@/backend";
import { formatNumber } from "../../lib/progress";
import RankBadge from "./RankBadge";
import { formatSubmittedAt, getEntryLook } from "./entryDisplay";

interface ListProps {
  entries: LeaderboardEntry[];
  myEntryId: string | null;
}

function YouTag() {
  return (
    <span className="shrink-0 -rotate-3 rounded-full border-2 border-ink bg-secondary px-2 py-0.5 font-display text-xs font-black text-secondary-foreground shadow-sticker-sm">
      你
    </span>
  );
}

function Avatar({ entry, size }: { entry: LeaderboardEntry; size: string }) {
  const { character, skin } = getEntryLook(entry);
  return (
    <img
      src={skin.imagePath}
      alt={`${character.name}·${skin.name}`}
      loading="lazy"
      className={`${size} shrink-0 rounded-xl border-2 border-ink bg-muted object-cover`}
    />
  );
}

const rowBase =
  "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function LeaderboardTable({ entries, myEntryId }: ListProps) {
  return (
    <div
      data-ocid="leaderboard.table"
      className="panel-glass hidden max-h-[70vh] overflow-auto rounded-2xl shadow-elevated md:block"
    >
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">全球排行榜前 50 名</caption>
        <thead className="sticky top-0 z-10 bg-card font-display text-xs font-black text-muted-foreground">
          <tr>
            <th scope="col" className="px-3 py-3">
              排名
            </th>
            <th scope="col" className="px-3 py-3">
              玩家
            </th>
            <th scope="col" className="px-3 py-3">
              角色 / 皮肤
            </th>
            <th scope="col" className="px-3 py-3 text-right">
              分数
            </th>
            <th scope="col" className="px-3 py-3 text-right">
              距离
            </th>
            <th scope="col" className="px-3 py-3 text-right">
              日期
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const isMe =
              myEntryId !== null && entry.id.toString() === myEntryId;
            const { character, skin } = getEntryLook(entry);
            return (
              <tr
                key={entry.id.toString()}
                tabIndex={0}
                data-ocid={`leaderboard.row.${i + 1}`}
                aria-current={isMe ? "true" : undefined}
                className={`${rowBase} border-t border-border/60 hover:bg-muted/70 focus-visible:bg-muted/70 ${
                  isMe ? "bg-secondary/20 ring-2 ring-inset ring-secondary" : ""
                }`}
              >
                <td className="px-3 py-2.5">
                  <RankBadge rank={i + 1} />
                </td>
                <td className="max-w-[10rem] px-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate font-display text-base font-black">
                      {entry.nickname}
                    </span>
                    {isMe && <YouTag />}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar entry={entry} size="size-10" />
                    <div className="min-w-0 leading-tight">
                      <p className="truncate text-xs font-bold">{skin.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {character.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-base font-bold tabular text-primary">
                  {formatNumber(entry.score)}
                </td>
                <td className="px-3 py-2.5 text-right font-mono tabular text-accent">
                  {formatNumber(entry.distance)} 米
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right font-mono text-xs tabular text-muted-foreground">
                  {formatSubmittedAt(entry.submittedAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function LeaderboardCards({ entries, myEntryId }: ListProps) {
  return (
    <ol
      data-ocid="leaderboard.list"
      className="flex flex-col gap-2.5 md:hidden"
    >
      {entries.map((entry, i) => {
        const isMe = myEntryId !== null && entry.id.toString() === myEntryId;
        const { character, skin } = getEntryLook(entry);
        return (
          <li
            key={entry.id.toString()}
            data-ocid={`leaderboard.item.${i + 1}`}
            aria-current={isMe ? "true" : undefined}
            style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
            className={`${rowBase} panel-glass animate-slide-up rounded-2xl p-3 shadow-subtle hover:-translate-y-0.5 hover:border-primary focus-visible:-translate-y-0.5 motion-reduce:animate-none ${
              isMe ? "border-secondary bg-secondary/20" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <RankBadge rank={i + 1} />
              <Avatar entry={entry} size="size-12" />
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="truncate font-display text-base font-black">
                    {entry.nickname}
                  </span>
                  {isMe && <YouTag />}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {character.name} · {skin.name}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-lg font-bold leading-tight tabular text-primary">
                  {formatNumber(entry.score)}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground">
                  分
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2 font-mono text-xs tabular">
              <span className="text-accent">
                距离 {formatNumber(entry.distance)} 米
              </span>
              <span className="text-muted-foreground">
                {formatSubmittedAt(entry.submittedAt)}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
