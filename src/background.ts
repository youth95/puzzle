import * as PIXI from 'pixi.js';
import { UI } from './types';

export class Background extends PIXI.Container {

  constructor(width: number, height: number, uis: PIXI.utils.Dict<PIXI.Texture<PIXI.Resource>>) {
    super()
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
        this.addChild(sprite);
      }

  }
}