import * as PIXI from 'pixi.js';
import { PuzzleGame } from "./PuzzleGame";
import { Easing, Tween, } from '@tweenjs/tween.js';
import { Texture } from 'pixi.js';

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
    })
    .onComplete(() => {
      const textContainer = new PIXI.Container();
      PuzzleGame.CGTextMessage = textContainer;
      const text = new PIXI.Text(PuzzleGame.message, {
        fill: '#fff',
        fontSize: 48,
      });
      const bounds = text.getBounds();
      const bg = new PIXI.Sprite(Texture.WHITE);
      bg.width = bounds.width;
      bg.height = bounds.height;
      bg.tint = 0x0f89d2;
      textContainer.addChild(bg,text);
      PuzzleGame.app.stage.addChildAt(textContainer, 2);

      textContainer.alpha = 0;
      textContainer.x = (PuzzleGame.app.screen.width - bounds.width) / 2;;
      textContainer.y = (PuzzleGame.app.screen.height - bounds.height) / 2;
      new Tween({ x: textContainer.x, y: textContainer.y, alpha: 0 }).to({
        x: textContainer.x,
        y: textContainer.y + 200,
        alpha: 1,
      }, 1000).easing(Easing.Quadratic.Out)
        .onUpdate(({ x, y, alpha }) => {
          textContainer.x = x;
          textContainer.y = y;
          textContainer.alpha = alpha;
        }).start()
    })
    .start();

  console.log('Victory!!!');
}