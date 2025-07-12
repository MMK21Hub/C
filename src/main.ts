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
    super("IntegerOverflowException", message)
  }
}

export class NullPointerException extends CException {
  constructor(message?: string) {
    super("NullPointerException", message)
  }
}

export class SevereNullPointerException extends CException {
  constructor(message?: string) {
    super("SevereNullPointerException", message)
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
    super("InvalidSquareReferenceException", message)
  }
}

export class InternalErrorException extends CException {
  constructor(message?: string) {
    super("Internal interpreter error", message)
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

  squareToIndex(file: File, rank: Rank): [number, number] {
    // The array, when printed, should look like a chessboard from White's point of view.
    const row = 8 - rank
    const col = file.charCodeAt(0) - "a".charCodeAt(0)
    return [row, col]
  }

  getPiece(file: File, rank: Rank): Piece | null {
    const [row, col] = this.squareToIndex(file, rank)
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

  throwPieceOff(ref: string) {
    const file = asFile(ref[0])
    const rank = asRank(ref[1])
    const [row, col] = this.squareToIndex(file, rank)
    this.board[row][col] = null
  }

  performOperation(
    firstSquare: string,
    operator: string,
    secondSquare: string
  ): void | CException {
    const firstOperand = this.getPieceFromRef(firstSquare)
    const secondOperand = this.getPieceFromRef(secondSquare)
    if (firstOperand === null)
      throw new SevereNullPointerException(`${firstSquare} is null`)
    if (secondOperand === null)
      throw new NullPointerException(`${secondSquare} is null`)
    // TODO: Implement the operations :)
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
      // const result = this.performOperation(firstSquare, operator, secondSquare)
      try {
        this.performOperation(firstSquare, operator, secondSquare)
      } catch (exception) {
        if (!(exception instanceof CException)) throw exception
        if (
          // Including severe NPEs here wouldn't make sense, because then the first square would be null anyway.
          exception instanceof IntegerOverflowException ||
          exception instanceof NullPointerException
        ) {
          this.throwPieceOff(firstSquare) // Mistakes have consequences
        }
        return exception
      }
    }
  }

  run(code: string) {
    const instructions = code.split(/\s+/)
    instructions.forEach((text) => {
      const result = this.executeInstruction(text)
    })
  }
}
