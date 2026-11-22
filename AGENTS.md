# Project Guidance

## User Preferences

- 以奶娃为主体，追击者为美团黄色袋鼠形象，可选角色暂为奶娃与牛来两种
- 整体体验要比地铁跑酷更炫更好：更丰富的视觉特效、道具与连击系统
- 奶娃需要多种皮肤
- 需要围绕奶娃设置背景故事，解释美团形象追奶娃的原因
- 全部界面文字使用中文
- 角色与皮肤形象为构建时生成的原创二次创作风格插画

## Accepted Requirements

- 以奶娃为主体的三车道跑酷游戏，要比地铁跑酷更好更炫
- 围绕奶娃设置背景故事，美团袋鼠形象因故事追击奶娃
- 可选角色暂为奶娃与牛来两种
- 奶娃拥有多种皮肤（六款，用游戏内金币解锁）
- 道具、连击倍率、昼夜霓虹城市场景
- 本地浏览器保存进度
- 全局昵称排行榜前 50，含示例条目
- 页面包含主菜单、游戏、结算、商店、排行榜、故事

## Verified Commands

- **typecheck**: `cd src/frontend && pnpm typecheck`
- **fix**: `cd src/frontend && pnpm fix && cd ../backend && mops check --fix`
- **build**: `cd src/backend && mops build && cd ../.. && pnpm bindgen`

## Learnings

- Routes except /play nest under a pathless shell layout route in src/frontend/src/App.tsx; /play renders without Layout chrome so the WebGL canvas fills the viewport.
- progressStore (src/frontend/src/store/progressStore.ts, localStorage key naiwa-run-progress) unlockSkin/unlockCharacter charge coins internally; never call spendCoins before them or coins are charged twice.
- savedNickname comes from useProgressStore((s) => s.savedNickname); useProgressActions does not expose it.
- Skin and Character colour field is accentColor; set per-card glow with a --glow CSS var.
- Tailwind colour tokens lack <alpha-value> except primary/secondary/accent/muted/ring, so use opacity-* layers instead of /NN modifiers; custom .bg-neon has no opacity modifier.
- Biome: use a semantic dialog element instead of role=dialog; no tabIndex on li; Tailwind keyframe animations in tailwind.config.js need motion-reduce guards.
- GamePage creates its WebGL canvas inside the effect so forceContextLoss on dispose never breaks remount or StrictMode.
- Game engine lives in src/frontend/src/game (engine.ts, spawner.ts, renderer.ts, actors.ts, dayNight.ts); combo resets only on hit, barriers are avoided by lane change only.
- Backend leaderboard: Map<Nat, LeaderboardEntry> with submitScore/getLeaderboard/getEntryRank; 8 sample entries seeded in migrations/00000000_000000.mo; OQL entity leaderboardEntry and getApiDoc in mixins/api-doc.mo.
- useLeaderboard (src/frontend/src/hooks/useLeaderboard.ts) exposes data, isLoading, errorMessage, refetch; useSubmitScore converts numbers to bigint and throws Chinese errors.
