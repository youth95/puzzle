import * as PIXI from 'pixi.js'
import { PuzzleGame } from './puzzle';
import { UI } from './types';

export class Timer extends PIXI.Container {

  time = new PIXI.Text('00:00', {
    fill: '#fff',
    fontSize: 42,
  });

  tickerUI: PIXI.Sprite;

  constructor(uis: PIXI.utils.Dict<PIXI.Texture<PIXI.Resource>>) {
    super();
    this.time.anchor.set(0.5);
    this.time.y -= 24;
    this.tickerUI = new PIXI.Sprite(uis[UI.Ticker]);
    this.tickerUI.anchor.set(0.5);
    this.addChild(this.tickerUI);
    this.addChild(this.time);
  }

  ticker = (dt: number) => {
    if (!PuzzleGame.userIsVictory) {
      PuzzleGame.timeCounter += 1 / dt;
      const s = Math.floor((PuzzleGame.timeCounter / 60) % 60);
      const m = Math.floor((PuzzleGame.timeCounter / 60 - s) / 60);
      this.time.text = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
  }


}