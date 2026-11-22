import {
  ACESFilmicToneMapping,
  BackSide,
  BoxGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  InstancedMesh,
  type Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  type Sprite,
  type SpriteMaterial,
  type Texture,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import type { Character, Skin } from "../lib/characters";
import {
  type ObstacleTypeId,
  POWER_UP_IDS,
  type PowerUpId,
  SPEED,
} from "../lib/gameConfig";
import { Actors } from "./actors";
import { City } from "./city";
import { createAtmosphere, sampleAtmosphere } from "./dayNight";
import { Sparkles, SpeedLines, Weather } from "./effects";
import { isFlying } from "./engine";
import {
  glow,
  makeBarrier,
  makeHighBar,
  makeLowRail,
  makeScooter,
  sprite,
  std,
} from "./meshes";
import { laneX } from "./spawner";
import {
  coinTexture,
  powerUpTexture,
  roadTexture,
  sparkTexture,
  stripeTexture,
} from "./textures";
import { COIN_POOL, type GameState, LANE_WIDTH, POWERUP_POOL } from "./types";

const ROAD_LEN = 230;
const ROAD_W = LANE_WIDTH * 3 + 1.2;

const POWER_COLORS: Record<PowerUpId, Color> = {
  magnet: new Color("#22d3ee"),
  rocketShoes: new Color("#ff7a2f"),
  milkShield: new Color("#cfeeff"),
  doubleCoins: new Color("#ffd60a"),
  naiFamilyUltimate: new Color("#ff3fa4"),
};
const GOLD = new Color("#ffd60a");
const PINK = new Color("#ff3fa4");
const RED = new Color("#ff3344");
const WHITE = new Color("#ffffff");

interface Pool {
  items: Group[];
  used: number;
}

interface PowerSlot {
  group: Group;
  icon: Sprite;
  ring: Mesh;
  ringMat: MeshStandardMaterial;
}

export class GameRenderer {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera: PerspectiveCamera;
  private readonly sky: ShaderMaterial;
  private readonly hemi: HemisphereLight;
  private readonly sun: DirectionalLight;
  private readonly fog: Fog;
  private readonly roadTex: Texture;
  private readonly city: City;
  private readonly actors: Actors;
  private readonly pools: Record<ObstacleTypeId, Pool>;
  private readonly poolList: Pool[];
  private readonly coins: InstancedMesh;
  private readonly power: PowerSlot[] = [];
  private readonly powerMats: Record<PowerUpId, SpriteMaterial>;
  private readonly sparkles: Sparkles;
  private readonly weather: Weather;
  private readonly speedLines: SpeedLines;
  private readonly atmo = createAtmosphere();
  private readonly dummy = new Object3D();
  private readonly look = new Vector3();
  private readonly textures: Texture[] = [];
  private time = 0;

  constructor(canvas: HTMLCanvasElement, character: Character, skin: Skin) {
    const mobile = window.innerWidth < 768;
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: !mobile,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, mobile ? 1.5 : 2),
    );
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.camera = new PerspectiveCamera(62, 1, 0.1, 420);

    this.sky = new ShaderMaterial({
      side: BackSide,
      depthWrite: false,
      uniforms: { top: { value: new Color() }, bottom: { value: new Color() } },
      vertexShader:
        "varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader:
        "uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ float h = clamp(normalize(vP).y * 2.2 + 0.08, 0.0, 1.0); gl_FragColor = vec4(mix(bottom, top, h), 1.0); \n#include <colorspace_fragment>\n }",
    });
    this.scene.add(new Mesh(new SphereGeometry(360, 24, 12), this.sky));

    this.fog = new Fog("#2a1250", 40, 175);
    this.scene.fog = this.fog;
    this.hemi = new HemisphereLight("#ffffff", "#4a2a7a", 1);
    this.sun = new DirectionalLight("#ffffff", 1);
    this.sun.position.set(-6, 14, 8);
    this.scene.add(this.hemi, this.sun);

    this.roadTex = roadTexture();
    this.roadTex.repeat.set(1, ROAD_LEN / 8);
    const stripes = stripeTexture("#ff7a1a", "#fff4e0");
    const railStripes = stripeTexture("#ff2a55", "#ffffff");
    const spark = sparkTexture();
    const coinTex = coinTexture();
    this.textures.push(this.roadTex, stripes, railStripes, spark, coinTex);
    this.buildGround();

    this.city = new City(this.scene);
    this.actors = new Actors(this.scene, character, skin);

    const pool = (n: number, make: () => Group): Pool => {
      const items = Array.from({ length: n }, make);
      for (const g of items) {
        g.visible = false;
        this.scene.add(g);
      }
      return { items, used: 0 };
    };
    this.pools = {
      deliveryBike: pool(8, () => makeScooter("#2dd4bf", "#38bdf8")),
      barrier: pool(14, () => makeBarrier(stripes)),
      lowRail: pool(12, () => makeLowRail(railStripes)),
      highBar: pool(12, makeHighBar),
      roadblockRow: pool(5, () => {
        const g = new Group();
        for (let l = 0; l < 3; l++) {
          const b = makeBarrier(stripes);
          b.position.x = laneX(l);
          g.add(b);
        }
        return g;
      }),
    };
    this.poolList = Object.values(this.pools);

    const coinGeo = new CylinderGeometry(0.4, 0.4, 0.1, 20).rotateX(
      Math.PI / 2,
    );
    const rim = std("#e0a000", "#ffb800", 0.6);
    const face = new MeshStandardMaterial({
      map: coinTex,
      emissive: new Color("#ffcf33"),
      emissiveMap: coinTex,
      emissiveIntensity: 0.55,
      metalness: 0.3,
      roughness: 0.35,
    });
    this.coins = new InstancedMesh(coinGeo, [rim, face, face], COIN_POOL);
    this.coins.frustumCulled = false;
    this.scene.add(this.coins);

    const iconTex = {} as Record<PowerUpId, Texture>;
    for (const id of POWER_UP_IDS) iconTex[id] = powerUpTexture(id);
    this.textures.push(...Object.values(iconTex));
    const ringGeo = new TorusGeometry(0.85, 0.07, 8, 32);
    for (let i = 0; i < POWERUP_POOL; i++) {
      const group = new Group();
      const icon = sprite(iconTex.magnet, 1.3);
      const ringMat = std("#ffffff", "#ffffff", 2);
      const ring = new Mesh(ringGeo, ringMat);
      group.add(icon, ring);
      group.visible = false;
      this.scene.add(group);
      this.power.push({ group, icon, ring, ringMat });
    }
    this.powerMats = {} as Record<PowerUpId, SpriteMaterial>;
    for (const id of POWER_UP_IDS) {
      const m = this.power[0].icon.material.clone();
      m.map = iconTex[id];
      this.powerMats[id] = m;
    }

    this.sparkles = new Sparkles(260, spark);
    this.weather = new Weather(420, spark);
    this.speedLines = new SpeedLines(42);
    this.scene.add(
      this.sparkles.points,
      this.weather.points,
      this.speedLines.lines,
    );
  }

  private buildGround() {
    const road = new Mesh(
      new PlaneGeometry(ROAD_W, ROAD_LEN).rotateX(-Math.PI / 2),
      new MeshStandardMaterial({
        map: this.roadTex,
        emissive: new Color("#ffffff"),
        emissiveMap: this.roadTex,
        emissiveIntensity: 0.5,
        roughness: 0.7,
      }),
    );
    road.position.z = -ROAD_LEN / 2 + 12;
    const walkMat = std("#2a1d4d");
    const ground = new Mesh(
      new PlaneGeometry(80, ROAD_LEN).rotateX(-Math.PI / 2),
      std("#140b2a"),
    );
    ground.position.set(0, -0.05, road.position.z);
    this.scene.add(road, ground);
    const edgeGeo = new BoxGeometry(0.18, 0.18, ROAD_LEN);
    for (const side of [-1, 1]) {
      const walk = new Mesh(new BoxGeometry(3.2, 0.3, ROAD_LEN), walkMat);
      walk.position.set(side * (ROAD_W / 2 + 1.6), 0.15, road.position.z);
      const edge = new Mesh(
        edgeGeo,
        glow(side < 0 ? "#ff3fa4" : "#22d3ee", 0.95),
      );
      edge.position.set(side * (ROAD_W / 2 + 0.05), 0.32, road.position.z);
      this.scene.add(walk, edge);
    }
  }

  resize(w: number, h: number) {
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / Math.max(1, h);
    this.camera.updateProjectionMatrix();
  }

  /** Spawns particle effects for the events emitted this step. */
  consumeEvents(s: GameState) {
    const r = s.runner;
    for (const e of s.events) {
      if (e.kind === "coin")
        this.sparkles.emit(e.x, e.y, 0, 9, e.double ? PINK : GOLD, 4);
      else if (e.kind === "powerUp")
        this.sparkles.emit(r.x, r.y + 1.2, 0, 60, POWER_COLORS[e.id], 9);
      else if (e.kind === "shieldBreak")
        this.sparkles.emit(r.x, r.y + 1.2, 0, 55, POWER_COLORS.milkShield, 10);
      else if (e.kind === "hit" || e.kind === "caught")
        this.sparkles.emit(r.x, r.y + 1, -0.6, 40, RED, 8);
      else if (e.kind === "nearMiss")
        this.sparkles.emit(r.x, r.y + 1, -0.4, 6, WHITE, 3);
      else if (e.kind === "ultimateClear") {
        for (let i = 0; i < 6; i++)
          this.sparkles.emit(
            laneX(i % 3),
            1.5,
            -8 - i * 9,
            22,
            i % 2 ? GOLD : PINK,
            11,
          );
      }
    }
  }

  render(s: GameState, dt: number) {
    this.time += dt;
    const t = this.time;
    const running = s.status === "running";
    const worldDt = running ? dt : 0;
    const r = s.runner;

    sampleAtmosphere(s.distance, this.atmo);
    const a = this.atmo;
    this.sky.uniforms.top.value.copy(a.skyTop);
    this.sky.uniforms.bottom.value.copy(a.skyBottom);
    this.fog.color.copy(a.fog);
    this.fog.near = a.fogNear;
    this.hemi.intensity = a.ambient;
    this.sun.intensity = a.sun;

    this.roadTex.offset.y = (s.distance / 8) % 1;
    this.city.update(s.distance, worldDt, t, a.neon);
    this.actors.update(s, t);
    this.renderObstacles(s, t);
    this.renderCoins(s, t);
    this.renderPowerUps(s, t);

    const ult = s.active.naiFamilyUltimate > 0;
    this.sparkles.update(dt, running ? s.speed * 0.6 : 0);
    this.weather.update(dt, running ? s.speed : 0, t);
    this.weather.material.opacity = 0.35 + a.neon * 0.2;
    this.speedLines.update(
      worldDt,
      running ? s.speed : 0,
      r.x,
      ult || isFlying(s),
    );
    this.updateCamera(s, dt);
    this.renderer.render(this.scene, this.camera);
  }

  private renderObstacles(s: GameState, t: number) {
    for (const p of this.poolList) p.used = 0;
    for (const o of s.obstacles) {
      if (!o.active) continue;
      const pool = this.pools[o.type];
      const g = pool.items[pool.used];
      if (!g) continue;
      pool.used++;
      if (o.cleared && o.clearedT > 0.7) {
        g.visible = false;
        continue;
      }
      g.visible = true;
      const x = o.type === "roadblockRow" ? 0 : laneX(o.lane);
      const ct = o.cleared ? o.clearedT : 0;
      g.position.set(
        x + ct * (o.lane - 1 || 1) * 10,
        ct * ct * 30,
        -(o.at - s.distance),
      );
      g.rotation.set(ct * 9, 0, ct * 6);
      if (o.type === "roadblockRow") {
        for (let l = 0; l < 3; l++) g.children[l].visible = l !== o.openLane;
      }
      if (o.type === "barrier") {
        const on = Math.sin(t * 10 + o.at) > 0;
        for (const c of g.children) if (c.name === "lamp") c.visible = on;
      }
    }
    for (const p of this.poolList) {
      for (let i = p.used; i < p.items.length; i++) p.items[i].visible = false;
    }
  }

  private renderCoins(s: GameState, t: number) {
    const d = this.dummy;
    for (let i = 0; i < s.coinPool.length; i++) {
      const c = s.coinPool[i];
      if (c.active) {
        d.position.set(
          c.x,
          c.y + Math.sin(t * 4 + c.at) * 0.08,
          -(c.at - s.distance),
        );
        d.rotation.set(0, t * 4 + c.at * 0.3, 0);
        d.scale.setScalar(1);
      } else {
        d.position.set(0, -50, 0);
        d.scale.setScalar(0);
      }
      d.updateMatrix();
      this.coins.setMatrixAt(i, d.matrix);
    }
    this.coins.instanceMatrix.needsUpdate = true;
  }

  private renderPowerUps(s: GameState, t: number) {
    for (let i = 0; i < this.power.length; i++) {
      const slot = this.power[i];
      const p = s.powerUps[i];
      slot.group.visible = p.active;
      if (!p.active) continue;
      slot.group.position.set(
        laneX(p.lane),
        p.y + Math.sin(t * 3) * 0.2,
        -(p.at - s.distance),
      );
      slot.icon.material = this.powerMats[p.id];
      slot.ringMat.color.copy(POWER_COLORS[p.id]);
      slot.ringMat.emissive.copy(POWER_COLORS[p.id]);
      slot.ring.rotation.y = t * 3;
      slot.ring.scale.setScalar(1 + Math.sin(t * 6) * 0.08);
    }
  }

  private updateCamera(s: GameState, dt: number) {
    const r = s.runner;
    const cam = this.camera;
    const k = Math.min(1, dt * 6);
    const caught = s.status !== "running";
    const ct = caught ? Math.min(1, s.caughtTimer * 1.6) : 0;
    const tx = r.x * 0.55 + ct * 2.6;
    const ty = 3.3 + r.y * 0.45 - ct * 1.2;
    const tz = 6.5 - ct * 2.8;
    cam.position.x += (tx - cam.position.x) * k;
    cam.position.y += (ty - cam.position.y) * k;
    cam.position.z += (tz - cam.position.z) * k;
    const shake = s.shake * s.shake * 0.5;
    if (shake > 0) {
      cam.position.x += Math.sin(this.time * 61) * shake;
      cam.position.y += Math.cos(this.time * 47) * shake;
    }
    this.look.set(
      r.x * 0.7 + ct * 0.6,
      1.4 + r.y * 0.5,
      caught ? 1.2 * ct - 8 * (1 - ct) : -8,
    );
    cam.lookAt(this.look);
    const speedT = (s.speed - SPEED.base) / (SPEED.max - SPEED.base);
    const fov =
      60 + speedT * 12 + (s.active.naiFamilyUltimate > 0 ? 8 : 0) - ct * 14;
    if (Math.abs(cam.fov - fov) > 0.05) {
      cam.fov += (fov - cam.fov) * k;
      cam.updateProjectionMatrix();
    }
  }

  dispose() {
    this.scene.traverse((obj) => {
      const m = obj as Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as Material | Material[] | undefined;
      if (Array.isArray(mat)) for (const x of mat) x.dispose();
      else mat?.dispose();
    });
    for (const m of Object.values(this.powerMats)) m.dispose();
    for (const tex of [
      ...this.textures,
      ...this.city.textures,
      ...this.actors.textures,
    ])
      tex.dispose();
    this.coins.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
