import {
  BoxGeometry,
  Color,
  type Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  type Scene,
  type Texture,
} from "three";
import { makeDrone } from "./meshes";
import { neonSignTexture, windowTexture } from "./textures";

const BUILDINGS_PER_SIDE = 18;
const BUILDING_STEP = 14;
const SPAN = BUILDINGS_PER_SIDE * BUILDING_STEP;
const SIGN_COUNT = 14;
const GANTRY_COUNT = 2;
const GANTRY_SPAN = 160;
const DRONE_COUNT = 7;

const SIGN_DEFS: { text: string; color: string }[] = [
  { text: "奶家人", color: "#ffd60a" },
  { text: "鼠家人", color: "#22d3ee" },
  { text: "奶家人", color: "#ff3fa4" },
  { text: "鼠家人", color: "#a855f7" },
];

interface Building {
  mesh: Mesh;
  at: number;
  side: number;
}

interface Sign {
  mesh: Mesh;
  mat: MeshStandardMaterial;
  at: number;
  phase: number;
  span: number;
}

interface Drone {
  group: Group;
  at: number;
  x: number;
  y: number;
  phase: number;
  lamp: Mesh | undefined;
}

/** Recycling neon city: buildings, animated signs, gantries and drones. */
export class City {
  private readonly buildings: Building[] = [];
  private readonly signs: Sign[] = [];
  private readonly drones: Drone[] = [];
  private readonly buildingMats: MeshStandardMaterial[] = [];
  readonly textures: Texture[] = [];

  constructor(scene: Scene) {
    const win = windowTexture();
    this.textures.push(win);
    for (const c of ["#2b1857", "#3b1f6e", "#1f2a5c", "#4a1d5e"]) {
      const m = new MeshStandardMaterial({
        color: c,
        emissive: new Color("#ffffff"),
        emissiveMap: win,
        emissiveIntensity: 0.6,
        roughness: 0.8,
      });
      this.buildingMats.push(m);
    }
    const geo = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
    for (let i = 0; i < BUILDINGS_PER_SIDE * 2; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const mesh = new Mesh(geo, this.buildingMats[i % 4]);
      const b = { mesh, side, at: Math.floor(i / 2) * BUILDING_STEP };
      this.shapeBuilding(b);
      scene.add(mesh);
      this.buildings.push(b);
    }

    const signTex = SIGN_DEFS.map((d) => neonSignTexture(d.text, d.color));
    this.textures.push(...signTex);
    const plane = new PlaneGeometry(1, 0.375);
    for (let i = 0; i < SIGN_COUNT + GANTRY_COUNT; i++) {
      const tex = signTex[i % signTex.length];
      const mat = new MeshStandardMaterial({
        color: "#111111",
        map: tex,
        emissive: new Color("#ffffff"),
        emissiveMap: tex,
        transparent: true,
        emissiveIntensity: 1,
      });
      const mesh = new Mesh(plane, mat);
      const gantry = i >= SIGN_COUNT;
      if (gantry) {
        mesh.scale.set(7.5, 7.5, 1);
        mesh.position.set(0, 7.4, 0);
      } else {
        const side = i % 2 === 0 ? -1 : 1;
        mesh.scale.set(4.2, 4.2, 1);
        mesh.rotation.y = -side * (Math.PI / 2 - 0.35);
        mesh.position.set(side * 6.9, 4 + (i % 3) * 2.2, 0);
      }
      scene.add(mesh);
      this.signs.push({
        mesh,
        mat,
        phase: Math.random() * 10,
        span: gantry ? GANTRY_SPAN * GANTRY_COUNT : SPAN,
        at: gantry
          ? 90 + (i - SIGN_COUNT) * GANTRY_SPAN
          : 20 + (i * SPAN) / SIGN_COUNT,
      });
    }

    for (let i = 0; i < DRONE_COUNT; i++) {
      const group = makeDrone();
      scene.add(group);
      this.drones.push({
        group,
        at: 30 + i * 22,
        x: (Math.random() - 0.5) * 14,
        y: 6 + Math.random() * 4,
        phase: Math.random() * 6,
        lamp: group.children.find((c) => c.name === "lamp") as Mesh | undefined,
      });
    }
  }

  private shapeBuilding(b: Building) {
    const w = 4 + Math.random() * 5;
    const h = 8 + Math.random() * 26;
    const d = 8 + Math.random() * 5;
    b.mesh.scale.set(w, h, d);
    b.mesh.position.x = b.side * (7.8 + w / 2 + Math.random() * 1.5);
  }

  update(distance: number, dt: number, time: number, neon: number) {
    for (const b of this.buildings) {
      if (b.at - distance < -20) {
        b.at += SPAN;
        this.shapeBuilding(b);
      }
      b.mesh.position.z = -(b.at - distance);
    }
    for (const m of this.buildingMats) m.emissiveIntensity = 0.15 + neon * 0.45;

    for (const s of this.signs) {
      if (s.at - distance < -20) s.at += s.span;
      s.mesh.position.z = -(s.at - distance);
      const pulse = 0.78 + 0.22 * Math.sin(time * 4 + s.phase);
      const flicker = Math.sin(time * 23 + s.phase * 7) > 0.97 ? 0.25 : 1;
      s.mat.emissiveIntensity = (0.4 + neon) * pulse * flicker;
    }

    for (const d of this.drones) {
      d.at += dt * 4;
      if (d.at - distance < -15) {
        d.at += 160;
        d.x = (Math.random() - 0.5) * 14;
        d.y = 6 + Math.random() * 4;
      }
      const g = d.group;
      g.position.set(
        d.x + Math.sin(time * 0.8 + d.phase) * 2,
        d.y + Math.sin(time * 2 + d.phase) * 0.35,
        -(d.at - distance),
      );
      g.rotation.z = Math.sin(time * 1.3 + d.phase) * 0.12;
      if (d.lamp) d.lamp.visible = Math.sin(time * 8 + d.phase) > 0;
    }
  }
}
