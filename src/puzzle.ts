import * as PIXI from 'pixi.js';
import { initAssets } from './assets';
import { PuzzleType, UI } from './types';

class PuzzleJoin {
  joinTo?: PuzzleJoin;
  offset?: PIXI.Point;
  render: PIXI.Sprite;

  constructor(public belong: Puzzle) { }

  join(puzzleJoin: PuzzleJoin, x: number, y: number) {
    this.joinTo = puzzleJoin;
    this.offset = new PIXI.Point(x, y);
  }
}

export class Puzzle {
  left = new PuzzleJoin(this);
  right = new PuzzleJoin(this);
  top = new PuzzleJoin(this);
  bottom = new PuzzleJoin(this);

  render: PIXI.Container;


  constructor(
    public readonly posX: number,
    public readonly posY: number,
    public readonly type: PuzzleType,
  ) {
    this.render = new PuzzleRender(this);
  }

  static makePuzzles(row: number, col: number): Puzzle[][] {
    const result: Puzzle[][] = [];
    // 生成puzzle
    for (let i = 0; i < row; i++) {
      const cols: Puzzle[] = [];
      for (let j = 0; j < col; j++) {
        const puzzleType = Puzzle.toPuzzleType(i, j, row, col);
        const puzzle = new Puzzle(i, j, puzzleType);
        PuzzleGame.puzzles[`${i}_${j}`] = puzzle;
        cols.push(puzzle);
      }
      result.push(cols);
    }
    // 设置 puzzle join
    for (let i = 0; i < row; i++)
      for (let j = 0; j < col; j++) {
        const puzzleType = Puzzle.toPuzzleType(i, j, row, col);
        if ([PuzzleType.LeftTop].includes(puzzleType)) {
          // 左上角
          PuzzleGame.puzzles[`${i}_${j}`].right.join(PuzzleGame.puzzles[`${i + 1}_${j}`].left, -32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].bottom.join(PuzzleGame.puzzles[`${i}_${j + 1}`].top, 0, -32);
        } else if (
          [PuzzleType.CenterTop0, PuzzleType.CenterTop1].includes(puzzleType) // 上边
        ) {
          // join(slots[`${i}_${j}`].left, slots[`${i - 1}_${j}`].right, 32, 0);
          // join(slots[`${i}_${j}`].right, slots[`${i + 1}_${j}`].left, -32, 0);
          // join(slots[`${i}_${j}`].bottom, slots[`${i}_${j + 1}`].top, 0, -32);

          PuzzleGame.puzzles[`${i}_${j}`].left.join(PuzzleGame.puzzles[`${i - 1}_${j}`].right, 32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].right.join(PuzzleGame.puzzles[`${i + 1}_${j}`].left, -32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].bottom.join(PuzzleGame.puzzles[`${i}_${j + 1}`].top, 0, -32);

        } else if ([PuzzleType.RightTop].includes(puzzleType)) {
          // 右上角
          // join(slots[`${i}_${j}`].left, slots[`${i - 1}_${j}`].right, 32, 0);
          // join(slots[`${i}_${j}`].bottom, slots[`${i}_${j + 1}`].top, 0, -32);

          PuzzleGame.puzzles[`${i}_${j}`].left.join(PuzzleGame.puzzles[`${i - 1}_${j}`].right, 32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].bottom.join(PuzzleGame.puzzles[`${i}_${j + 1}`].top, 0, -32);


        } else if ([PuzzleType.LeftBottom].includes(puzzleType)) {
          // 左下角
          // join(slots[`${i}_${j}`].right, slots[`${i + 1}_${j}`].left, -32, 0);
          // join(slots[`${i}_${j}`].top, slots[`${i}_${j - 1}`].bottom, 0, 32);
          PuzzleGame.puzzles[`${i}_${j}`].right.join(PuzzleGame.puzzles[`${i + 1}_${j}`].left, -32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].top.join(PuzzleGame.puzzles[`${i}_${j - 1}`].bottom, 0, 32);


        } else if ([PuzzleType.RightBottom].includes(puzzleType)) {
          // 右下角
          // join(slots[`${i}_${j}`].left, slots[`${i - 1}_${j}`].right, 32, 0);
          // join(slots[`${i}_${j}`].top, slots[`${i}_${j - 1}`].bottom, 0, 32);
          PuzzleGame.puzzles[`${i}_${j}`].left.join(PuzzleGame.puzzles[`${i - 1}_${j}`].right, 32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].top.join(PuzzleGame.puzzles[`${i}_${j - 1}`].bottom, 0, 32);
        } else if (
          [PuzzleType.LeftCenter0, PuzzleType.LeftCenter1].includes(puzzleType) // 左边
        ) {
          // join(slots[`${i}_${j}`].top, slots[`${i}_${j - 1}`].bottom, 0, 32);
          // join(slots[`${i}_${j}`].right, slots[`${i + 1}_${j}`].left, -32, 0);
          // join(slots[`${i}_${j}`].bottom, slots[`${i}_${j + 1}`].top, 0, -32);
          PuzzleGame.puzzles[`${i}_${j}`].top.join(PuzzleGame.puzzles[`${i}_${j - 1}`].bottom, 0, 32);
          PuzzleGame.puzzles[`${i}_${j}`].right.join(PuzzleGame.puzzles[`${i + 1}_${j}`].left, -32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].bottom.join(PuzzleGame.puzzles[`${i}_${j + 1}`].top, 0, -32);


        } else if (
          [PuzzleType.RightCenter1, PuzzleType.RightCenter2].includes(puzzleType) // 右边
        ) {
          // join(slots[`${i}_${j}`].left, slots[`${i - 1}_${j}`].right, 32, 0);
          // join(slots[`${i}_${j}`].bottom, slots[`${i}_${j + 1}`].top, 0, -32);
          // join(slots[`${i}_${j}`].top, slots[`${i}_${j - 1}`].bottom, 0, 32);
          PuzzleGame.puzzles[`${i}_${j}`].left.join(PuzzleGame.puzzles[`${i - 1}_${j}`].right, 32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].bottom.join(PuzzleGame.puzzles[`${i}_${j + 1}`].top, 0, -32);
          PuzzleGame.puzzles[`${i}_${j}`].top.join(PuzzleGame.puzzles[`${i}_${j - 1}`].bottom, 0, 32);
        } else if (
          // 下边
          [PuzzleType.CenterBottom0, PuzzleType.CenterBottom1].includes(
            puzzleType
          )
        ) {
          // join(slots[`${i}_${j}`].left, slots[`${i - 1}_${j}`].right, 32, 0);
          // join(slots[`${i}_${j}`].top, slots[`${i}_${j - 1}`].bottom, 0, 32);
          // join(slots[`${i}_${j}`].right, slots[`${i + 1}_${j}`].left, -32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].left.join(PuzzleGame.puzzles[`${i - 1}_${j}`].right, 32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].top.join(PuzzleGame.puzzles[`${i}_${j - 1}`].bottom, 0, 32);
          PuzzleGame.puzzles[`${i}_${j}`].right.join(PuzzleGame.puzzles[`${i + 1}_${j}`].left, -32, 0);

        } else {
          // 中间
          // join(slots[`${i}_${j}`].left, slots[`${i - 1}_${j}`].right, 32, 0);
          // join(slots[`${i}_${j}`].bottom, slots[`${i}_${j + 1}`].top, 0, -32);
          // join(slots[`${i}_${j}`].top, slots[`${i}_${j - 1}`].bottom, 0, 32);
          // join(slots[`${i}_${j}`].right, slots[`${i + 1}_${j}`].left, -32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].left.join(PuzzleGame.puzzles[`${i - 1}_${j}`].right, 32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].bottom.join(PuzzleGame.puzzles[`${i}_${j + 1}`].top, 0, -32);
          PuzzleGame.puzzles[`${i}_${j}`].top.join(PuzzleGame.puzzles[`${i}_${j - 1}`].bottom, 0, 32);
          PuzzleGame.puzzles[`${i}_${j}`].right.join(PuzzleGame.puzzles[`${i + 1}_${j}`].left, -32, 0);
        }
      }



    return result;
  }

