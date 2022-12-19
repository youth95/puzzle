import './normal';
import { initAssets } from './assets';
import * as PIXI from "pixi.js";
import { PuzzleType, UI } from './types';

const SIZE = 64;

const audio = new Audio('bgm.mp3');
audio.loop = true;

async function main() {
  const [row, col] = [3, 3];
  const { content, puzzleMasks, puzzleBorders, uis } = await initAssets('https://img2.baidu.com/it/u=1779174718,345053138&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800')
  const contentWidth = content.width;
  const contentHeight = content.height;
  const contentWidthScale = (row * SIZE) / contentWidth;
  const contentHeightScale = (col * SIZE) / contentHeight;

  const { clientHeight, clientWidth } = window.document.body;
  const app = new PIXI.Application({
    background: "#0ab6f9",
    width: clientWidth,
    height: clientHeight,
  });
  document.body.appendChild(app.view as any);

  // background
  const { width, height } = app.screen;
  const x = width % 64 / 2;
  const y = height % 64 / 2;
  const w = (width - (width % 64)) / 64;
  const h = (height - (height % 64)) / 64;
  for (let i = 0; i < w; i++)
    for (let j = 0; j < h; j++) {
      let tx = uis[UI.TableCenter];
      if (i === 0 && j === 0) {
        tx = uis[UI.TableLeftTop]
      } else if (i === 0 && j === h - 1) {
        tx = uis[UI.TableLeftBottom]
      } else if (i === w - 1 && j === 0) {
        tx = uis[UI.TableRightTop]
      } else if (i === w - 1 && j === h - 1) {
        tx = uis[UI.TableRightBottom]
      } else if (i === 0) {
        tx = uis[UI.TableLeftCenter]
      } else if (j === 0) {
        tx = uis[UI.TableTop]
      } else if (i === w - 1) {
        tx = uis[UI.TableRightCenter]
      } else if (j === h - 1) {
        tx = uis[UI.TableCenterBottom]
      }
      const sprite = new PIXI.Sprite(tx);
      sprite.x = x + i * 64;
      sprite.y = y + j * 64;
      app.stage.addChild(sprite);

    }

  // background end

  // ticker

  const time = new PIXI.Text('00:00', {
    fill: '#fff',
    fontSize: 42,
  });
  time.anchor.set(0.5);
  time.x = app.screen.width / 2;
  time.y = 40 + 64;
  let t = 0;
  app.ticker.add(dt => {
    if (!userIsVictory) {
      t += 1 / dt;
      const s = Math.floor((t / 60) % 60);
      const m = Math.floor((t / 60 - s) / 60);
      time.text = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
  })


  const tickerUI = new PIXI.Sprite(uis[UI.Ticker]);
  tickerUI.anchor.set(0.5);
  tickerUI.x = app.screen.width / 2;
  tickerUI.y = 64 * 2;
  app.stage.addChild(tickerUI);
  app.stage.addChild(time);

  // ticker end

  // music
  const musicUI = new PIXI.Sprite(uis[UI.MusicClose]);
  app.stage.addChild(musicUI);
  musicUI.anchor.set(0.5);
  musicUI.x = app.screen.width / 2 + 3 * 64;
  musicUI.y = 64 * 2;
  musicUI.interactive = true;
  musicUI.addEventListener('pointerdown', () => {
    if (musicUI.texture === uis[UI.MusicClose]) {
      audio.play();
      musicUI.texture = uis[UI.MusicOpen];
    } else {
      audio.pause();
      musicUI.texture = uis[UI.MusicClose];
    }
  });
  // music end

  // next
  const upNext = new PIXI.Sprite(uis[UI.UpNext]);
  const next = new PIXI.Sprite(uis[UI.Next]);
  const downNext = new PIXI.Sprite(uis[UI.DownNext]);
  const nextButtons = [upNext, next, downNext];
  nextButtons.forEach(sp => {
    sp.anchor.set(0.5);
    sp.x = app.screen.width / 2;
    sp.y = app.screen.height - 64 * 2;
    sp.visible = false;
    app.stage.addChild(sp);
  });
  upNext.x -= 64 + 12;
  downNext.x += 64 + 12;

  // next end

  const sprites: PIXI.Container[] = [];
  const container = new PIXI.Container();
  const slots: Record<
    string,
    {
      pos: number[];
      left: PIXI.Sprite;
      right: PIXI.Sprite;
      top: PIXI.Sprite;
      bottom: PIXI.Sprite;
    }
  > = {};

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

  let dragTarget: {
    puzzle: PIXI.DisplayObject & { hits: PIXI.DisplayObject[] };
    pos: number[][];
  } | null = null;
  const borders: PIXI.Sprite[] = [];
  const hits: PIXI.Sprite[] = [];
  const toPuzzle = (x: number, y: number, row: number, col: number) => {
    const puzzleType = toPuzzleType(x, y, row, col);
    const puzzleMask = puzzleMasks[puzzleType]();
    puzzleMask.anchor.set(0.5);
    puzzleMask.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
    const puzzleBoarder = puzzleBorders[puzzleType]();
    puzzleBoarder.alpha = 0.5;
    borders.push(puzzleBoarder);
    puzzleBoarder.anchor.set(0.5);
    puzzleBoarder.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
    const puzzle = new PIXI.Container();
    const r = new PIXI.Container();
    // TODO 这里需要个slot 编号, 使得重合的slot获得相同的编号
    const slotLeft = new PIXI.Sprite();
    slotLeft.tint = 0x0010ff;
    slotLeft.x = -32;
    const slotTop = new PIXI.Sprite();
    slotTop.tint = 0x8810ff;
    slotTop.y = -32;
    const slotRight = new PIXI.Sprite();
    slotRight.tint = 0x5590ff;
    slotRight.x = 32;
    const slotBottom = new PIXI.Sprite();
    slotBottom.tint = 0x92f0ff;
    slotBottom.y = 32;

    slots[`${x}_${y}`] = {
      pos: [x, y],
      left: slotLeft,
      top: slotTop,
      right: slotRight,
      bottom: slotBottom,
    };

    [slotLeft, slotTop, slotRight, slotBottom].forEach((slot) => {
      slot.anchor.set(0.5);
      slot.hitArea = new PIXI.Rectangle();
      slot.alpha = 0;
    });

    const hit = new PIXI.Sprite();
    hits.push(hit);
    hit.tint = 0xff0fff;
    hit.alpha = 0;
    hit.width = SIZE - 8;
    hit.height = SIZE - 8;
    hit.anchor.set(0.5);

    const contentLayer = new PIXI.Sprite(content);
    contentLayer.scale.set(contentWidthScale, contentHeightScale);

    contentLayer.x -= 33;
    contentLayer.x -= x * SIZE;
    contentLayer.y -= 33;
    contentLayer.y -= y * SIZE;

    puzzle.addChild(puzzleMask);
    puzzle.addChild(contentLayer);


    contentLayer.mask = puzzleMask;
    puzzle.cacheAsBitmap = true;
    puzzle.hitArea = new PIXI.Rectangle(0, 0, 0, 0);

    r.addChild(puzzle);
    r.addChild(puzzleBoarder);
    r.addChild(hit);
    let selfSlots: PIXI.Sprite[];
    // 去除多余的slot
    if ([PuzzleType.LeftTop].includes(puzzleType)) {
      selfSlots = [slotRight, slotBottom];
    } else if (
      [PuzzleType.CenterTop0, PuzzleType.CenterTop1].includes(puzzleType)
    ) {
      selfSlots = [slotLeft, slotRight, slotBottom];
    } else if ([PuzzleType.RightTop].includes(puzzleType)) {
      selfSlots = [slotLeft, slotBottom];
    } else if ([PuzzleType.LeftBottom].includes(puzzleType)) {
      selfSlots = [slotTop, slotRight];
    } else if ([PuzzleType.RightBottom].includes(puzzleType)) {
      selfSlots = [slotTop, slotLeft];
    } else if (
      [PuzzleType.LeftCenter0, PuzzleType.LeftCenter1].includes(puzzleType)
    ) {
      selfSlots = [slotTop, slotRight, slotBottom];
    } else if (
      [PuzzleType.RightCenter1, PuzzleType.RightCenter2].includes(puzzleType)
    ) {
      selfSlots = [slotLeft, slotTop, slotBottom];
    } else if (
      [PuzzleType.CenterBottom0, PuzzleType.CenterBottom1].includes(puzzleType)
    ) {
      selfSlots = [slotLeft, slotTop, slotRight];
    } else {
      selfSlots = [slotLeft, slotTop, slotRight, slotBottom];
    }

    selfSlots.forEach((slot) => {
      Object.assign(slot, { pos: `${x}_${y}` }), r.addChild(slot);
    });

    // r.x += 34 + SIZE * x;
    // r.y += 34 + SIZE * y;

    r.x = 34 + Math.random() * (app.screen.width / 2 - SIZE * 4);
    r.y = 34 + Math.random() * (app.screen.height / 2 - SIZE * 4);

    hit.interactive = true;


    Object.assign(r, { hits: [hit], pos: `${x}_${y}` });
    hit.on("pointerdown", (event) => {
      dragTarget = { puzzle: Object.assign(r, { hits: [hit] }), pos: [[x, y]] };
      r.zIndex = -1;
      dragTarget.puzzle.parent.toLocal(
        event.global,
        undefined,
        dragTarget.puzzle.position
      );
      app.stage.on("pointermove", onDragMove);
    });
    return r;
  };

  for (let i = 0; i < row; i++)
    for (let j = 0; j < col; j++) {
      sprites.push(toPuzzle(i, j, row, col));
    }
  const join = (
    slot1: PIXI.Sprite,
    slot2: PIXI.Sprite,
    offsetX: number,
    offsetY: number
  ) =>
    Object.assign(slot1, {
      joinTo: slot2,
      offset: new PIXI.Point(offsetX, offsetY),
    });
  // 设置 puzzle join
  for (let i = 0; i < row; i++)
    for (let j = 0; j < col; j++) {
      const puzzleType = toPuzzleType(i, j, row, col);
      if ([PuzzleType.LeftTop].includes(puzzleType)) {
        // 左上角
        join(slots[`${i}_${j}`].right, slots[`${i + 1}_${j}`].left, -32, 0);
        join(slots[`${i}_${j}`].bottom, slots[`${i}_${j + 1}`].top, 0, -32);
      } else if (
        [PuzzleType.CenterTop0, PuzzleType.CenterTop1].includes(puzzleType) // 上边
      ) {
        join(slots[`${i}_${j}`].left, slots[`${i - 1}_${j}`].right, 32, 0);
        join(slots[`${i}_${j}`].right, slots[`${i + 1}_${j}`].left, -32, 0);
        join(slots[`${i}_${j}`].bottom, slots[`${i}_${j + 1}`].top, 0, -32);
      } else if ([PuzzleType.RightTop].includes(puzzleType)) {
        // 右上角
        join(slots[`${i}_${j}`].left, slots[`${i - 1}_${j}`].right, 32, 0);
        join(slots[`${i}_${j}`].bottom, slots[`${i}_${j + 1}`].top, 0, -32);
      } else if ([PuzzleType.LeftBottom].includes(puzzleType)) {
        // 左下角
        join(slots[`${i}_${j}`].right, slots[`${i + 1}_${j}`].left, -32, 0);
        join(slots[`${i}_${j}`].top, slots[`${i}_${j - 1}`].bottom, 0, 32);
      } else if ([PuzzleType.RightBottom].includes(puzzleType)) {
        // 右下角
        join(slots[`${i}_${j}`].left, slots[`${i - 1}_${j}`].right, 32, 0);
        join(slots[`${i}_${j}`].top, slots[`${i}_${j - 1}`].bottom, 0, 32);
      } else if (
        [PuzzleType.LeftCenter0, PuzzleType.LeftCenter1].includes(puzzleType) // 左边
      ) {
        join(slots[`${i}_${j}`].top, slots[`${i}_${j - 1}`].bottom, 0, 32);
        join(slots[`${i}_${j}`].right, slots[`${i + 1}_${j}`].left, -32, 0);
        join(slots[`${i}_${j}`].bottom, slots[`${i}_${j + 1}`].top, 0, -32);
      } else if (
        [PuzzleType.RightCenter1, PuzzleType.RightCenter2].includes(puzzleType) // 右边
      ) {
        join(slots[`${i}_${j}`].left, slots[`${i - 1}_${j}`].right, 32, 0);
        join(slots[`${i}_${j}`].bottom, slots[`${i}_${j + 1}`].top, 0, -32);
        join(slots[`${i}_${j}`].top, slots[`${i}_${j - 1}`].bottom, 0, 32);
      } else if (
        // 下边
        [PuzzleType.CenterBottom0, PuzzleType.CenterBottom1].includes(
          puzzleType
        )
      ) {
        join(slots[`${i}_${j}`].left, slots[`${i - 1}_${j}`].right, 32, 0);
        join(slots[`${i}_${j}`].top, slots[`${i}_${j - 1}`].bottom, 0, 32);
        join(slots[`${i}_${j}`].right, slots[`${i + 1}_${j}`].left, -32, 0);
      } else {
        // 中间
        join(slots[`${i}_${j}`].left, slots[`${i - 1}_${j}`].right, 32, 0);
        join(slots[`${i}_${j}`].bottom, slots[`${i}_${j + 1}`].top, 0, -32);
        join(slots[`${i}_${j}`].top, slots[`${i}_${j - 1}`].bottom, 0, 32);
        join(slots[`${i}_${j}`].right, slots[`${i + 1}_${j}`].left, -32, 0);
      }
    }



  container.addChild(...sprites);
  container.pivot.x = container.width / 2;
  container.pivot.y = container.height / 2;
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;

  app.stage.addChild(container);
  app.stage.interactive = true;
  app.stage.hitArea = app.screen;


  function onDragMove(event) {
    if (dragTarget) {
      dragTarget.puzzle.parent.toLocal(
        event.global,
        undefined,
        dragTarget.puzzle.position
      );
    }
  }
  app.stage.on("pointerleave", onDragEnd);
  app.stage.on("pointerup", onDragEnd);
  let userIsVictory = false;

  function onDragEnd() {
    if (dragTarget) {
      const { pos } = dragTarget;
      const slotTests = pos
        .map(([x, y]) => slots[`${x}_${y}`])
        .flat()
        .map((slot) => [slot.left, slot.right, slot.top, slot.bottom])
        .flat()
        .filter((slot) => (slot as any).joinTo);
      for (const slotTest of slotTests) {
        const { joinTo, offset } = slotTest as PIXI.Sprite & {
          joinTo: PIXI.Sprite;
          offset: PIXI.Point;
        };
        const p0 = slotTest.getGlobalPosition();
        const p1 = joinTo.getGlobalPosition();
        const distance = toDistance(p0, p1);
        if (distance < 20) {
          dragTarget.puzzle.parent.toLocal(
            { x: p1.x + offset.x, y: p1.y + offset.y },
            undefined,
            dragTarget.puzzle.position
          );

          // TODO merge 过程

          // 胜利条件判断
        }
      }
      app.stage.off("pointermove", onDragMove);
      dragTarget = null;
      const all_slot = Object.values(slots)
        .map((slot) => [slot.left, slot.right, slot.bottom, slot.top])
        .flat()
        .filter((slot) => (slot as any).joinTo);
      const isVictory = all_slot.every((slot) =>
        approximatelyEqual(
          slot.getGlobalPosition(),
          (slot as any).joinTo.getGlobalPosition()
        )
      );
      if (isVictory) {
        // alert("Victory!!!");
        borders.forEach(sp => sp.visible = false);
        hits.forEach(sp => sp.visible = false);
        nextButtons.forEach(sp => sp.visible = true);
        userIsVictory = true;
        console.log('Victory!!!');

      } else {
        borders.forEach(sp => sp.visible = true);
      }
    }
  }




}

function toDistance(p0: PIXI.Point, p1: PIXI.Point): number {
  const a = p0.x - p1.x;
  const b = p0.y - p1.y;
  return Math.sqrt(a * a + b * b);
}

function approximatelyEqual(p0: PIXI.Point, p1: PIXI.Point): boolean {
  return (
    Math.round(p0.x) === Math.round(p1.x) &&
    Math.round(p0.y) === Math.round(p1.y)
  );
}

main();
