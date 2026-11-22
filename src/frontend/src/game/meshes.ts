import {
  AdditiveBlending,
  BoxGeometry,
  CapsuleGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  type Texture,
  TorusGeometry,
} from "three";
import { LANE_WIDTH } from "./types";

export function std(
  color: string | Color,
  emissive = "#000000",
  emissiveIntensity = 0,
): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color,
    emissive,
    emissiveIntensity,
    roughness: 0.55,
    metalness: 0.1,
  });
}

export function glow(color: string, opacity = 0.5): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: AdditiveBlending,
    depthWrite: false,
  });
}

export function sprite(tex: Texture, scale: number): Sprite {
  const s = new Sprite(
    new SpriteMaterial({ map: tex, transparent: true, depthWrite: false }),
  );
  s.scale.set(scale, scale, 1);
  return s;
}

const wheelGeo = new CylinderGeometry(0.32, 0.32, 0.18, 16).rotateZ(
  Math.PI / 2,
);
const boxGeo = new BoxGeometry(1, 1, 1);

function box(
  mat: MeshStandardMaterial | MeshBasicMaterial,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
): Mesh {
  const m = new Mesh(boxGeo, mat);
  m.scale.set(w, h, d);
  m.position.set(x, y, z);
  return m;
}

/** Stylised delivery scooter. Front (headlight) faces +z. */
export function makeScooter(body: string, crate: string): Group {
  const g = new Group();
  const bodyMat = std(body, body, 0.15);
  const dark = std("#1b1030");
  const crateMat = std(crate, crate, 0.35);
  const lamp = std("#fff6c8", "#fff1a8", 3);
  g.add(box(bodyMat, 0.55, 0.45, 1.5, 0, 0.55, 0));
  g.add(box(bodyMat, 0.5, 0.9, 0.22, 0, 0.95, 0.62));
  g.add(box(dark, 0.9, 0.08, 0.08, 0, 1.45, 0.62));
  g.add(box(crateMat, 0.85, 0.75, 0.75, 0, 1.15, -0.5));
  g.add(box(lamp, 0.26, 0.18, 0.06, 0, 1.2, 0.75));
  for (const z of [0.6, -0.6]) {
    const w = new Mesh(wheelGeo, dark);
    w.position.set(0, 0.32, z);
    w.name = "wheel";
    g.add(w);
  }
  return g;
}

export interface RunnerRig {
  root: Group;
  body: Group;
  legL: Group;
  legR: Group;
  armL: Group;
  armR: Group;
  face: Sprite;
  shield: Mesh;
  flames: Group;
  aura: Mesh;
  bubble: Sprite;
  shadow: Mesh;
}

function limb(mat: MeshStandardMaterial, r: number, len: number): Group {
  const pivot = new Group();
  const m = new Mesh(new CapsuleGeometry(r, len, 4, 10), mat);
  m.position.y = -len / 2 - r * 0.5;
  pivot.add(m);
  return pivot;
}

export function makeRunner(
  accent: string,
  faceTex: Texture,
  bubbleTex: Texture,
): RunnerRig {
  const root = new Group();
  const body = new Group();
  root.add(body);
  const mat = std(accent, accent, 0.18);
  const torso = new Mesh(new CapsuleGeometry(0.4, 0.45, 6, 14), mat);
  torso.position.y = 1.0;
  body.add(torso);
  const legL = limb(mat, 0.14, 0.32);
  const legR = limb(mat, 0.14, 0.32);
  legL.position.set(-0.2, 0.62, 0);
  legR.position.set(0.2, 0.62, 0);
  const armL = limb(mat, 0.11, 0.32);
  const armR = limb(mat, 0.11, 0.32);
  armL.position.set(-0.5, 1.28, 0);
  armR.position.set(0.5, 1.28, 0);
  body.add(legL, legR, armL, armR);
  const face = sprite(faceTex, 1.35);
  // Camera sits behind the runner, so the sticker sits on the camera side.
  face.position.set(0, 1.75, 0.55);
  body.add(face);

  const shield = new Mesh(
    new SphereGeometry(1.35, 24, 16),
    glow("#9be7ff", 0.28),
  );
  shield.position.y = 1.1;
  root.add(shield);

  const flames = new Group();
  const flameGeo = new ConeGeometry(0.16, 0.8, 10).rotateX(Math.PI);
  const flameMat = glow("#ff8a2a", 0.9);
  for (const x of [-0.2, 0.2]) {
    const f = new Mesh(flameGeo, flameMat);
    f.position.set(x, 0.05, 0);
    flames.add(f);
  }
  root.add(flames);

  const aura = new Mesh(
    new TorusGeometry(1.1, 0.09, 8, 40).rotateX(Math.PI / 2),
    glow("#ff3fa4", 0.85),
  );
  aura.position.y = 0.15;
  root.add(aura);

  const bubble = sprite(bubbleTex, 2.4);
  bubble.scale.set(2.6, 0.9, 1);
  bubble.position.set(0, 3.1, 0);
  root.add(bubble);

  const shadow = new Mesh(
    new CircleGeometry(0.6, 20).rotateX(-Math.PI / 2),
    new MeshBasicMaterial({ color: "#000", transparent: true, opacity: 0.35 }),
  );
  shadow.position.y = 0.02;

  return {
    root,
    body,
    legL,
    legR,
    armL,
    armR,
    face,
    shield,
    flames,
    aura,
    bubble,
    shadow,
  };
}

