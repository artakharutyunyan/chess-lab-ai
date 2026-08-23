import { King, Queen, Rook, Pawn, filler_piece, initializeBoard } from "./pieces";
import type { Squares } from "./pieces";
import {
  makeMove,
  canMoveThere,
  isCheckmate,
  isStalemate,
  type CastlingRights,
} from "./rules";
import { chooseBotMove } from "./ai";

const NO_CASTLE: CastlingRights = {
  whiteKingHasMoved: 0,
  blackKingHasMoved: 0,
  leftWhiteRookHasMoved: 0,
  rightWhiteRookHasMoved: 0,
  leftBlackRookHasMoved: 0,
  rightBlackRookHasMoved: 0,
};

function emptyBoard(): Squares {
  return Array(64)
    .fill(null)
    .map(() => new filler_piece(null));
}

test("initial position: white e2-e4 is legal", () => {
  const squares = initializeBoard();
  // e2 = index 52, e4 = index 36 (row-major, rank8 at index 0)
  expect(canMoveThere(52, 36, squares, 65, NO_CASTLE)).toBe(true);
});

test("kingside castling: relocates the rook and moves the king two squares", () => {
  const squares = emptyBoard();
  squares[60] = new King("w"); // e1
  squares[63] = new Rook("w"); // h1
  squares[4] = new King("b"); // e8, so in_check() can find a king for both sides

  expect(canMoveThere(60, 62, squares, 65, NO_CASTLE)).toBe(true);
  const after = makeMove(squares, 60, 62, 65);
  expect(after[62].ascii).toBe("k"); // king on g1
  expect(after[61].ascii).toBe("r"); // rook on f1
  expect(after[63].ascii).toBe(null); // h1 empty
  expect(after[60].ascii).toBe(null); // e1 empty
});

test("castling is blocked once the king has moved", () => {
  const squares = emptyBoard();
  squares[60] = new King("w");
  squares[63] = new Rook("w");
  squares[4] = new King("b");
  const rights = { ...NO_CASTLE, whiteKingHasMoved: 1 };
  expect(canMoveThere(60, 62, squares, 65, rights)).toBe(false);
});

test("en passant: capturing pawn removes the passed pawn", () => {
  const squares = emptyBoard();
  squares[60] = new King("w");
  squares[4] = new King("b");
  squares[24] = new Pawn("w"); // white pawn on e5 (index 24)
  squares[25] = new Pawn("b"); // black pawn on f5 (index 25), just moved two squares from f7
  const passantPos = 25; // f5 is the en passant target

  expect(canMoveThere(24, 17, squares, passantPos, NO_CASTLE)).toBe(true); // e5xf6
  const after = makeMove(squares, 24, 17, passantPos);
  expect(after[17].ascii).toBe("p"); // white pawn now on f6
  expect(after[25].ascii).toBe(null); // captured black pawn removed
});

test("pawn promotion: reaching the last rank becomes a queen", () => {
  const squares = emptyBoard();
  squares[60] = new King("w");
  squares[4] = new King("b");
  squares[8] = new Pawn("w"); // one step from promoting (rank 7 -> rank 8)
  const after = makeMove(squares, 8, 0, 65);
  expect(after[0].ascii).toBe("q");
  expect(after[0]).toBeInstanceOf(Queen);
});

test("back-rank mate is detected as checkmate", () => {
  const squares = emptyBoard();
  squares[4] = new King("b"); // black king on e8, boxed in by its own pawns
  squares[12] = new Pawn("b"); // e7
  squares[11] = new Pawn("b"); // d7
  squares[13] = new Pawn("b"); // f7
  squares[0] = new Rook("w"); // white rook on a8 delivers mate along the back rank
  squares[56] = new King("w");

  expect(isCheckmate("b", squares, 65, NO_CASTLE)).toBe(true);
  expect(isStalemate("b", squares, 65, NO_CASTLE)).toBe(false);
});

test("chooseBotMove returns null when black has no legal move (checkmate)", () => {
  const squares = emptyBoard();
  squares[4] = new King("b");
  squares[12] = new Pawn("b");
  squares[11] = new Pawn("b");
  squares[13] = new Pawn("b");
  squares[0] = new Rook("w");
  squares[56] = new King("w");

  const move = chooseBotMove({
    squares,
    depth: 2,
    passantPos: 65,
    castlingRights: NO_CASTLE,
    avoidMove: null,
  });
  expect(move).toBeNull();
});

test("chooseBotMove picks a legal move in a simple position", () => {
  const squares = initializeBoard();
  const move = chooseBotMove({
    squares,
    depth: 1,
    passantPos: 65,
    castlingRights: NO_CASTLE,
    avoidMove: null,
  });
  expect(move).not.toBeNull();
  if (move == null) throw new Error("expected a move");
  expect(canMoveThere(move.start, move.end, squares, 65, NO_CASTLE)).toBe(true);
});

test("stalemate: boxed-in king with no check is stalemate, not checkmate", () => {
  const squares = emptyBoard();
  squares[7] = new King("b"); // h8
  squares[13] = new King("w"); // f7
  squares[22] = new Queen("w"); // g6 -- controls g7/g8/h7 without attacking h8 itself

  expect(isStalemate("b", squares, 65, NO_CASTLE)).toBe(true);
  expect(isCheckmate("b", squares, 65, NO_CASTLE)).toBe(false);
});

test("king cannot castle out of check", () => {
  const squares = emptyBoard();
  squares[60] = new King("w"); // e1
  squares[63] = new Rook("w"); // h1
  squares[28] = new Rook("b"); // e5, checks the white king along the open e-file

  expect(canMoveThere(60, 62, squares, 65, NO_CASTLE)).toBe(false);
});

test("king cannot castle through an attacked square", () => {
  const squares = emptyBoard();
  squares[60] = new King("w"); // e1
  squares[63] = new Rook("w"); // h1
  squares[5] = new Rook("b"); // f8, controls the whole f-file including f1, the king's transit square

  expect(canMoveThere(60, 62, squares, 65, NO_CASTLE)).toBe(false);
});

test("chooseBotMove skips the avoided move when another option exists", () => {
  const squares = emptyBoard();
  squares[0] = new King("b"); // a8
  squares[9] = new Pawn("b"); // b7, blocks that escape square (own piece)
  squares[60] = new King("w"); // e1, uninvolved

  // Only two legal king moves exist from a8: a7 (index 8) and b8 (index 1).
  // Excluding a7 should force b8, deterministically, regardless of eval.
  const avoidMove = { start: 0, end: 8 };

  const move = chooseBotMove({
    squares,
    depth: 1,
    passantPos: 65,
    castlingRights: NO_CASTLE,
    avoidMove,
  });

  expect(move).toEqual({ start: 0, end: 1 });
});
