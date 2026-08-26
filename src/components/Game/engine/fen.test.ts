import { filler_piece, initializeBoard, Pawn } from "./pieces";
import type { Squares } from "./pieces";
import type { CastlingRights } from "./rules";
import { indexToSquare, squareToIndex, squaresToFen, uciMoveToIndices } from "./fen";

const FULL_CASTLING_RIGHTS: CastlingRights = {
  whiteKingHasMoved: 0,
  blackKingHasMoved: 0,
  leftWhiteRookHasMoved: 0,
  rightWhiteRookHasMoved: 0,
  leftBlackRookHasMoved: 0,
  rightBlackRookHasMoved: 0,
};

const NO_CASTLING_RIGHTS: CastlingRights = {
  whiteKingHasMoved: 1,
  blackKingHasMoved: 1,
  leftWhiteRookHasMoved: 1,
  rightWhiteRookHasMoved: 1,
  leftBlackRookHasMoved: 1,
  rightBlackRookHasMoved: 1,
};

function emptyBoard(): Squares {
  return Array(64)
    .fill(null)
    .map(() => new filler_piece(null));
}

test("indexToSquare/squareToIndex round-trip the board corners", () => {
  expect(indexToSquare(0)).toBe("a8");
  expect(indexToSquare(7)).toBe("h8");
  expect(indexToSquare(56)).toBe("a1");
  expect(indexToSquare(63)).toBe("h1");
  for (const square of ["a8", "h8", "a1", "h1", "e4", "d5"]) {
    expect(indexToSquare(squareToIndex(square))).toBe(square);
  }
});

test("squaresToFen: initial position matches chess's standard start FEN", () => {
  const fen = squaresToFen(initializeBoard(), "w", FULL_CASTLING_RIGHTS, 65);
  expect(fen).toBe(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
});

test("squaresToFen: no castling rights left produces '-'", () => {
  const fen = squaresToFen(initializeBoard(), "b", NO_CASTLING_RIGHTS, 65);
  expect(fen.split(" ")[2]).toBe("-");
});

test("squaresToFen: en passant target square after white's e2-e4", () => {
  const squares = emptyBoard();
  squares[36] = new Pawn("w"); // e4 -- pawn just double-stepped here
  const fen = squaresToFen(squares, "b", NO_CASTLING_RIGHTS, 36);
  expect(fen.split(" ")[3]).toBe("e3");
});

test("squaresToFen: en passant target square after black's e7-e5", () => {
  const squares = emptyBoard();
  squares[28] = new Pawn("b"); // e5 -- pawn just double-stepped here
  const fen = squaresToFen(squares, "w", NO_CASTLING_RIGHTS, 28);
  expect(fen.split(" ")[3]).toBe("e6");
});

test("squaresToFen: passantPos of 65 (this engine's sentinel) means no en passant", () => {
  const fen = squaresToFen(initializeBoard(), "w", FULL_CASTLING_RIGHTS, 65);
  expect(fen.split(" ")[3]).toBe("-");
});

test("uciMoveToIndices parses a plain move", () => {
  expect(uciMoveToIndices("e2e4")).toEqual({ start: 52, end: 36, promotion: undefined });
});

test("uciMoveToIndices parses a promotion move", () => {
  expect(uciMoveToIndices("e7e8q")).toEqual({ start: 12, end: 4, promotion: "q" });
});
