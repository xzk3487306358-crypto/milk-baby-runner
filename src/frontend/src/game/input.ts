import type { InputAction } from "./types";

const KEY_MAP: Record<string, InputAction> = {
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
  ArrowUp: "jump",
  KeyW: "jump",
  Space: "jump",
  ArrowDown: "roll",
  KeyS: "roll",
};

const SWIPE_MIN = 28;

interface InputHandlers {
  onAction: (action: InputAction) => void;
  onPause: () => void;
}

/** Binds keyboard on window and swipe gestures on `surface`. Returns unbind. */
export function bindInput(
  surface: HTMLElement,
  { onAction, onPause }: InputHandlers,
): () => void {
  let startX = 0;
  let startY = 0;
  let tracking = false;

  const onKey = (e: KeyboardEvent) => {
    if (e.code === "Escape" || e.code === "KeyP") {
      e.preventDefault();
      onPause();
      return;
    }
    const action = KEY_MAP[e.code];
    if (!action) return;
    e.preventDefault();
    if (!e.repeat) onAction(action);
  };

  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    tracking = true;
    startX = e.clientX;
    startY = e.clientY;
  };

  const onMove = (e: PointerEvent) => {
    if (!tracking) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) < SWIPE_MIN && Math.abs(dy) < SWIPE_MIN) return;
    tracking = false;
    if (Math.abs(dx) > Math.abs(dy)) onAction(dx < 0 ? "left" : "right");
    else onAction(dy < 0 ? "jump" : "roll");
  };

  const onUp = () => {
    tracking = false;
  };

  window.addEventListener("keydown", onKey);
  surface.addEventListener("pointerdown", onDown);
  surface.addEventListener("pointermove", onMove);
  surface.addEventListener("pointerup", onUp);
  surface.addEventListener("pointercancel", onUp);
  return () => {
    window.removeEventListener("keydown", onKey);
    surface.removeEventListener("pointerdown", onDown);
    surface.removeEventListener("pointermove", onMove);
    surface.removeEventListener("pointerup", onUp);
    surface.removeEventListener("pointercancel", onUp);
  };
}
