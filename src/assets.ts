import * as PIXI from "pixi.js";
import { PuzzleType, UI } from "./types";



export async function initAssets() {
  PIXI.Assets.add("puzzle", "textures/puzzle.png");
  PIXI.Assets.add("ui", "textures/ui.png");
  const assets = await PIXI.Assets.load(["puzzle", 'ui']);
  const puzzleMasks = makePuzzleElement(await makePuzzleSheet(assets["puzzle"], 128).parse());
  const puzzleBorders = makePuzzleElement(await makePuzzleSheet(assets["puzzle"], 128 + 128).parse());
  const uis = await makeUISheet(assets['ui']).parse()
  return { puzzleMasks, puzzleBorders, uis }
}

const makePuzzleElement: (textures: PIXI.utils.Dict<PIXI.Texture<PIXI.Resource>>) => Record<PuzzleType, () => PIXI.Sprite> = textures => ({
  [PuzzleType.LeftTop]: () => {
    return new PIXI.Sprite(textures[PuzzleType.LeftTop]);
  },
  [PuzzleType.CenterTop0]: () => {
    return new PIXI.Sprite(textures[PuzzleType.CenterTop0]);
  },
  [PuzzleType.CenterTop1]: () => {
    return new PIXI.Sprite(textures[PuzzleType.CenterTop1]);
  },
  [PuzzleType.RightTop]: () => {
    const sprite = new PIXI.Sprite(textures[PuzzleType.LeftTop]);
    sprite.anchor.set(0.5);
    sprite.scale.x = -1;
    return sprite;
  },
  [PuzzleType.LeftCenter0]: () => {
    const sprite = new PIXI.Sprite(textures[PuzzleType.CenterTop0]);
    sprite.anchor.set(0.5);
    sprite.rotation = -Math.PI / 2;
    return sprite;
  },
  [PuzzleType.LeftCenter1]: () => {
    const sprite = new PIXI.Sprite(textures[PuzzleType.CenterTop1]);
    sprite.anchor.set(0.5);
    sprite.rotation = -Math.PI / 2;
    return sprite;
  },
  [PuzzleType.Center0]: () => {
    return new PIXI.Sprite(textures[PuzzleType.Center0]);
  },
  [PuzzleType.Center1]: () => {
    return new PIXI.Sprite(textures[PuzzleType.Center1]);
  },
  [PuzzleType.RightCenter1]: () => {
    const sprite = new PIXI.Sprite(textures[PuzzleType.CenterTop0]);
    sprite.anchor.set(0.5);
    sprite.rotation = Math.PI / 2;
    return sprite;
  },
  [PuzzleType.RightCenter2]: () => {
    const sprite = new PIXI.Sprite(textures[PuzzleType.CenterTop1]);
    sprite.anchor.set(0.5);
    sprite.rotation = Math.PI / 2;
    return sprite;
  },
  [PuzzleType.LeftBottom]: () => {
    const sprite = new PIXI.Sprite(textures[PuzzleType.LeftTop]);
    sprite.anchor.set(0.5);
    sprite.scale.x = -1;
    sprite.rotation = Math.PI;
    return sprite;
  },
  [PuzzleType.CenterBottom0]: () => {
    const sprite = new PIXI.Sprite(textures[PuzzleType.CenterTop0]);
    sprite.anchor.set(0.5);
    sprite.scale.y = -1;
    return sprite;
  },
  [PuzzleType.CenterBottom1]: () => {
    const sprite = new PIXI.Sprite(textures[PuzzleType.CenterTop1]);
    sprite.anchor.set(0.5);
    sprite.scale.y = -1;
    return sprite;
  },
  [PuzzleType.RightBottom]: () => {
    const sprite = new PIXI.Sprite(textures[PuzzleType.LeftTop]);
    sprite.anchor.set(0.5);
    sprite.rotation = Math.PI;
    return sprite;
  },
});

