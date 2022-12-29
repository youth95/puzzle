export enum PuzzleType {
  LeftTop,
  CenterTop0,
  CenterTop1,
  RightTop,
  LeftCenter0,
  LeftCenter1,
  Center0,
  Center1,
  RightCenter1,
  RightCenter2,
  LeftBottom,
  CenterBottom0,
  CenterBottom1,
  RightBottom,
}

export enum UI {
  TableLeftTop,
  TableTop,
  TableRightTop,
  TableLeftCenter,
  TableCenter,
  TableRightCenter,
  TableLeftBottom,
  TableCenterBottom,
  TableRightBottom,

  MusicOpen,
  MusicClose,
  Ticker,
  Char_0,
  Char_1,
  Char_2,
  Char_3,
  Char_4,
  Char_5,
  Char_6,
  Char_7,
  Char_8,
  Char_9,
  Char_split,

  UpNext,
  Next,
  DownNext,
}

export interface GameContent {
  image: string;
  message: string;
}