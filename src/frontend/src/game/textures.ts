import {
  CanvasTexture,
  ClampToEdgeWrapping,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from "three";
import type { PowerUpId } from "../lib/gameConfig";

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  return { c, ctx };
}

function finish(c: HTMLCanvasElement, repeat = false): CanvasTexture {
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = repeat ? RepeatWrapping : ClampToEdgeWrapping;
  t.anisotropy = 4;
  return t;
}

const FONT = `"PingFang SC","HarmonyOS Sans SC","Microsoft YaHei","Noto Sans SC",sans-serif`;

export function roadTexture(): CanvasTexture {
  const { c, ctx } = canvas(256, 512);
  ctx.fillStyle = "#1d1433";
  ctx.fillRect(0, 0, 256, 512);
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 512, 2, 2);
  }
  ctx.fillStyle = "#22d3ee";
  for (const x of [91, 165]) {
    ctx.fillRect(x - 3, 0, 6, 220);
  }
  ctx.fillStyle = "#ff3fa4";
  ctx.fillRect(0, 0, 8, 512);
  ctx.fillRect(248, 0, 8, 512);
  return finish(c, true);
}

export function windowTexture(): CanvasTexture {
  const { c, ctx } = canvas(128, 256);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 128, 256);
  const colors = ["#ffd60a", "#22d3ee", "#ff3fa4", "#fff3c4"];
  for (let y = 8; y < 256; y += 20) {
    for (let x = 8; x < 128; x += 20) {
      if (Math.random() < 0.45) continue;
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.globalAlpha = 0.5 + Math.random() * 0.5;
      ctx.fillRect(x, y, 11, 12);
    }
  }
  ctx.globalAlpha = 1;
  return finish(c, true);
}

export function neonSignTexture(text: string, color: string): CanvasTexture {
  const { c, ctx } = canvas(512, 192);
  ctx.fillStyle = "rgba(10,4,30,0.92)";
  ctx.beginPath();
  ctx.roundRect(8, 8, 496, 176, 36);
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 24;
  ctx.stroke();
  ctx.font = `900 112px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.shadowBlur = 30;
  ctx.fillText(text, 256, 100);
  ctx.shadowBlur = 0;
  ctx.lineWidth = 3;
  ctx.strokeStyle = color;
  ctx.strokeText(text, 256, 100);
  return finish(c);
}

export function stripeTexture(a: string, b: string): CanvasTexture {
  const { c, ctx } = canvas(128, 64);
  ctx.fillStyle = a;
  ctx.fillRect(0, 0, 128, 64);
  ctx.fillStyle = b;
  for (let x = -64; x < 160; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 64);
    ctx.lineTo(x + 16, 64);
    ctx.lineTo(x + 48, 0);
    ctx.lineTo(x + 32, 0);
    ctx.fill();
  }
  return finish(c, true);
}

export function coinTexture(): CanvasTexture {
  const { c, ctx } = canvas(128, 128);
  ctx.fillStyle = "#ffcf33";
  ctx.beginPath();
  ctx.arc(64, 64, 62, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#c47a00";
  ctx.beginPath();
  ctx.arc(64, 64, 52, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = `900 64px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#7a3b00";
  ctx.fillText("奶", 64, 68);
  return finish(c);
}

const POWER_ICON: Record<PowerUpId, { glyph: string; color: string }> = {
  magnet: { glyph: "磁", color: "#22d3ee" },
  rocketShoes: { glyph: "飞", color: "#ff7a2f" },
  milkShield: { glyph: "盾", color: "#e8f4ff" },
  doubleCoins: { glyph: "×2", color: "#ffd60a" },
  naiFamilyUltimate: { glyph: "奶", color: "#ff3fa4" },
};

export function powerUpTexture(id: PowerUpId): CanvasTexture {
  const { c, ctx } = canvas(160, 160);
  const { glyph, color } = POWER_ICON[id];
  ctx.shadowColor = color;
  ctx.shadowBlur = 26;
  ctx.fillStyle = "#1a0b38";
  ctx.beginPath();
  ctx.arc(80, 80, 62, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.font = `900 ${glyph.length > 1 ? 58 : 70}px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#140630";
  ctx.strokeText(glyph, 80, 86);
  ctx.fillStyle = color;
  ctx.fillText(glyph, 80, 86);
  return finish(c);
}

export function bubbleTexture(text: string): CanvasTexture {
  const { c, ctx } = canvas(640, 220);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#140630";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.roundRect(12, 12, 616, 150, 60);
  ctx.moveTo(280, 160);
  ctx.lineTo(320, 210);
  ctx.lineTo(350, 160);
  ctx.fill();
  ctx.stroke();
  ctx.font = `900 ${text.length > 8 ? 62 : 78}px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#140630";
  ctx.fillText(text, 320, 92);
  return finish(c);
}

export function sparkTexture(): CanvasTexture {
  const { c, ctx } = canvas(64, 64);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,255,255,0.8)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return finish(c);
}

/**
 * Circular sticker badge made from a character image: white sticker rim,
 * accent ring and ink outline. Returned texture updates once the image loads.
 */
export function stickerTexture(src: string, accent: string): Texture {
  const { c, ctx } = canvas(256, 256);
  const tex = finish(c);
  const draw = (img?: HTMLImageElement) => {
    ctx.clearRect(0, 0, 256, 256);
    ctx.fillStyle = "#140630";
    ctx.beginPath();
    ctx.arc(128, 128, 126, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(128, 128, 119, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(128, 128, 110, 0, Math.PI * 2);
    ctx.fill();
    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(128, 128, 102, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, 18, 18, 220, 220);
      ctx.restore();
    }
    tex.needsUpdate = true;
  };
  draw();
  const img = new Image();
  img.onload = () => draw(img);
  img.src = src;
  return tex;
}
