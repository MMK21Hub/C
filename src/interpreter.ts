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
  CSyntaxError,
  MissingHandlerFunctionException,
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

const Operators: {
  [category: string]: {
    [operator: string]: (a: Piece, b: Piece) => Piece
  }
} = {
  Arithmetic: {
    "+": (a, b) => asPiece(a + b),
    "-": (a, b) => asPiece(a - b),
    "*": (a, b) => asPiece(a * b),
    "/": (a, b) => {
      if (b === 0) throw new DivisionByZeroException()
      return asPiece(Math.floor(a / b))
    },
    "%": (a, b) => asPiece(a % b),
    "**": (a, b) => asPiece(a ** b),
    "***": (a, b) => tetrate(a, b),
    log: (a, b) => asPiece(logarithm(a, b)),
    throot: (a, b) => asPiece(b ** (1 / a)),
  },
  Bitwise: {
    "&": (a, b) => asPiece(a & b),
    "|": (a, b) => asPiece(a | b),
    "^": (a, b) => asPiece(a ^ b),
    "<<": (a, b) => asPiece(a << b),
    ">>": (a, b) => asPiece(a >> b),
  },
  Boolean: {
    "&&": (a, b) => asPiece(a ? b : 0),
    "||": (a, b) => asPiece(a || b),
  },
  Equality: {
    "==": (a, b) => asPiece(a === b ? 1 : 0),
    "!=": (a, b) => asPiece(a !== b ? 1 : 0),
  },
  Comparison: {
    "<": (a, b) => asPiece(a < b ? 1 : 0),
    "<=": (a, b) => asPiece(a <= b ? 1 : 0),
    ">": (a, b) => asPiece(a > b ? 1 : 0),
    ">=": (a, b) => asPiece(a >= b ? 1 : 0),
  },
}

export class Interpreter {
  private board: Board
  private ranks: number
  private files: number
  private functions: Map<Piece, string>
  private variables: Map<string, Piece>
  /** Map of exception IDs to an array of exception handler square references */
  private exceptionHandlers: Map<Piece, string[]>

  constructor(config: InterpreterConfig = {}) {
    this.ranks = config.ranks || 8
    this.files = config.files || 8
    this.board = Array.from({ length: this.ranks }, () =>
      Array(this.files).fill(null)
    )
    this.functions = new Map()
    this.variables = new Map()
    this.exceptionHandlers = new Map()
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

  private getFunction(file: File, rank: Rank): string | undefined {
    // Please refer to function-id-mappings.svg to make any sense of this
    const rowNumber = 4 - rank // From 0 to 3, starting at top
    const colNumber = file.charCodeAt(0) - "a".charCodeAt(0) // From 0 to 7, starting at left
    const functionId = rowNumber * 8 + colNumber
    return this.functions.get(asPiece(functionId))
  }

  private computeOperation(
    firstOperand: Piece | null,
    operator: string,
    secondOperand: Piece | null
  ): Piece {
    for (const category in Operators) {
      const operations = Operators[category as keyof typeof Operators]
      // Check if the operator is in this category
      if (!(operator in operations)) continue
      // Boolean operations allow empty squares. We normalise them to zero values.
      if (operations === Operators.Boolean) {
        if (firstOperand === null) firstOperand = asPiece(0)
        if (secondOperand === null) secondOperand = asPiece(0)
      }
      // Validation
      if (firstOperand === null)
        throw new SevereNullPointerException(`${firstOperand} is null`)
      if (secondOperand === null)
        throw new NullPointerException(`${secondOperand} is null`)
      // Perform the operation
      return operations[operator](firstOperand, secondOperand)
    }
    throw new InvalidOperatorException(operator)
  }

  private performOperation(
    firstSquare: string,
    operator: string,
    secondSquare: string
  ): void | CException {
    // Compute the operation
    const firstOperand = this.getPieceFromRef(firstSquare)
    const secondOperand = this.getPieceFromRef(secondSquare)
    const result = this.computeOperation(firstOperand, operator, secondOperand)
    // Write the result to the first square
    const [row, col] = this.squareToIndex(
      asFile(firstSquare[0]),
      asRank(firstSquare[1])
    )
    this.board[row][col] = result
  }

  private performAndHandleOperation(
    firstSquare: string,
    operator: string,
    secondSquare: string
  ): void {
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
      throw exception
    }
  }

  private placePiece(piece: Piece, file: File, rank: Rank, capture = false) {
    // Writing a piece to a specific square
    const [row, col] = this.squareToIndex(file, rank)
    if (this.board[row][col] !== null && !capture) {
      throw new PieceCollisionCrash(file, rank)
    }
    this.board[row][col] = piece
  }

  private registerExceptionHandler(exceptionId: Piece, functionRef: string) {
    if (!this.exceptionHandlers.has(exceptionId)) {
      this.exceptionHandlers.set(exceptionId, [functionRef])
      return
    }
    const handlers = this.exceptionHandlers.get(exceptionId)
    if (handlers === undefined)
      throw new InternalErrorException("Failed to access exception handler map")
    handlers.push(functionRef)
  }

