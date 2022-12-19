import './normal';
import { PuzzleGame } from './puzzle';



async function main() {
  await PuzzleGame.init();
  PuzzleGame.newGame();
}

main();
