import { Group, type Mesh, type Scene, type Sprite, type Texture } from "three";
import { CHASER, type Character, type Skin } from "../lib/characters";
import { CHASER_RULES } from "../lib/gameConfig";
import { isFlying } from "./engine";
import { type RunnerRig, makeRunner, makeScooter, sprite } from "./meshes";
import { bubbleTexture, stickerTexture } from "./textures";
import { type GameState, LANE_WIDTH } from "./types";

/** Runner + chaser kangaroo visuals driven from engine state. */
export class Actors {
  readonly rig: RunnerRig;
  readonly chaser: Group;
  private readonly chaserBubble: Sprite;
  private readonly kangaroo: Sprite;
  private readonly wheels: Mesh[];
  readonly textures: Texture[] = [];
  private readonly showBubbleWhenFlying: boolean;

  constructor(scene: Scene, character: Character, skin: Skin) {
    const face = stickerTexture(skin.imagePath, skin.accentColor);
    const bubble = bubbleTexture(character.catchphrase);
    const roo = stickerTexture(CHASER.imagePath, CHASER.accentColor);
    const caught = bubbleTexture(CHASER_RULES.caughtText);
    this.textures.push(face, bubble, roo, caught);
    this.showBubbleWhenFlying = character.catchphraseTrigger === "flight";

    this.rig = makeRunner(skin.accentColor, face, bubble);
    scene.add(this.rig.root, this.rig.shadow);

    this.chaser = new Group();
    const scooter = makeScooter("#ffc300", "#ffd60a");
    scooter.rotation.y = Math.PI;
    this.chaser.add(scooter);
    this.wheels = scooter.children.filter((c) => c.name === "wheel") as Mesh[];
    this.kangaroo = sprite(roo, 1.8);
    this.kangaroo.position.set(0, 2.15, 0);
    this.chaser.add(this.kangaroo);
    this.chaserBubble = sprite(caught, 3);
    this.chaserBubble.scale.set(4.4, 1.5, 1);
    this.chaserBubble.position.set(0.4, 3.9, 0);
    this.chaser.add(this.chaserBubble);
    scene.add(this.chaser);
  }

  update(s: GameState, time: number) {
    const r = s.runner;
    const rig = this.rig;
    const caught = s.status !== "running";
    const rolling = r.rollTimer > 0;
    const flying = isFlying(s);
    const ult = s.active.naiFamilyUltimate > 0;

    rig.root.position.set(r.x, r.y, 0);
    rig.shadow.position.x = r.x;
    const sh = Math.max(0.35, 1 - r.y * 0.12);
    rig.shadow.scale.set(sh, sh, sh);

    const swing = caught ? 0 : Math.sin(r.stride * 0.55);
    const air = !r.grounded && !flying;
    rig.legL.rotation.x = air ? -0.9 : swing * 0.95;
    rig.legR.rotation.x = air ? -0.4 : -swing * 0.95;
    rig.armL.rotation.x = -swing * 0.8 - (flying ? 2.4 : 0);
    rig.armR.rotation.x = swing * 0.8 - (flying ? 2.4 : 0);
    const lean = (r.x - Math.round(r.x / LANE_WIDTH) * LANE_WIDTH) * -0.25;
    rig.body.rotation.z = caught ? 0.55 : lean;
    if (rolling) {
      rig.body.scale.set(1.1, 0.5, 1.1);
      rig.body.rotation.x = -time * 18;
    } else {
      const bob = r.grounded ? Math.abs(swing) * 0.06 : 0;
      rig.body.scale.set(1, 1 + bob, 1);
      rig.body.rotation.x = caught ? -0.4 : 0;
    }
    rig.face.scale.setScalar(caught ? 1.6 : 1.35);

    const blink = s.invulnTimer > 0 && !ult && Math.sin(time * 40) > 0;
    rig.body.visible = !blink;
    rig.shield.visible = s.active.milkShield > 0;
    rig.shield.scale.setScalar(1 + Math.sin(time * 6) * 0.05);
    rig.flames.visible = flying;
    rig.flames.scale.set(1, 0.8 + Math.random() * 0.6, 1);
    rig.aura.visible = ult;
    rig.aura.rotation.y = time * 6;
    rig.aura.scale.setScalar(1 + Math.sin(time * 10) * 0.15);
    const shout = this.showBubbleWhenFlying ? flying || r.y > 1.2 : ult;
    rig.bubble.visible = shout && !caught;
    if (shout) rig.bubble.position.y = 3.1 + Math.sin(time * 9) * 0.08;

    // Chaser: z behind the runner shrinks as the gap closes.
    const z = Math.min(9, 0.9 + s.chaserGap * 0.42);
    const side = caught ? 0.7 : 1.4;
    const cx = this.chaser.position.x;
    this.chaser.position.set(
      cx + (r.x + side - cx) * 0.12,
      Math.sin(time * 12) * 0.04,
      z,
    );
    this.chaser.rotation.z = Math.sin(time * 3) * 0.05;
    for (const w of this.wheels) w.rotation.x -= caught ? 0 : 0.6;
    this.kangaroo.scale.setScalar(caught ? 2.2 : 1.8);
    this.chaserBubble.visible = caught;
  }
}
