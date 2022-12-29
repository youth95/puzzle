import './normal';
import { PuzzleGame } from './puzzle';
import { GameContent } from './types';

const contents: GameContent[] = [
  { image: "https://img2.baidu.com/it/u=1779174718,345053138&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800", message: '爱萍萍，爱生活' },
  { image: "https://img1.baidu.com/it/u=2271283456,3261625202&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=700", message: '你是我宝，永远是我宝' },
  { image: "https://img2.baidu.com/it/u=154011915,3804345797&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500", message: '木有人能阻止我娶你' },
  { image: "https://img2.baidu.com/it/u=4148937745,1719579896&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889", message: '想要与你一起写下些回忆' },
  { image: "https://img0.baidu.com/it/u=445910512,771978967&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=682", message: '只想和你，甜甜密密' },
  { image: "https://img0.baidu.com/it/u=3648443353,2807599189&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500", message: '所以暂时将你眼睛闭了起来' },
  { image: "https://img2.baidu.com/it/u=3144528619,622593927&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=890", message: '黑暗之中漂浮我的期待' },
  { image: "https://img0.baidu.com/it/u=2846768068,2651885784&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=375", message: '平静脸孔映着冰粉色彩' },
  { image: "https://img1.baidu.com/it/u=1151317848,1060405873&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=711", message: '让然好不期待' },
  { image: "https://img2.baidu.com/it/u=1448945965,110977978&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=833", message: '你给的爱～～爱～爱～' },
  { image: "https://img1.baidu.com/it/u=507405947,810578775&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500", message: '无助的等待' },
  { image: "https://img2.baidu.com/it/u=2142753991,1135904539&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500", message: '我可以假装很冷漠' },
  { image: "https://img2.baidu.com/it/u=734026512,2754017706&fm=253&fmt=auto&app=138&f=JPEG?w=553&h=387", message: '爱萍萍，爱生活' }
]



async function main() {
  PuzzleGame.contents = contents;
  await PuzzleGame.init();
  PuzzleGame.newGame();
}

main();
