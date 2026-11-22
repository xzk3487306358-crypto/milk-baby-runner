import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { CaughtOverlay } from "../components/game/CaughtOverlay";
import { GameHud } from "../components/game/GameHud";
import { PauseOverlay } from "../components/game/PauseOverlay";
import {
  type BurstEvent,
  ComboBurst,
  type FlashEvent,
  type FlashKind,
  ScreenFlash,
} from "../components/game/ScreenFx";
import { TouchHint } from "../components/game/TouchHint";
import { createGame, stepGame, tuningFor } from "../game/engine";
import { EMPTY_HUD, type HudSnapshot, readHud } from "../game/hud";
import { bindInput } from "../game/input";
import { GameRenderer } from "../game/renderer";
import { type GameState, MAX_STEP } from "../game/types";
import { useEquipped, useProgressActions } from "../hooks/useProgress";

const MAX_FRAME = 0.1;
const HUD_INTERVAL = 0.1;

export default function GamePage() {
  const navigate = useNavigate();
  const { character, skin } = useEquipped();
  const { recordRun } = useProgressActions();
  const hostRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const pausedRef = useRef(false);
  const finishedRef = useRef(false);
  const counter = useRef(0);

  const [hud, setHud] = useState<HudSnapshot>(EMPTY_HUD);
  const [paused, setPaused] = useState(false);
  const [caught, setCaught] = useState(false);
  const [burst, setBurst] = useState<BurstEvent | null>(null);
  const [flash, setFlash] = useState<FlashEvent | null>(null);
  const [showHint, setShowHint] = useState(
    () => window.matchMedia("(max-width: 767px)").matches,
  );
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    document.title = "奶娃快跑 · 开跑";
  }, []);

  useEffect(() => {
    if (!showHint) return;
    const id = window.setTimeout(() => setShowHint(false), 4000);
    return () => window.clearTimeout(id);
  }, [showHint]);

  const setPausedBoth = useCallback((value: boolean) => {
    pausedRef.current = value;
    setPaused(value);
  }, []);

  const togglePause = useCallback(() => {
    if (stateRef.current?.status !== "running") return;
    setPausedBoth(!pausedRef.current);
  }, [setPausedBoth]);

  const finishRun = useCallback(
    (s: GameState) => {
      recordRun({
        score: Math.floor(s.score),
        distance: Math.floor(s.distance),
        coinsEarned: s.coins,
        maxCombo: s.maxCombo,
        characterId: character.id,
        skinId: skin.id,
      });
      void navigate({ to: "/results" });
    },
    [recordRun, navigate, character.id, skin.id],
  );
  const finishRef = useRef(finishRun);
  finishRef.current = finishRun;

  const onEvents = useCallback((s: GameState) => {
    const fire = (kind: FlashKind) => {
      counter.current += 1;
      setFlash({ key: counter.current, kind });
    };
    for (const e of s.events) {
      if (e.kind === "comboTier") {
        counter.current += 1;
        setBurst({ key: counter.current, multiplier: e.multiplier });
      } else if (e.kind === "powerUp") fire(e.id);
      else if (e.kind === "hit") fire("hit");
      else if (e.kind === "shieldBreak") fire("shield");
      else if (e.kind === "caught") setCaught(true);
    }
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 block h-full w-full";
    canvas.setAttribute("aria-label", "奶娃快跑游戏画面");
    canvas.dataset.ocid = "game.canvas_target";
    host.prepend(canvas);

    let renderer: GameRenderer;
    try {
      renderer = new GameRenderer(canvas, character, skin);
    } catch {
      canvas.remove();
      setWebglError(true);
      return;
    }
    const tuning = tuningFor(character);
    stateRef.current = createGame(tuning);
    finishedRef.current = false;

    const resize = () => renderer.resize(host.clientWidth, host.clientHeight);
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const unbind = bindInput(host, {
      onAction: (a) => {
        const s = stateRef.current;
        if (!s || pausedRef.current || s.status !== "running") return;
        s.queue.push(a);
        setShowHint(false);
      },
      onPause: () => {
        if (stateRef.current?.status !== "running") return;
        pausedRef.current = !pausedRef.current;
        setPaused(pausedRef.current);
      },
    });

    const onVisibility = () => {
      if (document.hidden && stateRef.current?.status === "running") {
        pausedRef.current = true;
        setPaused(true);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    let raf = 0;
    let last = performance.now();
    let hudClock = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(MAX_FRAME, (now - last) / 1000);
      last = now;
      const s = stateRef.current;
      if (!s || pausedRef.current) return;
      let remaining = dt;
      while (remaining > 1e-4) {
        const step = Math.min(MAX_STEP, remaining);
        remaining -= step;
        stepGame(s, step);
        if (s.events.length > 0) {
          renderer.consumeEvents(s);
          onEvents(s);
        }
      }
      renderer.render(s, dt);
      hudClock += dt;
      if (hudClock >= HUD_INTERVAL) {
        hudClock = 0;
        setHud(readHud(s));
      }
      if (s.status === "over" && !finishedRef.current) {
        finishedRef.current = true;
        finishRef.current(s);
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      unbind();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.dispose();
      canvas.remove();
    };
  }, [character, skin, onEvents]);

  const restart = useCallback(() => {
    stateRef.current = createGame(tuningFor(character));
    finishedRef.current = false;
    setHud(EMPTY_HUD);
    setBurst(null);
    setFlash(null);
    setCaught(false);
    setPausedBoth(false);
  }, [character, setPausedBoth]);

  const toMenu = useCallback(() => {
    void navigate({ to: "/" });
  }, [navigate]);

  return (
    <section
      data-ocid="game.page"
      className="relative h-dvh w-full touch-none select-none overflow-hidden bg-night"
    >
      <div ref={hostRef} className="absolute inset-0" />
      {webglError ? (
        <div
          data-ocid="game.error_state"
          className="absolute inset-0 grid place-items-center p-6 text-center"
        >
          <div className="panel-glass max-w-sm rounded-3xl p-6">
            <h1 className="text-sticker font-display text-4xl">画面加载失败</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              你的浏览器暂不支持 WebGL，换个浏览器再来追风吧。
            </p>
            <button
              type="button"
              data-ocid="game.error.menu_button"
              onClick={toMenu}
              className="mt-5 h-12 w-full rounded-full border-[3px] border-ink bg-gradient-primary font-display text-lg font-black text-primary-foreground shadow-sticker"
            >
              返回主菜单
            </button>
          </div>
        </div>
      ) : (
        <>
          <GameHud hud={hud} onPause={togglePause} canPause={!caught} />
          <ComboBurst burst={burst} />
          <ScreenFlash flash={flash} />
          {showHint && !paused && <TouchHint />}
          {caught && <CaughtOverlay runnerImage={skin.imagePath} />}
          {paused && (
            <PauseOverlay
              onResume={() => setPausedBoth(false)}
              onRestart={restart}
              onMenu={toMenu}
            />
          )}
        </>
      )}
    </section>
  );
}
