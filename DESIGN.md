# Design Brief

## Direction

霓虹贴纸街机 (Neon Sticker Arcade) — 黄色梗三角色在深紫霓虹夜城狂奔，漫画贴纸质感的高能街机 UI。

## Tone

Maximalist playful arcade: chunky sticker shapes, ink outlines, offset shadows, neon city glow — louder and flashier than Subway Surfers.

## Differentiation

Every title and CTA is a "sticker": yellow fill + thick ink stroke + magenta offset (`.text-sticker`, `shadow-sticker`), over a halftone/speed-line neon night.

## Color Palette

| Token       | OKLCH          | Role                                         |
| ----------- | -------------- | -------------------------------------------- |
| background  | 0.17 0.06 290  | deep indigo night                            |
| foreground  | 0.97 0.02 95   | warm white text                              |
| card        | 0.23 0.08 292  | panels / HUD pills (use `.panel-glass`)      |
| primary     | 0.87 0.18 95   | 美团黄 — CTA, titles, coins, characters pop    |
| secondary   | 0.66 0.27 350  | neon magenta — offsets, combo, danger-ish fun |
| accent      | 0.84 0.15 200  | electric cyan — lane lines, active, power-ups |
| neon        | 0.62 0.26 300  | electric purple — panel borders/frames        |
| ink         | 0.12 0.04 290  | outlines and sticker shadows                 |
| muted       | 0.28 0.07 292  | inactive tiles, locked skins                 |
| success / warning / destructive | 0.82 0.2 145 / 0.78 0.17 60 / 0.64 0.24 25 | unlocked / chase-close / game over |

## Typography

- Display: Nunito 900 (+ PingFang SC / Microsoft YaHei / Noto Sans SC fallback for 中文) — logo, titles, CTA, combo
- Body: Nunito 600–800 (same CJK fallback) — labels, story text
- Mono: Geist Mono `.tabular` — score, distance, coins, leaderboard ranks
- Scale: hero `text-6xl md:text-8xl font-black text-sticker`, h2 `text-3xl md:text-5xl font-black`, label `text-xs font-extrabold tracking-widest`, body `text-base font-semibold`

## Elevation & Depth

Flat sticker depth: solid ink offset shadows (`shadow-sticker`, `-sm`, `-pressed`) for buttons; `shadow-elevated` + `.panel-glass` blur for floating panels; no soft glow shadows.

## Structural Zones

| Zone        | Background                         | Border                     | Notes                                      |
| ----------- | ---------------------------------- | -------------------------- | ------------------------------------------ |
| Top HUD     | `.panel-glass` pills, rounded-full | 2px neon/70                | coins (yellow icon) + 历史最高, gear buttons |
| Content     | `.bg-night` + `.halftone` overlay  | —                          | title, character showcase, CTA centered    |
| Bottom nav  | 3 equal `.panel-glass` tiles       | 2px neon; active = accent  | 皮肤商店 / 排行榜 / 故事, rounded-2xl        |
| Game canvas | full-bleed canvas                  | —                          | HUD overlay pills top; chase meter bar     |
| Modals      | `bg-card` rounded-3xl              | 3px ink + `shadow-sticker` | 结算 / 暂停 / 解锁                          |

## Spacing & Rhythm

Mobile-first portrait column, max-w-md centered on desktop with neon backdrop filling sides; gaps 12/16/24px; thumb-zone CTA in lower third.

## Component Patterns

- Buttons: primary = `rounded-full bg-gradient-primary text-primary-foreground border-[3px] border-ink shadow-sticker font-black`, press → `translate-y-1 shadow-sticker-pressed`; secondary = magenta same shape
- Cards: `rounded-2xl panel-glass`; skin cards show 锁 overlay on `bg-muted`, equipped = accent border
- Badges: `rounded-full` pills, ink border, yellow/magenta/cyan fills; combo `x2…x8` in magenta sticker text

## Motion

- Entrance: `animate-pop-in` for titles/modals, `animate-slide-up` staggered 60ms for tiles/rows
- Hover/press: scale 1.04 + sticker shadow collapse, 150ms
- Decorative: `animate-float` characters, `animate-pulse-cta` on 开始奔跑, `animate-shake` on hit, `animate-combo-burst` on combo up

## Constraints

- All UI copy in Simplified Chinese; numbers in Geist Mono tabular
- Yellow characters must sit on dark backgrounds — never yellow-on-light
- Canvas may use literal OKLCH/hex; DOM uses tokens only
- No original copyrighted character images — original illustrations only

## Signature Detail

Sticker-bomb typography: ink-stroked yellow letters with magenta offset drop, like a meme sticker slapped onto a neon street.