  static toPuzzleType(i: number, j: number, row: number, col: number) {
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
  }
}

class PuzzleRender extends PIXI.Container {

  static SIZE = 64;

  hit: PIXI.Sprite;

  constructor(public readonly puzzle: Puzzle) {
    super();
    this.build(puzzle.posX, puzzle.posY);
  }

  build(x: number, y: number) {
    const puzzleType = this.puzzle.type;
    const puzzleMask = PuzzleGame.puzzleMasks[puzzleType]();
    puzzleMask.anchor.set(0.5);
    puzzleMask.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
    const puzzleBoarder = PuzzleGame.puzzleBorders[puzzleType]();
    puzzleBoarder.alpha = 0.5;
    PuzzleGame.borders.push(puzzleBoarder);
    puzzleBoarder.anchor.set(0.5);
    puzzleBoarder.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
    const puzzle = new PIXI.Container();

    const slotLeft = new PIXI.Sprite();
    slotLeft.tint = 0x0010ff;
    slotLeft.x = -32;
    this.puzzle.left.render = slotLeft;
    const slotTop = new PIXI.Sprite();
    slotTop.tint = 0x8810ff;
    slotTop.y = -32;
    this.puzzle.top.render = slotTop;

    const slotRight = new PIXI.Sprite();
    slotRight.tint = 0x5590ff;
    slotRight.x = 32;
    this.puzzle.right.render = slotRight;

    const slotBottom = new PIXI.Sprite();
    slotBottom.tint = 0x92f0ff;
    slotBottom.y = 32;
    this.puzzle.bottom.render = slotBottom;

    [slotLeft, slotTop, slotRight, slotBottom].forEach((slot) => {
      slot.anchor.set(0.5);
      slot.hitArea = new PIXI.Rectangle();
      slot.alpha = 0;
    });

    const hit = new PIXI.Sprite();
    PuzzleGame.hits.push(hit);
    hit.tint = 0xff0fff;
    hit.alpha = 0;
    hit.width = PuzzleRender.SIZE - 8;
    hit.height = PuzzleRender.SIZE - 8;
    hit.anchor.set(0.5);
    this.hit = hit;

    const contentLayer = new PIXI.Sprite(PuzzleGame.content);
    contentLayer.scale.set(PuzzleGame.contentWidthScale, PuzzleGame.contentHeightScale);

    contentLayer.x -= 33;
    contentLayer.x -= x * PuzzleRender.SIZE;
    contentLayer.y -= 33;
    contentLayer.y -= y * PuzzleRender.SIZE;

    puzzle.addChild(puzzleMask);
    puzzle.addChild(contentLayer);


    contentLayer.mask = puzzleMask;
    puzzle.cacheAsBitmap = true;
    puzzle.hitArea = new PIXI.Rectangle(0, 0, 0, 0);

    this.addChild(puzzle);
    this.addChild(puzzleBoarder);
    this.addChild(hit);
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
      Object.assign(slot, { pos: `${x}_${y}` }), this.addChild(slot);
    });

    // r.x += 34 + SIZE * x;
    // r.y += 34 + SIZE * y;

    this.x = 34 + Math.random() * (PuzzleGame.app.screen.width / 2 - PuzzleRender.SIZE * 4);
    this.y = 34 + Math.random() * (PuzzleGame.app.screen.height / 2 - PuzzleRender.SIZE * 4);

    hit.interactive = true;

    hit.on("pointerdown", (event) => {
      PuzzleGame.dragTarget = this.puzzle;
      this.zIndex = -1;
      PuzzleGame.dragTarget.render.parent.toLocal(
        event.global,
        undefined,
        PuzzleGame.dragTarget.render.position
      );
      PuzzleGame.app.stage.on("pointermove", onDragMove);
    });

    function onDragMove(event) {
      if (PuzzleGame.dragTarget) {
        PuzzleGame.dragTarget.render.parent.toLocal(
          event.global,
          undefined,
          PuzzleGame.dragTarget.render.position
        );
      }
    }
    PuzzleGame.app.stage.on("pointerleave", onDragEnd);
    PuzzleGame.app.stage.on("pointerup", onDragEnd);
    function onDragEnd() {
      if (PuzzleGame.dragTarget) {
        const puzzleJoins = [
          PuzzleGame.dragTarget.left,
          PuzzleGame.dragTarget.right,
          PuzzleGame.dragTarget.top,
          PuzzleGame.dragTarget.bottom,
        ].filter(join => join.joinTo);

        for (const slotTest of puzzleJoins) {
          const joinTo = slotTest.joinTo!;
          const offset = slotTest?.offset!;
          const p0 = slotTest.render.getGlobalPosition();
          const p1 = joinTo.render.getGlobalPosition();

          const distance = toDistance(p0, p1);
          if (distance < 20) {
            PuzzleGame.dragTarget.render.parent.toLocal(
              { x: p1.x + offset.x, y: p1.y + offset.y },
              undefined,
              PuzzleGame.dragTarget.render.position
            );
          }
        }
        PuzzleGame.app.stage.off("pointermove", onDragMove);
        PuzzleGame.dragTarget = null;
        const all_slot = Object.values(PuzzleGame.puzzles)
          .map((slot) => [slot.left, slot.right, slot.bottom, slot.top])
          .flat()
          .filter((slot) => slot.joinTo);
        const isVictory = all_slot.every((slot) =>
          approximatelyEqual(
            slot.render.getGlobalPosition(),
            slot.joinTo!.render.getGlobalPosition()
          )
        );
        if (isVictory) {
          // alert("Victory!!!");
          PuzzleGame.borders.forEach(sp => sp.visible = false);
          PuzzleGame.hits.forEach(sp => sp.visible = false);
          PuzzleGame.nextButtons.forEach(sp => sp.visible = true);
          PuzzleGame.userIsVictory = true;
          console.log('Victory!!!');

        } else {
          PuzzleGame.borders.forEach(sp => sp.visible = true);
        }
      }
    }
  }
}


