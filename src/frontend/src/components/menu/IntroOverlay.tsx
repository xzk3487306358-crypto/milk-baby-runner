import { ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CHASER, getSkin } from "../../lib/characters";

interface IntroOverlayProps {
  onDone: () => void;
}

const BEATS = [
  {
    id: "order",
    kicker: "第一幕",
    title: "拿错外卖单啦！",
    text: "奶娃与牛来在街角误拿了美团袋鼠的外卖单，香喷喷的外卖就这么被抱走了……",
    images: [
      getSkin("naiwa-classic").imagePath,
      getSkin("niulai-classic").imagePath,
    ],
    alt: "奶娃和牛来抱着外卖",
    bubble: "嘿嘿，这是我们的吧？",
  },
  {
    id: "chase",
    kicker: "第二幕",
    title: "袋鼠骑车追来！",
    text: "美团袋鼠跨上电驴一路狂飙，怒喊：",
    images: [CHASER.imagePath],
    alt: "黄袋鼠骑手骑着电驴追来",
    bubble: "胆子真是肥嘟嘟的啊！",
  },
  {
    id: "mama",
    kicker: "第三幕",
    title: "快跑！",
    text: "牛来吓得撒腿就跑，边跑边喊：",
    images: [getSkin("niulai-classic").imagePath],
    alt: "牛来边跑边喊",
    bubble: "妈——妈——",
  },
  {
    id: "coins",
    kicker: "第四幕",
    title: "收金币赔外卖钱",
    text: "奶娃决定一路狂奔收集金币，攒够钱赔给袋鼠！霓虹夜城大逃亡，正式开始！",
    images: [getSkin("naiwa-gold").imagePath],
    alt: "闪闪发光的黄金奶娃",
    bubble: "冲鸭！金币全都要！",
  },
];

export function IntroOverlay({ onDone }: IntroOverlayProps) {
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();
  const primaryRef = useRef<HTMLButtonElement>(null);
  const beat = BEATS[step];
  const isLast = step === BEATS.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDone();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDone]);

  useEffect(() => {
    if (step >= 0) primaryRef.current?.focus();
  }, [step]);

  return (
    <motion.dialog
      open
      data-ocid="intro.dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 m-0 flex h-dvh max-h-none w-full max-w-none items-center justify-center border-0 bg-transparent p-4 text-foreground"
    >
      <div
        className="absolute inset-0 bg-ink opacity-90 backdrop-blur-md"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 speed-lines"
        aria-hidden="true"
      />
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
        className="relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl border-[3px] border-ink bg-night shadow-sticker"
      >
        <div
          className="absolute inset-0 halftone opacity-50"
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={onDone}
          data-ocid="intro.skip.cancel_button"
          className="absolute right-3 top-3 z-20 inline-flex h-11 items-center gap-1 rounded-full border-2 border-ink bg-card px-4 font-display text-sm font-black text-foreground shadow-sticker-sm transition-all duration-150 hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent active:translate-y-0.5 active:shadow-sticker-pressed"
        >
          跳过
          <X className="size-4" aria-hidden="true" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={beat.id}
            initial={{ opacity: 0, x: reduce ? 0 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduce ? 0 : -40 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-col items-center gap-3 px-5 pb-4 pt-14 text-center"
            aria-live="polite"
          >
            <span className="rounded-full border-2 border-ink bg-accent px-3 py-0.5 font-display text-xs font-black text-accent-foreground shadow-sticker-sm">
              {beat.kicker} / {BEATS.length}
            </span>
            <div className="relative flex h-44 items-end justify-center gap-1 sm:h-52">
              {beat.images.map((src, i) => (
                <motion.img
                  key={src}
                  src={src}
                  alt={i === 0 ? beat.alt : ""}
                  initial={{ opacity: 0, scale: 0.5, rotate: i === 0 ? -8 : 8 }}
                  animate={
                    reduce
                      ? { opacity: 1, scale: 1, rotate: 0 }
                      : { opacity: 1, scale: 1, rotate: 0, y: [0, -8, 0] }
                  }
                  transition={{
                    opacity: { delay: 0.1 + i * 0.12 },
                    scale: {
                      type: "spring",
                      stiffness: 320,
                      damping: 14,
                      delay: 0.1 + i * 0.12,
                    },
                    rotate: {
                      type: "spring",
                      stiffness: 320,
                      damping: 14,
                      delay: 0.1 + i * 0.12,
                    },
                    y: {
                      duration: 1.6 + i * 0.3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                  }}
                  className="h-full w-auto max-w-[48%] object-contain drop-shadow-[0_8px_0_oklch(0.12_0.04_290/0.6)]"
                />
              ))}
              <motion.span
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 12,
                  delay: 0.45,
                }}
                className="absolute -top-2 left-1/2 max-w-[90%] -translate-x-1/2 whitespace-nowrap rounded-2xl border-[3px] border-ink bg-primary px-3 py-1 font-display text-base font-black text-primary-foreground shadow-sticker-sm sm:text-lg"
              >
                {beat.bubble}
              </motion.span>
            </div>
            <h2 id="intro-title" className="text-sticker font-display text-3xl">
              {beat.title}
            </h2>
            <p className="min-h-[3rem] text-base font-semibold leading-relaxed text-foreground">
              {beat.text}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="relative flex items-center justify-between gap-3 border-t-[3px] border-ink bg-card px-5 py-4">
          <div className="flex gap-1.5" aria-hidden="true">
            {BEATS.map((b, i) => (
              <span
                key={b.id}
                className={`h-2.5 rounded-full border border-ink transition-all duration-300 ${
                  i === step ? "w-7 bg-primary" : "w-2.5 bg-muted"
                }`}
              />
            ))}
          </div>
          <button
            ref={primaryRef}
            type="button"
            onClick={isLast ? onDone : () => setStep((s) => s + 1)}
            data-ocid={
              isLast
                ? "intro.start.confirm_button"
                : "intro.next.primary_button"
            }
            className={`inline-flex h-12 items-center gap-1 rounded-full border-[3px] border-ink bg-gradient-primary px-6 font-display text-lg font-black text-primary-foreground shadow-sticker transition-all duration-150 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent active:translate-y-1 active:shadow-sticker-pressed ${
              isLast ? "animate-pulse-cta" : ""
            }`}
          >
            {isLast ? "开跑！" : "下一幕"}
            {!isLast && <ChevronRight className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </motion.div>
    </motion.dialog>
  );
}
