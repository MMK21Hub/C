import { asPiece, Piece } from "./types.js"

/**
 * Tetration implementation for 2 single-pieces numbers.
 * @param base The number before the up arrows (in Knuth's up-arrow notation)
 * @param height The number after the up arrows (in Knuth's up-arrow notation)
 */
export function tetrate(base: Piece, height: Piece): Piece {
  // Optimisations for common cases: (I'm 90% sure these are right)
  if (base === 1) return asPiece(1)
  if (height === 1) return base
  // Base case for recursion:
  if (height === 0) return asPiece(1)
  return asPiece(base ** tetrate(base, asPiece(height - 1)))
}

export function logarithm(antiLogarithm: Piece, base: Piece): Piece {
  return asPiece(Math.log(antiLogarithm) / Math.log(base))
}
