import { File, Rank } from "./types"

type Piece = number & { __brand: "Piece" }

export class CException {
  name: string
  message?: string

  constructor(name: string, message?: string) {
    this.name = name
    this.message = message
  }

  toString() {
    return this.message ? `${this.name}: ${this.message}` : this.name
  }
}

export class IntegerOverflowException extends CException {
  constructor(message?: string) {
    super("IntegerOverflowError", message)
  }
}

export class MemoryAccessViolation extends CException {
  constructor(memoryRef: string, message?: string) {
    super(
      "MemoryAccessViolation",
      `${message || "Invalid memory access"}: ${memoryRef}`
    )
  }
}

export class InvalidSquareRefException extends CException {
  constructor(message?: string) {
    super("InvalidSquareReferenceError", message)
  }
}

export class InternalErrorException extends CException {
  constructor(message?: string) {
    super("InternalError", message)
  }
}

function asPiece(value: number): Piece {
  if (value < 0 || value > 31) throw new IntegerOverflowException()
  return value as Piece
}

function asFile(file: string): File {
  if (file.length !== 1 || file < "a" || file > "z")
    throw new InvalidSquareRefException(`Invalid file ref: ${file}`)
  return file as File
}

function asRank(rank: string): Rank {
  if (rank.length !== 1)
    throw new InvalidSquareRefException(`Invalid rank ref: ${rank}`)
  const rankNum = parseInt(rank)
  if (rankNum < 1 || rankNum > 9)
    throw new InvalidSquareRefException(`Invalid rank ref: ${rank}`)
  return rankNum as Rank
}

enum CharacterType {
  Lowercase,
  Uppercase,
  Number,
  Other,
}

function characterType(char: string) {
  if ("0" <= char && char <= "9") return CharacterType.Number
  if ("a" <= char && char <= "z") return CharacterType.Lowercase
  if ("A" <= char && char <= "Z") return CharacterType.Uppercase
  return CharacterType.Other
}

class Interpreter {
  board: (Piece | null)[][] = Array.from({ length: 8 }, () =>
    Array(8).fill(null)
  )

  getPiece(file: File, rank: Rank): Piece | null {
    // The array, when printed, should look like a chessboard from White's point of view.
    const row = 8 - rank
    const col = file.charCodeAt(0) - "a".charCodeAt(0)
    const piece = this.board.at(row)?.at(col)
    if (piece === undefined)
      throw new MemoryAccessViolation(`${file}${rank}`, "Out of bounds")
    return piece
  }

  getPieceFromRef(ref: string): Piece | null {
    if (ref.length !== 2)
      throw new InternalErrorException(`Invalid square ref length: ${ref}`)
    const [file, rank] = ref
    return this.getPiece(asFile(file), asRank(rank))
  }

  executeInstruction(text: string): void | CException {
    const firstChar = text[0]
    const secondChar = text[1]
    const firstCharType = characterType(firstChar)
    const secondCharType = characterType(secondChar)

    // If instruction starts with a square reference, it's an operation
    const isOperation =
      firstCharType === CharacterType.Lowercase &&
      secondCharType === CharacterType.Lowercase &&
      text.length > 4
    if (isOperation) {
      const firstSquare = text.slice(0, 2)
      const operator = text.slice(2, -2)
      const secondSquare = text.slice(-2)
      const firstOperand = this.getPieceFromRef(firstSquare)
      const secondOperand = this.getPieceFromRef(secondSquare)
    }
  }

  run(code: string) {
    const instructions = code.split(/\s+/)
    instructions.forEach((text) => {
      const result = this.executeInstruction(text)
    })
  }
}
