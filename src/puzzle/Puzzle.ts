import * as PIXI from 'pixi.js'
import { PuzzleType } from '../types';
import { PuzzleGame } from './PuzzleGame';
import { PuzzleRender } from './PuzzleRender';

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
          PuzzleGame.puzzles[`${i}_${j}`].left.join(PuzzleGame.puzzles[`${i - 1}_${j}`].right, 32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].right.join(PuzzleGame.puzzles[`${i + 1}_${j}`].left, -32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].bottom.join(PuzzleGame.puzzles[`${i}_${j + 1}`].top, 0, -32);
        } else if ([PuzzleType.RightTop].includes(puzzleType)) {
          // 右上角
          PuzzleGame.puzzles[`${i}_${j}`].left.join(PuzzleGame.puzzles[`${i - 1}_${j}`].right, 32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].bottom.join(PuzzleGame.puzzles[`${i}_${j + 1}`].top, 0, -32);
        } else if ([PuzzleType.LeftBottom].includes(puzzleType)) {
          // 左下角
          PuzzleGame.puzzles[`${i}_${j}`].right.join(PuzzleGame.puzzles[`${i + 1}_${j}`].left, -32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].top.join(PuzzleGame.puzzles[`${i}_${j - 1}`].bottom, 0, 32);
        } else if ([PuzzleType.RightBottom].includes(puzzleType)) {
          // 右下角
          PuzzleGame.puzzles[`${i}_${j}`].left.join(PuzzleGame.puzzles[`${i - 1}_${j}`].right, 32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].top.join(PuzzleGame.puzzles[`${i}_${j - 1}`].bottom, 0, 32);
        } else if (
          [PuzzleType.LeftCenter0, PuzzleType.LeftCenter1].includes(puzzleType) // 左边
        ) {
          PuzzleGame.puzzles[`${i}_${j}`].top.join(PuzzleGame.puzzles[`${i}_${j - 1}`].bottom, 0, 32);
          PuzzleGame.puzzles[`${i}_${j}`].right.join(PuzzleGame.puzzles[`${i + 1}_${j}`].left, -32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].bottom.join(PuzzleGame.puzzles[`${i}_${j + 1}`].top, 0, -32);
        } else if (
          [PuzzleType.RightCenter1, PuzzleType.RightCenter2].includes(puzzleType) // 右边
        ) {
          PuzzleGame.puzzles[`${i}_${j}`].left.join(PuzzleGame.puzzles[`${i - 1}_${j}`].right, 32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].bottom.join(PuzzleGame.puzzles[`${i}_${j + 1}`].top, 0, -32);
          PuzzleGame.puzzles[`${i}_${j}`].top.join(PuzzleGame.puzzles[`${i}_${j - 1}`].bottom, 0, 32);
        } else if (
          // 下边
          [PuzzleType.CenterBottom0, PuzzleType.CenterBottom1].includes(
            puzzleType
          )
        ) {
          PuzzleGame.puzzles[`${i}_${j}`].left.join(PuzzleGame.puzzles[`${i - 1}_${j}`].right, 32, 0);
          PuzzleGame.puzzles[`${i}_${j}`].top.join(PuzzleGame.puzzles[`${i}_${j - 1}`].bottom, 0, 32);
          PuzzleGame.puzzles[`${i}_${j}`].right.join(PuzzleGame.puzzles[`${i + 1}_${j}`].left, -32, 0);
        } else {
          // 中间
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
