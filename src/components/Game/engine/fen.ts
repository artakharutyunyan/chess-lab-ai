import type { Player, Squares } from "./pieces";
import type { CastlingRights } from "./rules";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

// Square index <-> algebraic, matching this engine's convention (confirmed
// against pieces.tsx's initializeBoard: index 0 is a8, index 63 is h1 --
// i.e. rank 8 down to rank 1, file a to h -- which is also the exact order
// FEN's board field walks, so squaresToFen below can iterate 0..63 directly.
export function indexToSquare(index: number): string {
  const file = FILES[index % 8];
  const rank = 8 - Math.floor(index / 8);
  return `${file}${rank}`;
}

export function squareToIndex(square: string): number {
  const file = FILES.indexOf(square[0]);
  const rank = Number(square[1]);
  return (8 - rank) * 8 + file;
}

// `passantPos` (as used throughout rules.ts/ai.ts/Board.jsx) is the index of
// the pawn that just double-stepped -- not FEN's en passant target square
// (the skipped-over square behind it). 65 (and anything outside 0..63) is
// this codebase's "no en passant available" sentinel.
function enPassantTargetSquare(passantPos: number, squares: Squares): string | null {
  if (passantPos < 0 || passantPos > 63) return null;
  const pawn = squares[passantPos];
  if (pawn.ascii == null) return null;
  // engine convention: lowercase ascii = white.
  const isWhite = pawn.ascii === pawn.ascii.toLowerCase();
  const targetIndex = isWhite ? passantPos + 8 : passantPos - 8;
  return indexToSquare(targetIndex);
}

// Convert this engine's board representation into a FEN string for
// Stockfish. Halfmove clock and fullmove number aren't tracked by this
// engine (no draw-by-fifty-moves support) -- hardcoded to "0 1", which only
// affects Stockfish's own draw bookkeeping, not the move it picks for a
// single `go movetime` search.
export function squaresToFen(
  squares: Squares,
  turn: Player,
  castlingRights: CastlingRights,
  passantPos: number
): string {
  const rows: string[] = [];
  for (let rank = 0; rank < 8; rank++) {
    let row = "";
    let empty = 0;
    for (let file = 0; file < 8; file++) {
      const piece = squares[rank * 8 + file];
      if (piece.ascii == null) {
        empty++;
        continue;
      }
      if (empty > 0) {
        row += empty;
        empty = 0;
      }
      // engine: lowercase = white, uppercase = black. FEN: the opposite --
      // swap case.
      const ascii = piece.ascii;
      row += ascii === ascii.toLowerCase() ? ascii.toUpperCase() : ascii.toLowerCase();
    }
    if (empty > 0) row += empty;
    rows.push(row);
  }
  const board = rows.join("/");

  const castling =
    (castlingRights.whiteKingHasMoved === 0 && castlingRights.rightWhiteRookHasMoved === 0 ? "K" : "") +
    (castlingRights.whiteKingHasMoved === 0 && castlingRights.leftWhiteRookHasMoved === 0 ? "Q" : "") +
    (castlingRights.blackKingHasMoved === 0 && castlingRights.rightBlackRookHasMoved === 0 ? "k" : "") +
    (castlingRights.blackKingHasMoved === 0 && castlingRights.leftBlackRookHasMoved === 0 ? "q" : "");

  const enPassant = enPassantTargetSquare(passantPos, squares) ?? "-";

  return `${board} ${turn} ${castling || "-"} ${enPassant} 0 1`;
}

export interface UciMove {
  start: number;
  end: number;
  promotion?: string;
}

// Parse a UCI move string (e.g. "e2e4", "e7e8q") into this engine's square
// indices. `promotion` is informational only -- makeMove() in rules.ts
// always auto-promotes to queen regardless of what's requested here, same
// as it already does for the human player and the existing minimax bot.
export function uciMoveToIndices(uci: string): UciMove {
  const promotion = uci.length > 4 ? uci[4] : undefined;
  return {
    start: squareToIndex(uci.slice(0, 2)),
    end: squareToIndex(uci.slice(2, 4)),
    promotion,
  };
}