const makePuzzleSheet = (texture: PIXI.Texture, y: number) => new PIXI.Spritesheet(texture, {
  frames: {
    [PuzzleType.LeftTop]: {
      frame: {
        x: 0,
        y: y,
        w: 128,
        h: 128,
      },
    },
    [PuzzleType.Center0]: {
      frame: {
        x: 128,
        y: y,
        w: 128,
        h: 128,
      },
    },
    [PuzzleType.Center1]: {
      frame: {
        x: 128 * 1,
        y: y,
        w: 128,
        h: 128,
      },
      rotated: true,
    },
    [PuzzleType.CenterTop0]: {
      frame: {
        x: 128 * 2,
        y: y,
        w: 128,
        h: 128,
      },
    },
    [PuzzleType.CenterTop1]: {
      frame: {
        x: 128 * 3,
        y: y,
        w: 128,
        h: 128,
      },
    },
  },
  meta: {
    scale: "1",
  },
});

const makeUISheet = (texture: PIXI.Texture) => new PIXI.Spritesheet(texture, {
  frames: {
    [UI.TableLeftTop]: { frame: { x: 0, y: 0, w: 64, h: 64 } },
    [UI.TableTop]: { frame: { x: 64, y: 0, w: 64, h: 64 } },
    [UI.TableRightTop]: { frame: { x: 64 * 2, y: 0, w: 64, h: 64 } },
    [UI.MusicOpen]: { frame: { x: 64 * 3, y: 0, w: 64, h: 64 } },
    [UI.MusicClose]: { frame: { x: 64 * 4, y: 0, w: 64, h: 64 } },
    [UI.TableLeftCenter]: { frame: { x: 0, y: 64, w: 64, h: 64 } },
    [UI.TableCenter]: { frame: { x: 64, y: 64, w: 64, h: 64 } },
    [UI.TableRightCenter]: { frame: { x: 64 * 2, y: 64, w: 64, h: 64 } },
    [UI.TableLeftBottom]: { frame: { x: 0, y: 64 * 2, w: 64, h: 64 } },
    [UI.TableCenterBottom]: { frame: { x: 64, y: 64 * 2, w: 64, h: 64 } },
    [UI.TableRightBottom]: { frame: { x: 64 * 2, y: 64 * 2, w: 64, h: 64 } },
    [UI.Ticker]: { frame: { x: 64 * 3, y: 64, w: 64 * 3, h: 64 * 2 } },
    [UI.Char_0]: { frame: { x: 0, y: 64 * 3, w: 64, h: 64 } },
    [UI.Char_1]: { frame: { x: 64, y: 64 * 3, w: 64, h: 64 } },
    [UI.Char_2]: { frame: { x: 64 * 2, y: 64 * 3, w: 64, h: 64 } },
    [UI.Char_3]: { frame: { x: 64 * 3, y: 64 * 3, w: 64, h: 64 } },
    [UI.Char_4]: { frame: { x: 64 * 4, y: 64 * 3, w: 64, h: 64 } },
    [UI.Char_5]: { frame: { x: 64 * 5, y: 64 * 3, w: 64, h: 64 } },
    [UI.Char_6]: { frame: { x: 0, y: 64 * 4, w: 64, h: 64 } },
    [UI.Char_7]: { frame: { x: 64, y: 64 * 4, w: 64, h: 64 } },
    [UI.Char_8]: { frame: { x: 64 * 2, y: 64 * 4, w: 64, h: 64 } },
    [UI.Char_9]: { frame: { x: 64 * 3, y: 64 * 4, w: 64, h: 64 } },
    [UI.Char_split]: { frame: { x: 64 * 4, y: 64 * 4, w: 64, h: 64 } },

    [UI.UpNext]: { frame: { x: 0, y: 64 * 5, w: 64, h: 64 } },
    [UI.Next]: { frame: { x: 64, y: 64 * 5, w: 64, h: 64 } },
    [UI.DownNext]: { frame: { x: 64 * 2, y: 64 * 5, w: 64, h: 64 } },
  },
  meta: {
    scale: '1'
  },
});