export class PuzzleGame {
  static puzzleMasks: Record<PuzzleType, () => PIXI.Sprite>;
  static puzzleBorders: Record<PuzzleType, () => PIXI.Sprite>;
  static borders: PIXI.Sprite[] = [];
  static hits: PIXI.Sprite[] = [];
  static nextButtons: PIXI.Sprite[] = [];
  static content: PIXI.Texture;
  static contentWidthScale: number;
  static contentHeightScale: number;
  static puzzles: Record<string, Puzzle> = {};
  static dragTarget: Puzzle | null;
  static app: PIXI.Application;
  static audio = new Audio('bgm.mp3');
  static userIsVictory: boolean = false;
  static row: number;
  static col: number;
  static timeCounter: number = 0;

  static contents: string[] = [
    "https://img2.baidu.com/it/u=1779174718,345053138&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800",
    "https://img1.baidu.com/it/u=2271283456,3261625202&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=700",
    "https://img2.baidu.com/it/u=154011915,3804345797&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500",
    "https://img2.baidu.com/it/u=4148937745,1719579896&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889",
    "https://img0.baidu.com/it/u=445910512,771978967&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=682",
    "https://img0.baidu.com/it/u=3648443353,2807599189&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500",
    "https://img2.baidu.com/it/u=3144528619,622593927&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=890",
    "https://img0.baidu.com/it/u=2846768068,2651885784&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=375",
    "https://img1.baidu.com/it/u=1151317848,1060405873&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=711",
    "https://img2.baidu.com/it/u=1448945965,110977978&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=833",
    "https://img1.baidu.com/it/u=507405947,810578775&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500",
    "https://img2.baidu.com/it/u=2142753991,1135904539&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
    "https://img2.baidu.com/it/u=734026512,2754017706&fm=253&fmt=auto&app=138&f=JPEG?w=553&h=387"
  ]

