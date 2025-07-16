import { asPiece, Piece } from "./types.js"

export class CException {
  name: string
  id: Piece = asPiece(31) // 31 is the ID for an unknown exception
  message?: string
  isCrash: boolean = false
  instructionNumber?: number

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
    this.id = asPiece(3)
  }
}

export class DivisionByZeroException extends CException {
  constructor() {
    super("DivisionByZeroException", "Cannot divide by zero")
    this.id = asPiece(4)
  }
}

export class NullPointerException extends CException {
  constructor(message?: string) {
    super("NullPointerException", message)
    this.id = asPiece(1)
  }
}

export class SevereNullPointerException extends CException {
  constructor(message?: string) {
    super("SevereNullPointerException", message)
    this.id = asPiece(2)
  }
}

export class MemoryAccessViolation extends CException {
  constructor(memoryRef: string, message?: string) {
    super(
      "MemoryAccessViolation",
      `${message || "Invalid memory access"}: ${memoryRef}`
    )
    this.id = asPiece(5)
  }
}

export class CSyntaxError extends CException {
  constructor(name: string, message?: string) {
    super(name, `Syntax error: ${message || "Invalid syntax"}`)
    this.id = asPiece(30)
  }
}

export class InvalidSquareRefException extends CSyntaxError {
  constructor(message?: string) {
    super("InvalidSquareReferenceException", message)
  }
}

export class InvalidPieceRepresentationException extends CSyntaxError {
  constructor(representation: string) {
    super(
      "InvalidPieceRepresentationException",
      `Invalid piece representation: "${representation}". Pieces must be a single valid base-32 character.`
    )
  }
}

export class InvalidOperatorException extends CSyntaxError {
  constructor(operator: string) {
    super("InvalidOperatorException", `Not a valid operator: "${operator}".`)
  }
}

export class PieceCollisionCrash extends CException {
  constructor(file: string, rank: number) {
    super(
      "PieceCollisionCrash",
      `Square ${file}${rank} is already occupied by a piece.`
    )
    this.isCrash = true
    this.id = asPiece(6)
  }
}

export class InternalErrorException extends CException {
  constructor(message?: string) {
    super("Internal interpreter error", message)
    this.id = asPiece(7)
  }
}
