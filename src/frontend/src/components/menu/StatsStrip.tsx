import { Coins, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useCoins, useHighScore } from "../../hooks/useProgress";
import { formatNumber } from "../../lib/progress";

export function StatsStrip() {
  const coins = useCoins();
  const highScore = useHighScore();
  const stats = [
    {
      id: "highscore",
      label: "历史最高",
      value: formatNumber(highScore),
      icon: Trophy,
      iconClass: "bg-secondary text-secondary-foreground",
    },
    {
      id: "coins",
      label: "我的金币",
      value: formatNumber(coins),
      icon: Coins,
      iconClass: "bg-gradient-primary text-primary-foreground",
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.id}
          data-ocid={`menu.${s.id}.panel`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 + i * 0.08, duration: 0.35 }}
          className="panel-glass flex min-w-0 items-center gap-2.5 rounded-2xl px-3 py-2.5 shadow-sticker-sm"
        >
          <span
            className={`grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink ${s.iconClass}`}
          >
            <s.icon className="size-4" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-col">
            <dt className="text-xs font-bold text-muted-foreground">
              {s.label}
            </dt>
            <dd className="truncate font-mono text-lg font-bold leading-tight tabular text-foreground">
              {s.value}
            </dd>
          </div>
        </motion.div>
      ))}
    </dl>
  );
}
