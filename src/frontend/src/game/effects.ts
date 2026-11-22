import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  type Color,
  LineBasicMaterial,
  LineSegments,
  Points,
  PointsMaterial,
  type Texture,
} from "three";

const HIDDEN = -999;

/** Pooled burst particles (coin sparkles, power-up bursts, smash debris). */
export class Sparkles {
  readonly points: Points;
  private readonly pos: Float32Array;
  private readonly col: Float32Array;
  private readonly vel: Float32Array;
  private readonly life: Float32Array;
  private cursor = 0;

  constructor(
    private readonly count: number,
    tex: Texture,
  ) {
    this.pos = new Float32Array(count * 3).fill(HIDDEN);
    this.col = new Float32Array(count * 3);
    this.vel = new Float32Array(count * 3);
    this.life = new Float32Array(count);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(this.pos, 3));
    geo.setAttribute("color", new BufferAttribute(this.col, 3));
    const mat = new PointsMaterial({
      size: 0.42,
      map: tex,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    this.points = new Points(geo, mat);
    this.points.frustumCulled = false;
  }

  emit(x: number, y: number, z: number, n: number, color: Color, power = 5) {
    for (let k = 0; k < n; k++) {
      const i = this.cursor;
      this.cursor = (this.cursor + 1) % this.count;
      const a = Math.random() * Math.PI * 2;
      const u = Math.random() * 2 - 1;
      const s = power * (0.4 + Math.random() * 0.6);
      const r = Math.sqrt(1 - u * u);
      this.pos[i * 3] = x;
      this.pos[i * 3 + 1] = y;
      this.pos[i * 3 + 2] = z;
      this.vel[i * 3] = Math.cos(a) * r * s;
      this.vel[i * 3 + 1] = Math.abs(u) * s + 1.5;
      this.vel[i * 3 + 2] = Math.sin(a) * r * s;
      this.col[i * 3] = color.r;
      this.col[i * 3 + 1] = color.g;
      this.col[i * 3 + 2] = color.b;
      this.life[i] = 0.5 + Math.random() * 0.4;
    }
  }

  update(dt: number, scroll: number) {
    for (let i = 0; i < this.count; i++) {
      if (this.life[i] <= 0) continue;
      this.life[i] -= dt;
      if (this.life[i] <= 0) {
        this.pos[i * 3 + 1] = HIDDEN;
        continue;
      }
      this.vel[i * 3 + 1] -= 9 * dt;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += (this.vel[i * 3 + 2] + scroll) * dt;
      const fade = Math.min(1, this.life[i] * 2.5);
      this.col[i * 3] *= 0.985 + 0.015 * fade;
    }
    const geo = this.points.geometry;
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  }
}

/** Light drifting particle weather (glitter / drizzle) around the camera. */
export class Weather {
  readonly points: Points;
  private readonly pos: Float32Array;
  readonly material: PointsMaterial;

  constructor(
    private readonly count: number,
    tex: Texture,
  ) {
    this.pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      this.pos[i * 3] = (Math.random() - 0.5) * 40;
      this.pos[i * 3 + 1] = Math.random() * 18;
      this.pos[i * 3 + 2] = -Math.random() * 90 + 10;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(this.pos, 3));
    this.material = new PointsMaterial({
      size: 0.16,
      map: tex,
      color: "#ffffff",
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    this.points = new Points(geo, this.material);
    this.points.frustumCulled = false;
  }

  update(dt: number, speed: number, time: number) {
    const fall = 2.4 * dt;
    const scroll = speed * 0.55 * dt;
    for (let i = 0; i < this.count; i++) {
      const j = i * 3;
      this.pos[j] += Math.sin(time * 0.7 + i) * 0.6 * dt;
      this.pos[j + 1] -= fall;
      this.pos[j + 2] += scroll;
      if (this.pos[j + 1] < 0) this.pos[j + 1] += 18;
      if (this.pos[j + 2] > 10) this.pos[j + 2] -= 100;
    }
    this.points.geometry.attributes.position.needsUpdate = true;
  }
}

/** Streaking speed lines that trail past the runner. */
export class SpeedLines {
  readonly lines: LineSegments;
  readonly material: LineBasicMaterial;
  private readonly pos: Float32Array;
  private readonly seed: Float32Array;

  constructor(private readonly count: number) {
    this.pos = new Float32Array(count * 6);
    this.seed = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      this.seed[i * 3] = side * (1.2 + Math.random() * 4.5);
      this.seed[i * 3 + 1] = 0.3 + Math.random() * 3.8;
      this.seed[i * 3 + 2] = -Math.random() * 40;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(this.pos, 3));
    this.material = new LineBasicMaterial({
      color: "#e8f8ff",
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    this.lines = new LineSegments(geo, this.material);
    this.lines.frustumCulled = false;
  }

  update(dt: number, speed: number, runnerX: number, boost: boolean) {
    const len = 0.6 + speed * 0.09 * (boost ? 2 : 1);
    const v = speed * (boost ? 2.6 : 1.7) * dt;
    for (let i = 0; i < this.count; i++) {
      const s = i * 3;
      this.seed[s + 2] += v;
      if (this.seed[s + 2] > 7) this.seed[s + 2] -= 45;
      const p = i * 6;
      const x = this.seed[s] + runnerX;
      this.pos[p] = x;
      this.pos[p + 1] = this.seed[s + 1];
      this.pos[p + 2] = this.seed[s + 2];
      this.pos[p + 3] = x;
      this.pos[p + 4] = this.seed[s + 1];
      this.pos[p + 5] = this.seed[s + 2] - len;
    }
    this.lines.geometry.attributes.position.needsUpdate = true;
    const intensity = Math.min(1, (speed - 12) / 30);
    this.material.opacity = boost ? 0.9 : 0.12 + intensity * 0.55;
  }
}
