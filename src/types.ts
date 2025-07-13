import {
  IntegerOverflowException,
  InvalidSquareRefException,
} from "./exceptions"

export type File =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type Piece = number & { __brand: "Piece" }

export function asPiece(value: number): Piece {
  if (value < 0 || value > 31) throw new IntegerOverflowException()
  return value as Piece
}

export function asFile(file: string): File {
  if (file.length !== 1 || file < "a" || file > "z")
    throw new InvalidSquareRefException(`Invalid file ref: ${file}`)
  return file as File
}

export function asRank(rank: string): Rank {
  if (rank.length !== 1)
    throw new InvalidSquareRefException(`Invalid rank ref: ${rank}`)
  const rankNum = parseInt(rank)
  if (rankNum < 1 || rankNum > 9)
    throw new InvalidSquareRefException(`Invalid rank ref: ${rank}`)
  return rankNum as Rank
}

export enum CharacterType {
  Lowercase,
  Uppercase,
  Number,
  Other,
}

export function characterType(char: string) {
  if ("0" <= char && char <= "9") return CharacterType.Number
  if ("a" <= char && char <= "z") return CharacterType.Lowercase
  if ("A" <= char && char <= "Z") return CharacterType.Uppercase
  return CharacterType.Other
}
