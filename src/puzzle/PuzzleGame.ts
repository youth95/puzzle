import * as PIXI from 'pixi.js';
import { initAssets } from '../assets';
import { Background } from '../background';
import { Timer } from '../Timer';
import { PuzzleType, UI } from "../types";
import { Puzzle } from './Puzzle';
import { PuzzleRender } from './PuzzleRender';
import { update } from '@tweenjs/tween.js';
import { initInteractive } from './interactive';


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
  static CG: PIXI.Sprite;

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
    const { width, height } = app.screen;
    app.stage.addChild(new Background(width, height, uis));
    // ticker
    const timer = new Timer(uis);
    timer.x = app.screen.width / 2;
    timer.y = 64 * 2;
    app.stage.addChild(timer);
    app.ticker.add(timer.ticker);

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

    initInteractive();

    const animation = (dt: number) => {
      update(dt);
      requestAnimationFrame(animation);
    }
    requestAnimationFrame(animation);
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
    this.container.scale.set(1);
    this.container.visible = true;
    this.app.stage.removeChild(PuzzleGame.CG);
    const puzzles = Puzzle.makePuzzles(PuzzleGame.row, PuzzleGame.col).flat();
    puzzles.forEach(puzzle => {
      this.container.addChild(puzzle.render);
    });
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
    this.container.x = PuzzleGame.app.screen.width / 2;
    this.container.y = PuzzleGame.app.screen.height / 2;
    PuzzleGame.app.stage.addChildAt(this.container, 1);
    PuzzleGame.app.stage.interactive = true;
    PuzzleGame.app.stage.hitArea = PuzzleGame.app.screen;
  }
}