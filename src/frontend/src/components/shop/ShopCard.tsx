import { Check, Coins, Lock, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { type CSSProperties, useState } from "react";
import { formatNumber } from "../../lib/progress";
import { ConfettiBurst } from "./ConfettiBurst";
import { type ItemStatus, type ShopItem, useShopItem } from "./shopModel";

function PriceTag({ price }: { price: number }) {
  if (price === 0)
    return (
      <span className="font-display text-sm font-black text-success">免费</span>
    );
  return (
    <span className="inline-flex items-center gap-1 font-mono text-sm font-bold tabular text-primary">
      <span className="grid size-5 place-items-center rounded-full border-2 border-ink bg-gradient-primary text-primary-foreground">
        <Coins className="size-3" aria-hidden="true" />
      </span>
      {formatNumber(price)}
      <span className="sr-only">金币</span>
    </span>
  );
}

function StatusBadge({ status, price }: { status: ItemStatus; price: number }) {
  const base =
    "absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full border-2 border-ink px-2 py-0.5 font-display text-xs font-black shadow-sticker-sm";
  if (status.state === "equipped")
    return (
      <span className={`${base} bg-success text-primary-foreground`}>
        <Check className="size-3" aria-hidden="true" />
        已装备
      </span>
    );
  if (status.state === "owned")
    return (
      <span className={`${base} bg-neon text-primary-foreground`}>已拥有</span>
    );
  return (
    <span className={`${base} bg-card text-primary`}>
      <Coins className="size-3" aria-hidden="true" />
      {price === 0 ? "免费" : formatNumber(price)}
    </span>
  );
}

const BTN =
  "relative mt-auto flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full border-[3px] border-ink px-3 font-display text-sm font-black transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed";

interface ShopCardProps {
  item: ShopItem;
  index: number;
  section: string;
}

export function ShopCard({ item, index, section }: ShopCardProps) {
  const { view, equip, unlock } = useShopItem(item);
  const [burst, setBurst] = useState(0);
  const reduce = useReducedMotion();
  const { status } = view;
  const isEquipped = status.state === "equipped";
  const ocid = `shop.${section}`;

  const handleUnlock = () => {
    if (unlock()) setBurst((n) => n + 1);
  };

  return (
    <motion.article
      data-ocid={`${ocid}.item.${index}`}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      style={{ "--glow": view.accent } as CSSProperties}
      className={`group relative flex min-w-0 flex-col gap-2 rounded-2xl border-[3px] bg-card p-2.5 transition-transform duration-200 focus-within:-translate-y-1 hover:-translate-y-1 hover:shadow-[0_0_28px_-4px_var(--glow)] focus-within:shadow-[0_0_28px_-4px_var(--glow)] ${
        isEquipped
          ? "border-[var(--glow)] shadow-[0_0_24px_-6px_var(--glow)]"
          : "border-ink shadow-sticker"
      }`}
    >
      {burst > 0 && <ConfettiBurst key={burst} />}
      <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-ink bg-night">
        <div
          className="absolute inset-0 opacity-50 transition-opacity duration-200 group-hover:opacity-80 bg-[radial-gradient(circle_at_50%_60%,var(--glow),transparent_65%)]"
          aria-hidden="true"
        />
        <StatusBadge status={status} price={view.price} />
        <motion.img
          key={burst}
          src={view.imagePath}
          alt={`${view.name} 预览`}
          loading="lazy"
          initial={burst > 0 && !reduce ? { scale: 0.6, rotate: -8 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 14 }}
          className={`relative size-full object-contain p-1 transition-transform duration-300 group-hover:scale-105 ${
            status.state === "locked" ? "grayscale opacity-60" : ""
          }`}
        />
      </div>
      <div className="flex min-w-0 items-start justify-between gap-2">
        <h3 className="min-w-0 truncate font-display text-base font-black sm:text-lg">
          {view.name}
        </h3>
        <PriceTag price={view.price} />
      </div>
      <p className="line-clamp-2 min-h-[2.5rem] text-xs font-semibold leading-5 text-muted-foreground">
        {view.description}
      </p>

      {status.state === "equipped" && (
        <button
          type="button"
          disabled
          data-ocid={`${ocid}.equipped_button.${index}`}
          className={`${BTN} bg-success/20 text-success`}
        >
          <Check className="size-4" aria-hidden="true" />
          已装备
        </button>
      )}
      {status.state === "owned" && (
        <button
          type="button"
          onClick={equip}
          data-ocid={`${ocid}.equip_button.${index}`}
          className={`${BTN} bg-neon text-primary-foreground shadow-sticker-sm hover:scale-[1.03] active:translate-y-0.5 active:shadow-sticker-pressed`}
        >
          装备
        </button>
      )}
      {status.state === "affordable" && (
        <button
          type="button"
          onClick={handleUnlock}
          data-ocid={`${ocid}.unlock_button.${index}`}
          className={`${BTN} animate-pulse-cta bg-gradient-primary text-primary-foreground shadow-sticker-sm hover:scale-[1.03] active:translate-y-0.5 active:shadow-sticker-pressed`}
        >
          <Sparkles className="size-4" aria-hidden="true" />
          解锁
        </button>
      )}
      {status.state === "short" && (
        <button
          type="button"
          disabled
          data-ocid={`${ocid}.short_button.${index}`}
          className={`${BTN} bg-muted text-muted-foreground`}
        >
          <Lock className="size-4" aria-hidden="true" />
          还差 {formatNumber(status.shortfall)} 金币
        </button>
      )}
      {status.state === "locked" && (
        <button
          type="button"
          disabled
          data-ocid={`${ocid}.locked_button.${index}`}
          className={`${BTN} bg-muted text-muted-foreground`}
        >
          <Lock className="size-4" aria-hidden="true" />
          {status.reason}
        </button>
      )}
    </motion.article>
  );
}
