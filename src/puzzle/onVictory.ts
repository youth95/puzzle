import * as PIXI from 'pixi.js';
import { PuzzleGame } from "./PuzzleGame";
import { Easing, Tween, } from '@tweenjs/tween.js';

export function onVictory() {
  PuzzleGame.borders.forEach(sp => sp.visible = false);
  PuzzleGame.hits.forEach(sp => sp.visible = false);
  PuzzleGame.nextButtons.forEach(sp => sp.visible = true);
  PuzzleGame.userIsVictory = true;
  const bounds = PuzzleGame.container.getBounds();
  const dx = PuzzleGame.container.x - bounds.x;
  const dy = PuzzleGame.container.y - bounds.y;
  PuzzleGame.container.x = bounds.x
  PuzzleGame.container.y = bounds.y

  const { width, height } = PuzzleGame.app.screen;
  const toX = (width - bounds.width / PuzzleGame.contentWidthScale) / 2;
  const toY = (height - bounds.height / PuzzleGame.contentHeightScale) / 2;
  PuzzleGame.container.children.forEach(item => {
    item.x += dx;
    item.y += dy;
  });

  PuzzleGame.container.visible = false;

  const CG = new PIXI.Sprite(PuzzleGame.content);
  CG.x = PuzzleGame.container.x;
  CG.y = PuzzleGame.container.y;
  CG.scale.set(PuzzleGame.contentWidthScale, PuzzleGame.contentHeightScale);
  PuzzleGame.app.stage.addChildAt(CG, 1);
  PuzzleGame.CG = CG;

  new Tween({
    x: PuzzleGame.container.x,
    y: PuzzleGame.container.y,
    scaleX: PuzzleGame.contentWidthScale,
    scaleY: PuzzleGame.contentHeightScale,
  }).to({
    x: toX,
    y: toY,
    scaleX: 1,
    scaleY: 1,
  }, 2000)
    .easing(Easing.Quadratic.Out)
    .onUpdate(({ x, y, scaleX, scaleY }) => {
      CG.x = x;
      CG.y = y;
      CG.scale.set(scaleX, scaleY);
    }).start();

  console.log('Victory!!!');
}