/**
 * @file Implements RFC 4648 base 32 encoding and decoding
 * * Supports encoding a single piece of data at a time
 * * Supports decoding a single character at a time
 */

import { asPiece, Char, Piece } from "./types.js"

const availableCharacters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567")

const encodingMap = Object.fromEntries(
  availableCharacters.map((char, index) => [index, char])
)
const decodingMap = Object.fromEntries(
  availableCharacters.map((char, index) => [char, index])
)

export function encodeBase32(piece: Piece): Char {
  return encodingMap[piece]
}

export function decodeBase32(char: Char): Piece {
  return asPiece(decodingMap[char])
}
