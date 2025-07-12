# C

> An esoteric programming language that looks like Chess notation

## Specification

- Program memory is laid out in an 8x8 grid (called the _board_), like a chessboard.
- Each square holds a single 5-bit value (called a _piece_) canonically represented as a single [RFC 4648 base-32](https://datatracker.ietf.org/doc/html/rfc4648#section-6) digit (printable character)
- Programs are made up of instructions separated by whitespace.
- Each instruction is a few ASCII characters that describes an operation to perform, data to be written to a square, or another kind of action.

### Referencing board squares

Board squares (equivalent to memory locations) are referenced in the same way as algebraic chess notation. Two characters are used:

1. A lowercase letter (`a`-`z`) to specify the file (column).
2. A non-zero digit (`1`-`9`) to specify the rank (row).

By default, the board has 8 files and 8 ranks, so the valid squares are from `a1` to `h8`. Implementations may support extended board sizes as an opt-in feature.

Example: `g5` would represent the square highlighted in the diagram below.

[![Diagram of a chess board showing the notation](https://upload.wikimedia.org/wikipedia/commons/b/b6/SCD_algebraic_notation.svg)](https://en.wikipedia.org/wiki/File:SCD_algebraic_notation.svg)

### Writing data to the board

#### Placing pieces

The simplest kind of write instruction is to place a single piece of data on a single empty square. It consists of 3 characters:

1. The first character is the data to be placed (written) on the square, written as a base-32 digit (see above).
2. The next two characters are a [reference](#referencing-board-squares) to the square to place the data.

Example: `Be5` would place B<sub>32</sub> (i.e. 1 in decimal) to the square `e5`.

Attempting to place data on a square that already has data (without indicating a capture as below) will result in a crash (of the pieces, and of the program).

#### Capturing pieces

If you wish to overwrite the data that already exists on a square, you must use a capture instruction. It is similar to placing a piece, except that an "x" is inserted immediately before the square reference. It consists of 4 characters:

1. The first character is the new data to be placed on the square (overwriting what was already there)
2. The second character must be an `x` so that the data can be overwritten.
3. The next two characters are a [reference](#referencing-board-squares) to the square that should have its data overwritten.

Performing a capture instruction on an empty square is currently undefined behaviour.

### Named memory locations (variables)

TODO
