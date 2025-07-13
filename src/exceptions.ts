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