  private executeInstruction(fullInstruction: string): void {
    // Work out if it looks like any variables/functions are being declared first
    const dotParts = fullInstruction.split(".")
    if (dotParts.length > 2)
      throw new CSyntaxError(
        "TooManyDotsException",
        `Too many dots in instruction: ${fullInstruction}`
      )
    const label = dotParts.length === 2 ? dotParts[0] : null
    const body = dotParts.length === 2 ? dotParts[1] : dotParts[0]
    // Then we examine the body to work out what instruction type it is
    const firstCharType = characterType(body[0])
    const secondCharType = characterType(body[1])
    const thirdCharType = characterType(body[2])
    const fourthCharType = characterType(body[3])

    // If instruction starts with a square reference (and is long enough), it's an operation
    const isOperation =
      firstCharType === CharacterType.Lowercase &&
      secondCharType === CharacterType.Number &&
      body.length > 4
    const isFunctionCall =
      firstCharType === CharacterType.Lowercase &&
      secondCharType === CharacterType.Number &&
      body.length === 2
    const isPlaceInstruction =
      secondCharType === CharacterType.Lowercase &&
      thirdCharType === CharacterType.Number
    const isCaptureInstruction =
      body[1] === "x" &&
      thirdCharType === CharacterType.Lowercase &&
      fourthCharType === CharacterType.Number
    const isExceptionHandlerRegistrationInstruction =
      secondCharType === CharacterType.Lowercase &&
      thirdCharType === CharacterType.Number &&
      body[3] === "+"
    const instructionCouldHaveLabel =
      isOperation || isPlaceInstruction || isCaptureInstruction
    if (label && !instructionCouldHaveLabel) {
      throw new CSyntaxError(
        "UnexpectedDotException",
        `Unexpected dot in instruction: ${fullInstruction}`
      )
    }
    if (isOperation && label) {
      // Function definition instruction
      const functionId = decodeBase32(label)
      this.functions.set(functionId, body)
    } else if (isOperation) {
      const firstSquare = body.slice(0, 2)
      const operator = body.slice(2, -2)
      const secondSquare = body.slice(-2)
      return this.performAndHandleOperation(firstSquare, operator, secondSquare)
    } else if (isPlaceInstruction || isCaptureInstruction) {
      const pieceString = body[0]
      try {
        const piece = decodeBase32(pieceString)
        const file = asFile(isCaptureInstruction ? body[2] : body[1])
        const rank = asRank(isCaptureInstruction ? body[3] : body[2])
        if (label) {
          // Also assign this square to a variable
          this.variables.set(label, piece)
        }
        this.placePiece(piece, file, rank, isCaptureInstruction)
      } catch (error) {
        if (!(error instanceof InvalidBase32Exception)) throw error
        throw new InvalidPieceRepresentationException(pieceString)
      }
    } else if (isFunctionCall) {
      // Function call instruction
      const file = asFile(body[0])
      const rank = asRank(body[1])
      const functionBody = this.getFunction(file, rank)
      if (functionBody === undefined)
        throw new NullPointerException(
          `Function does not exist: "${file}${rank}"`
        )
      // Run the function body as if it was an operation instruction
      const firstSquare = functionBody.slice(0, 2)
      const operator = functionBody.slice(2, -2)
      const secondSquare = functionBody.slice(-2)
      return this.performAndHandleOperation(firstSquare, operator, secondSquare)
    } else if (isExceptionHandlerRegistrationInstruction) {
      // Exception handler registration instruction
      const exceptionId = decodeBase32(body[0])
      const functionRef = body[1] + body[2]
      this.registerExceptionHandler(exceptionId, functionRef)
    } else {
      throw new InternalErrorException(
        `Unrecognized instruction: ${fullInstruction}`
      )
    }
  }

  executeAndHandleInstruction(
    text: string,
    instructionIndex: number,
    previousExceptions: CException[] = []
  ): CException[] | void {
    try {
      this.executeInstruction(text)
    } catch (exception) {
      if (!(exception instanceof CException)) throw exception
      const handlers = this.exceptionHandlers.get(exception.id) || []
      if (!handlers.length) {
        exception.instructionNumber = instructionIndex + 1 // Convert index to instruction number
        // Return any previous exceptions, with the new one added to the end
        return previousExceptions.concat(exception)
      }
      // Run exception handler(s)
      for (const handler of handlers) {
        const file = asFile(handler[0])
        const rank = asRank(handler[1])
        const instruction = this.getFunction(file, rank)
        if (instruction === undefined)
          throw new MissingHandlerFunctionException(exception.id, handler)
        this.executeAndHandleInstruction(
          instruction,
          instructionIndex,
          previousExceptions.concat(exception)
        )
      }
    }
  }

  run(code: string): void | CException[] {
    const instructions = code.split(/\s+/).filter(Boolean)
    if (instructions.length === 0) {
      console.warn("Warning: Empty program provided")
      return
    }
    for (const [index, text] of instructions.entries()) {
      const result = this.executeAndHandleInstruction(text, index)
      if (result !== undefined) {
        // Stop executing the program
        return result
      }
    }
  }

  dumpBoard(): Board {
    // Make a copy of the board object
    return this.board.map((row) => row.slice())
  }

  boardToFormattedString(): string {
    const lines: string[] = []
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