  static randomFetchContent() {
    const len = PuzzleGame.contents.length;
    return PuzzleGame.contents[Math.min(Math.round(Math.random() * len), len - 1)];
  }

  static async init() {
    const { puzzleMasks, puzzleBorders, uis } = await initAssets()
    const content = await PIXI.Texture.fromURL(PuzzleGame.randomFetchContent());
    PuzzleGame.audio.loop = true;
    PuzzleGame.puzzleMasks = puzzleMasks;
    PuzzleGame.puzzleBorders = puzzleBorders;
    PuzzleGame.setup(content, 3, 3);
    const { clientHeight, clientWidth } = window.document.body;
    const app = new PIXI.Application({
      background: "#0ab6f9",
      width: clientWidth,
      height: clientHeight,
    });
    PuzzleGame.app = app;
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

    app.ticker.add(dt => {
      if (!PuzzleGame.userIsVictory) {
        PuzzleGame.timeCounter += 1 / dt;
        const s = Math.floor((PuzzleGame.timeCounter / 60) % 60);
        const m = Math.floor((PuzzleGame.timeCounter / 60 - s) / 60);
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
        PuzzleGame.audio.play();
        musicUI.texture = uis[UI.MusicOpen];
      } else {
        PuzzleGame.audio.pause();
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
    const hide = () => nextButtons.forEach(sp => sp.visible = false);
    upNext.x -= 64 + 12;
    downNext.x += 64 + 12;
    upNext.interactive = true;
    upNext.addEventListener('pointerdown', async () => {
      let col = PuzzleGame.col;
      let row = PuzzleGame.row;
      if (PuzzleGame.row > PuzzleGame.col) {
        col += 2;
      } else {
        row += 2;
      }
      const content = await PIXI.Texture.fromURL(PuzzleGame.randomFetchContent());
      PuzzleGame.setup(content, row, col);
      PuzzleGame.newGame();
      hide();
    });
    next.interactive = true;
    next.addEventListener('pointerdown', async () => {
      let col = PuzzleGame.col;
      let row = PuzzleGame.row;
      const content = await PIXI.Texture.fromURL(PuzzleGame.randomFetchContent());
      PuzzleGame.setup(content, row, col);
      PuzzleGame.newGame();
      hide();
    });

    downNext.interactive = true;
    downNext.addEventListener('pointerdown', async () => {
      let col = PuzzleGame.col;
      let row = PuzzleGame.row;
      if (PuzzleGame.row < PuzzleGame.col) {
        col = Math.max(3, col - 2);
      } else {
        row = Math.max(3, row - 2);
      }
      const content = await PIXI.Texture.fromURL(PuzzleGame.randomFetchContent());
      PuzzleGame.setup(content, row, col);
      PuzzleGame.newGame();
      hide();
    });
    PuzzleGame.nextButtons = nextButtons;

    // next end

  }

  static setup(content: PIXI.Texture, row: number, col: number) {
    PuzzleGame.row = row;
    PuzzleGame.col = col;
    PuzzleGame.content = content;
    PuzzleGame.contentWidthScale = (PuzzleGame.row * PuzzleRender.SIZE) / content.width;
    PuzzleGame.contentHeightScale = (PuzzleGame.col * PuzzleRender.SIZE) / content.height;
    PuzzleGame.userIsVictory = false;
    PuzzleGame.timeCounter = 0;

  }

  static container = new PIXI.Container();

  static newGame() {
    this.container.removeChildren();
    const puzzles = Puzzle.makePuzzles(PuzzleGame.row, PuzzleGame.col).flat();
    puzzles.forEach(puzzle => {
      this.container.addChild(puzzle.render);
    });
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
    this.container.x = PuzzleGame.app.screen.width / 2;
    this.container.y = PuzzleGame.app.screen.height / 2;
    PuzzleGame.app.stage.addChild(this.container);
    PuzzleGame.app.stage.interactive = true;
    PuzzleGame.app.stage.hitArea = PuzzleGame.app.screen;
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
