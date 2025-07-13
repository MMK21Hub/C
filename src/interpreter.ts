import { decodeBase32, encodeBase32, InvalidBase32Exception } from "./base32.js"
import {
  MemoryAccessViolation,
  InternalErrorException,
  CException,
  SevereNullPointerException,
  NullPointerException,
  IntegerOverflowException,
  InvalidPieceRepresentationException,
  PieceCollisionCrash,
  InvalidOperatorException,
  DivisionByZeroException,
} from "./exceptions.js"
import { logarithm, tetrate } from "./math.js"
import {
  asFile,
  asPiece,
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

  private computeOperation(
    firstOperand: Piece,
    operator: string,
    secondOperand: Piece
  ): Piece {
    switch (operator) {
      // Arithmetic operations
      case "+":
        return asPiece(firstOperand + secondOperand)
      case "-":
        return asPiece(firstOperand - secondOperand)
      case "*":
        return asPiece(firstOperand * secondOperand)
      case "/":
        if (secondOperand === 0) throw new DivisionByZeroException()
        return asPiece(Math.floor(firstOperand / secondOperand))
      case "%":
        return asPiece(firstOperand % secondOperand)
      case "**":
        return asPiece(firstOperand ** secondOperand)
      case "***":
        return tetrate(firstOperand, secondOperand)
      case "log":
        return asPiece(logarithm(firstOperand, secondOperand))
      case "throot":
        return asPiece(firstOperand ** (1 / secondOperand))
      // Bitwise operations
      case "&":
        return asPiece(firstOperand & secondOperand)
      case "|":
        return asPiece(firstOperand | secondOperand)
      case "^":
        return asPiece(firstOperand ^ secondOperand)
      case "<<":
        return asPiece(firstOperand << secondOperand)
      case ">>":
        return asPiece(firstOperand >> secondOperand)
      // Boolean operations
      case "&&":
        return asPiece(firstOperand && secondOperand ? 1 : 0)
      case "||":
        return asPiece(firstOperand || secondOperand ? 1 : 0)
      // Comparative operations
      case "==":
        return asPiece(firstOperand === secondOperand ? 1 : 0)
      case "!=":
        return asPiece(firstOperand !== secondOperand ? 1 : 0)
      case "<":
        return asPiece(firstOperand < secondOperand ? 1 : 0)
      case "<=":
        return asPiece(firstOperand <= secondOperand ? 1 : 0)
      case ">":
        return asPiece(firstOperand > secondOperand ? 1 : 0)
      case ">=":
        return asPiece(firstOperand >= secondOperand ? 1 : 0)
      default:
        throw new InvalidOperatorException(operator)
    }
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
  }

  private placePiece(piece: Piece, file: File, rank: Rank, capture = false) {
    const [row, col] = this.squareToIndex(file, rank)
    if (this.board[row][col] !== null && !capture) {
      throw new PieceCollisionCrash(file, rank)
    }
    this.board[row][col] = piece
  }

  private executeInstruction(text: string): void | CException {
    const firstCharType = characterType(text[0])
    const secondCharType = characterType(text[1])
    const thirdCharType = characterType(text[2])
    const fourthCharType = characterType(text[3])

    // If instruction starts with a square reference, it's an operation
    const isOperation =
      firstCharType === CharacterType.Lowercase &&
      secondCharType === CharacterType.Lowercase &&
      text.length > 4
    const isPlaceInstruction =
      secondCharType === CharacterType.Lowercase &&
      thirdCharType === CharacterType.Number
    const isCaptureInstruction =
      text[1] === "x" &&
      thirdCharType === CharacterType.Lowercase &&
      fourthCharType === CharacterType.Number
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
    } else if (isPlaceInstruction || isCaptureInstruction) {
      const pieceString = text[0]
      try {
        const piece = decodeBase32(pieceString)
        const file = asFile(isCaptureInstruction ? text[2] : text[1])
        const rank = asRank(isCaptureInstruction ? text[3] : text[2])
        try {
          this.placePiece(piece, file, rank, isCaptureInstruction)
        } catch (exception) {
          if (exception instanceof CException) return exception
          throw exception
        }
      } catch (error) {
        if (!(error instanceof InvalidBase32Exception)) throw error
        return new InvalidPieceRepresentationException(pieceString)
      }
    } else {
      return new InternalErrorException(`Unrecognized instruction: ${text}`)
    }
  }

  run(code: string): void | CException {
    const instructions = code.split(/\s+/).filter(Boolean)
    if (instructions.length === 0) {
      console.warn("Warning: Empty program provided")
      return
    }
    for (const [index, text] of instructions.entries()) {
      const result = this.executeInstruction(text)
      if (result !== undefined) {
        result.instructionNumber = index + 1
        return result // Stop executing the program
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
        .map(
          (piece) => " " + (piece !== null ? encodeBase32(piece) : " ") + " "
        )
        .join("┃")
      lines.push("┃" + innerPart + "┃")
    })
    const bottomInnerPart = Array(this.files).fill("━━━").join("┻")
    lines.push("┗" + bottomInnerPart + "┛")
    return lines.join("\n")
  }
}
