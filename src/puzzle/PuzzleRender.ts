import * as PIXI from 'pixi.js'
import { PuzzleType } from '../types';
import { onDragMove } from './interactive';
import { onVictory } from './onVictory';
import { Puzzle } from './Puzzle';
import { PuzzleGame } from './PuzzleGame';

export class PuzzleRender extends PIXI.Container {

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

    // this.x += 34 + PuzzleRender.SIZE * x;
    // this.y += 34 + PuzzleRender.SIZE * y;

    this.x = 34 + Math.random() * (PuzzleGame.app.screen.width / 2 - PuzzleRender.SIZE * 4);
    this.y = 34 + Math.random() * (PuzzleGame.app.screen.height / 2 - PuzzleRender.SIZE * 4);

    hit.interactive = true;

    hit.on("pointerdown", this.pointerdown);
  }

  pointerdown = (event: PIXI.FederatedPointerEvent) => {
    PuzzleGame.dragTarget = this.puzzle;
    PuzzleGame.dragTarget.render.parent.toLocal(
      event.global,
      undefined,
      PuzzleGame.dragTarget.render.position
    );
    PuzzleGame.app.stage.on("pointermove", onDragMove);
  }
}