export function makeBarrier(stripes: Texture): Group {
  const g = new Group();
  const board = new MeshStandardMaterial({ map: stripes, roughness: 0.6 });
  const post = std("#2a1a4a");
  const lamp = std("#ff5a1f", "#ff5a1f", 2.5);
  g.add(box(board, LANE_WIDTH * 0.88, 1.1, 0.25, 0, 1.9, 0));
  g.add(box(board, LANE_WIDTH * 0.88, 0.7, 0.25, 0, 0.9, 0));
  for (const x of [-0.95, 0.95]) g.add(box(post, 0.14, 2.5, 0.3, x, 1.25, 0));
  const l = box(lamp, 0.24, 0.24, 0.24, -0.8, 2.65, 0);
  l.name = "lamp";
  g.add(l);
  const r = box(lamp, 0.24, 0.24, 0.24, 0.8, 2.65, 0);
  r.name = "lamp";
  g.add(r);
  return g;
}

export function makeLowRail(stripes: Texture): Group {
  const g = new Group();
  const rail = new MeshStandardMaterial({
    map: stripes,
    emissive: new Color("#ff3355"),
    emissiveIntensity: 0.35,
  });
  const post = std("#2a1a4a");
  g.add(box(rail, LANE_WIDTH * 0.9, 0.24, 0.18, 0, 0.62, 0));
  for (const x of [-0.9, 0.9]) g.add(box(post, 0.12, 0.62, 0.18, x, 0.31, 0));
  return g;
}

export function makeHighBar(): Group {
  const g = new Group();
  const neon = std("#ff3fa4", "#ff3fa4", 2.2);
  const pole = std("#3a2766");
  const bar = box(neon, LANE_WIDTH * 0.95, 0.32, 0.3, 0, 1.55, 0);
  g.add(bar);
  g.add(box(neon, LANE_WIDTH * 0.7, 0.5, 0.12, 0, 2.05, 0));
  for (const x of [-1.15, 1.15]) g.add(box(pole, 0.14, 2.4, 0.14, x, 1.2, 0));
  const shine = box(glow("#ff3fa4", 0.35), LANE_WIDTH, 0.7, 0.05, 0, 1.55, 0.2);
  g.add(shine);
  return g;
}

const rotorGeo = new CylinderGeometry(0.22, 0.22, 0.03, 12);

export function makeDrone(): Group {
  const g = new Group();
  const body = std("#ffd60a", "#ffd60a", 0.3);
  const arm = std("#1b1030");
  g.add(box(body, 0.6, 0.2, 0.6, 0, 0, 0));
  g.add(box(arm, 1.2, 0.05, 0.08, 0, 0.05, 0));
  g.add(box(arm, 0.08, 0.05, 1.2, 0, 0.05, 0));
  const rotorMat = glow("#e8f4ff", 0.45);
  for (const [x, z] of [
    [0.6, 0],
    [-0.6, 0],
    [0, 0.6],
    [0, -0.6],
  ]) {
    const r = new Mesh(rotorGeo, rotorMat);
    r.position.set(x, 0.12, z);
    g.add(r);
  }
  g.add(box(std("#ff7a2f", "#ff7a2f", 0.4), 0.4, 0.35, 0.4, 0, -0.45, 0));
  const light = box(
    std("#ff2244", "#ff2244", 3),
    0.1,
    0.1,
    0.1,
    0,
    -0.12,
    0.32,
  );
  light.name = "lamp";
  g.add(light);
  return g;
}
