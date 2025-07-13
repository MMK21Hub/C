import { encodeBase32 } from "./base32.js"
import {
  MemoryAccessViolation,
  InternalErrorException,
  CException,
  SevereNullPointerException,
  NullPointerException,
  IntegerOverflowException,
} from "./exceptions.js"
import {
  asFile,
  asRank,
  characterType,
  CharacterType,
  File,
  Piece,
  Rank,
} from "./types.js"

type Board = (Piece | null)[][]

export interface InterpreterConfig {
  ranks?: number
  files?: number
}

export class Interpreter {
  private board: Board
  private ranks: number
  private files: number

  constructor(config: InterpreterConfig = {}) {
    this.ranks = config.ranks || 8
    this.files = config.files || 8
    this.board = Array.from({ length: this.ranks }, () =>
      Array(this.files).fill(null)
    )
  }

  private squareToIndex(file: File, rank: Rank): [number, number] {
    // The array, when printed, should look like a chessboard from White's point of view.
    const row = 8 - rank
    const col = file.charCodeAt(0) - "a".charCodeAt(0)
    return [row, col]
  }

  private getPiece(file: File, rank: Rank): Piece | null {
    const [row, col] = this.squareToIndex(file, rank)
    const piece = this.board.at(row)?.at(col)
    if (piece === undefined)
      throw new MemoryAccessViolation(`${file}${rank}`, "Out of bounds")
    return piece
  }

  private getPieceFromRef(ref: string): Piece | null {
    if (ref.length !== 2)
      throw new InternalErrorException(`Invalid square ref length: ${ref}`)
    const [file, rank] = ref
    return this.getPiece(asFile(file), asRank(rank))
  }

  private throwPieceOff(ref: string) {
    const file = asFile(ref[0])
    const rank = asRank(ref[1])
    const [row, col] = this.squareToIndex(file, rank)
    this.board[row][col] = null
  }

  private performOperation(
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

  private executeInstruction(text: string): void | CException {
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

    return new InternalErrorException(`Unrecognized instruction: ${text}`)
  }

  run(code: string) {
    const instructions = code.split(/\s+/).filter(Boolean)
    if (instructions.length === 0) {
      console.warn("Warning: Empty program provided")
      return
    }
    for (const [index, text] of instructions.entries()) {
      const result = this.executeInstruction(text)
      if (result !== undefined) {
        console.error(
          `Uncaught exception at instruction ${index + 1}: ${result}`
        )
        return // Stop executing the program
      }
    }
  }

  dumpBoard(): Board {
    // Make a copy of the board object
    return this.board.map((row) => row.slice())
  }

  boardToFormattedString(): string {
    const lines: string[] = []
    const innerWidth = this.files * 2 - 1
    const topInnerPart = Array(this.files).fill("━━━").join("┳")
    lines.push("┏" + topInnerPart + "┓")
    this.board.forEach((row) => {
      const innerPart = row
        .map((piece) => " " + (piece ? encodeBase32(piece) : " ") + " ")
        .join("┃")
      lines.push("┃" + innerPart + "┃")
    })
    const bottomInnerPart = Array(this.files).fill("━━━").join("┻")
    lines.push("┗" + bottomInnerPart + "┛")
    return lines.join("\n")
  }
}
