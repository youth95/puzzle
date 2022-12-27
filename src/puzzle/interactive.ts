import * as PIXI from 'pixi.js'
import { onVictory } from './onVictory';
import { PuzzleGame } from './PuzzleGame';

export function initInteractive() {
  PuzzleGame.app.stage.on("pointerleave", onDragEnd);
  PuzzleGame.app.stage.on("pointerup", onDragEnd);
}

export function onDragMove(event: PIXI.FederatedPointerEvent) {
  if (PuzzleGame.dragTarget) {
    PuzzleGame.dragTarget.render.parent.toLocal(
      event.global,
      undefined,
      PuzzleGame.dragTarget.render.position
    );
  }
}

export function onDragEnd() {
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
        // 将位置调整到合理的位置
        PuzzleGame.dragTarget.render.parent.toLocal(
          { x: p1.x + offset.x, y: p1.y + offset.y },
          undefined,
          PuzzleGame.dragTarget.render.position
        );
      }
    }
    PuzzleGame.app.stage.off("pointermove", onDragMove);
    PuzzleGame.dragTarget = null;

    // 判断胜利条件

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
      onVictory();
    } else {
      PuzzleGame.borders.forEach(sp => sp.visible = true);
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