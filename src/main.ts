import * as PIXI from "pixi.js";
import { Texture } from "pixi.js";

window.addEventListener(
  "wheel",
  (ev) => {
    ev.stopPropagation();
    // ev.preventDefault();
  },
  { capture: true }
);

enum PuzzleType {
  LeftTop,
  CenterTop0,
  CenterTop1,
  RightTop,
  LeftCenter0,
  LeftCenter1,
  Center0,
  Center1,
  RightCenter1,
  RightCenter2,
  LeftBottom,
  CenterBottom0,
  CenterBottom1,
  RightBottom,
}

const SIZE = 64;

async function main() {
  const [row, col] = [11 + 2 * 8, 7 + 2 * 8];
  const { clientHeight, clientWidth } = window.document.body;
  const app = new PIXI.Application({
    background: "#1099bb",
    width: clientWidth,
    height: clientHeight,
  });
  document.body.appendChild(app.view as any);
  PIXI.Assets.add("content", "textures/content.jpeg");
  PIXI.Assets.add("puzzle", "textures/puzzle.png");
  const assets = await PIXI.Assets.load(["puzzle", "content"]);
  const content = assets["content"];
  // app.stage.addChild(new PIXI.Sprite(content));
  // Create a new texture
  const texture = assets["puzzle"];
  const sheet = new PIXI.Spritesheet(texture, {
    frames: {
      [PuzzleType.LeftTop]: {
        frame: {
          x: 0,
          y: 0,
          w: 128,
          h: 128,
        },
      },
      [PuzzleType.Center0]: {
        frame: {
          x: 128,
          y: 0,
          w: 128,
          h: 128,
        },
      },
      [PuzzleType.Center1]: {
        frame: {
          x: 128 * 1,
          y: 0,
          w: 128,
          h: 128,
        },
        rotated: true,
      },
      [PuzzleType.CenterTop0]: {
        frame: {
          x: 128 * 2,
          y: 0,
          w: 128,
          h: 128,
        },
      },
      [PuzzleType.CenterTop1]: {
        frame: {
          x: 128 * 3,
          y: 0,
          w: 128,
          h: 128,
        },
      },
    },
    meta: {
      scale: "1",
    },
  });

  const textures = await sheet.parse();

  const mapper: Record<PuzzleType, () => PIXI.Sprite> = {
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
  };

  const sprites: PIXI.Container[] = [];
  const container = new PIXI.Container();
  container.scale.set(0.5);

  // container.

  const test = new PIXI.Sprite(Texture.WHITE);

 

  const toPuzzleType = (i: number, j: number, row: number, col: number) => {
    if (i === 0 && j === 0) {
      return PuzzleType.LeftTop;
    }

    if (i === 0 && j === col - 1) {
      return PuzzleType.LeftBottom;
    }

    if (i === row - 1 && j === 0) {
      return PuzzleType.RightTop;
    }

    if (i === row - 1 && j === col - 1) {
      return PuzzleType.RightBottom;
    }

    if (j === 0) {
      if (i % 2 === 1) {
        return PuzzleType.CenterTop0;
      } else {
        return PuzzleType.CenterTop1;
      }
    }

    if (i === 0) {
      if (j % 2 === 1) {
        return PuzzleType.LeftCenter1;
      } else {
        return PuzzleType.LeftCenter0;
      }
    }

    if (j === col - 1) {
      if (i % 2 === 1) {
        return PuzzleType.CenterBottom0;
      } else {
        return PuzzleType.CenterBottom1;
      }
    }

    if (i === row - 1) {
      if (j % 2 === 1) {
        return PuzzleType.RightCenter2;
      } else {
        return PuzzleType.RightCenter1;
      }
    }

    if (i % 2 === 0) {
      if (j % 2 === 1) {
        return PuzzleType.Center1;
      } else {
        return PuzzleType.Center0;
      }
    } else {
      if (j % 2 === 1) {
        return PuzzleType.Center0;
      } else {
        return PuzzleType.Center1;
      }
    }
  };

  let dragTarget;

  const toPuzzle = (x: number, y: number, row: number, col: number) => {
    const sprite = mapper[toPuzzleType(x, y, row, col)]();
    const puzzle = new PIXI.Container();
    const r = new PIXI.Container();
    sprite.anchor.set(0.5);

    const hit = new PIXI.Sprite(Texture.WHITE);
    hit.alpha = 0;
    hit.width = SIZE - 8;
    hit.height = SIZE - 8;
    hit.anchor.set(0.5);

    const contentLayer = new PIXI.Sprite(content);

    contentLayer.x -= 33;
    contentLayer.x -= x * SIZE;
    contentLayer.y -= 33;
    contentLayer.y -= y * SIZE;

    puzzle.addChild(sprite);
    puzzle.addChild(contentLayer);

    contentLayer.mask = sprite;
    puzzle.cacheAsBitmap = true;
    puzzle.hitArea = new PIXI.Rectangle(0, 0, 0, 0);

    r.addChild(puzzle);
    r.addChild(hit);
    r.x += 34 + SIZE * x;
    r.y += 34 + SIZE * y;

    // r.x = 34 + Math.random() * 2000;
    // r.y = 34 + Math.random() * 1600;

    hit.interactive = true;
    sprite.interactive = false;
    sprite.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
    hit.on("pointerdown", (event) => {
      dragTarget = r;
      r.zIndex = -1;
      dragTarget.parent.toLocal(event.global, null, dragTarget.position);
      app.stage.on("pointermove", onDragMove);
    });
    return r;
  };

  for (let i = 0; i < row; i++)
    for (let j = 0; j < col; j++) {
      sprites.push(toPuzzle(i, j, row, col));
    }

  app.stage.interactive = true;
  app.stage.hitArea = app.screen;

  container.addChild(...sprites);
  // test.width = 100;
  // test.height = 100;
  // container.addChild(test);
  app.stage.addChild(container);
  

  function onDragMove(event) {
    if (dragTarget) {
      dragTarget.parent.toLocal(event.global, null, dragTarget.position);
    }
  }
  app.stage.on("pointerleave", onDragEnd);
  app.stage.on("pointerup", onDragEnd);

  

  function onDragEnd() {
    if (dragTarget) {
      app.stage.off("pointermove", onDragMove);
      dragTarget.alpha = 1;
      dragTarget = null;
    }
  }
}

main();
