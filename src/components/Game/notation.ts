import type { Squares } from "./engine/pieces";
import type { CastlingRights } from "./engine/rules";
import { canMoveThere, inCheck, isCheckmate } from "./engine/rules";

// A "nothing has moved / no en passant" context, used to re-derive
// check/disambiguation for a *historical* snapshot. Castling rights and en
// passant only gate the king's own castling move and one very narrow pawn
// capture -- neither affects whether a piece attacks a square, which is all
// check-detection and SAN disambiguation actually need. The one place this
// approximation would matter (an en passant escape from checkmate) is rare
// enough, and only ever relevant to the true last move, to be worth the cost
// of storing a full historical passant/castling snapshot per move.
const NO_RIGHTS: CastlingRights = {
  whiteKingHasMoved: 0,
  blackKingHasMoved: 0,
  leftWhiteRookHasMoved: 0,
  rightWhiteRookHasMoved: 0,
  leftBlackRookHasMoved: 0,
  rightBlackRookHasMoved: 0,
};
const NO_PASSANT = 65;

const FILES = "abcdefgh";

function squareName(index: number): string {
  return `${FILES[index % 8]}${8 - Math.floor(index / 8)}`;
}

function sanPieceLetter(asciiLower: string): string {
  switch (asciiLower) {
    case "k":
      return "K";
    case "q":
      return "Q";
    case "r":
      return "R";
    case "b":
      return "B";
    case "n":
      return "N";
    default:
      return ""; // pawn
  }
}

export interface MoveRow {
  number: number;
  white: string | null;
  black: string | null;
}

// SAN (without the trailing +/#, see computeSan) for the move that took the
// position from `before` to `after` via start -> end.
function moveBody(before: Squares, after: Squares, start: number, end: number): string {
  const moving = before[start];
  const asciiLower = (moving.ascii ?? "").toLowerCase();
  const isKing = asciiLower === "k";
  const isPawn = asciiLower === "p";

  if (isKing && Math.abs(end - start) === 2) {
    return end > start ? "0-0" : "0-0-0";
  }

  const targetHadPiece = before[end].ascii != null;
  const isEnPassant = isPawn && !targetHadPiece && end % 8 !== start % 8;
  const isCapture = targetHadPiece || isEnPassant;

  let disambiguation = "";
  if (!isPawn && !isKing) {
    const rivals: number[] = [];
    for (let i = 0; i < 64; i++) {
      if (i === start) continue;
      if (before[i].ascii === moving.ascii && canMoveThere(i, end, before, NO_PASSANT, NO_RIGHTS)) {
        rivals.push(i);
      }
    }
    if (rivals.length > 0) {
      const sameFile = rivals.some((i) => i % 8 === start % 8);
      const sameRank = rivals.some((i) => Math.floor(i / 8) === Math.floor(start / 8));
      if (!sameFile) disambiguation = FILES[start % 8];
      else if (!sameRank) disambiguation = String(8 - Math.floor(start / 8));
      else disambiguation = squareName(start);
    }
  }

  let promotion = "";
  if (isPawn) {
    const promotedLower = (after[end].ascii ?? "").toLowerCase();
    if (promotedLower !== "p" && promotedLower !== "") {
      promotion = `=${sanPieceLetter(promotedLower)}`;
    }
  }

  const pieceLetter = sanPieceLetter(asciiLower);
  if (isPawn) {
    const dest = squareName(end);
    return isCapture ? `${FILES[start % 8]}x${dest}${promotion}` : `${dest}${promotion}`;
  }
  return `${pieceLetter}${disambiguation}${isCapture ? "x" : ""}${squareName(end)}`;
}

// Full SAN (including +/#) for history[k-1] -> history[k]. `isTrueLastMove`
// (the actual latest move played, not just the one currently being
// browsed to) plus the *live* passant/castling rights let the # vs +
// distinction be exact for the move that matters; every earlier move only
// ever needs to know it gave check, which the NO_RIGHTS approximation
// above always gets right.
export function computeSan(
  history: Squares[],
  h1: (number | null)[],
  h2: (number | null)[],
  k: number,
  isTrueLastMove: boolean,
  livePassantPos: number,
  liveCastlingRights: CastlingRights
): string {
  const start = h1[k];
  const end = h2[k];
  if (start == null || end == null) return "";
  const before = history[k - 1];
  const after = history[k];
  let san = moveBody(before, after, start, end);

  const mover = before[start].player;
  const opponent = mover === "w" ? "b" : "w";
  if (inCheck(opponent, after, NO_PASSANT, NO_RIGHTS)) {
    const mate = isTrueLastMove && isCheckmate(opponent, after, livePassantPos, liveCastlingRights);
    san += mate ? "#" : "+";
  }
  return san;
}

export function buildMoveRows(
  history: Squares[],
  h1: (number | null)[],
  h2: (number | null)[],
  livePassantPos: number,
  liveCastlingRights: CastlingRights
): MoveRow[] {
  const rows: MoveRow[] = [];
  const lastIndex = history.length - 1;
  for (let k = 1; k <= lastIndex; k++) {
    const san = computeSan(history, h1, h2, k, k === lastIndex, livePassantPos, liveCastlingRights);
    if (k % 2 === 1) {
      rows.push({ number: Math.ceil(k / 2), white: san, black: null });
    } else if (rows.length > 0) {
      rows[rows.length - 1].black = san;
    }
  }
  return rows;
}

// A small, hand-picked set of well-known openings, matched by SAN prefix
// (longest match wins). Not a full ECO database -- deliberately scoped down
// to the lines a casual game is actually likely to reach.
const OPENING_BOOK: { moves: string[]; name: string }[] = [
  { moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"], name: "Sicilian Najdorf" },
  { moves: ["e4", "c5", "Nf3", "Nc6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3"], name: "Sicilian, Open" },
  { moves: ["e4", "c5"], name: "Sicilian Defense" },
  { moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6"], name: "Ruy Lopez, Morphy Defense" },
  { moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"], name: "Ruy Lopez" },
  { moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"], name: "Italian Game" },
  { moves: ["e4", "e5", "Nf3", "Nf6"], name: "Petrov Defense" },
  { moves: ["e4", "e5"], name: "Open Game" },
  { moves: ["e4", "e6", "d4", "d5", "Nc3", "Bb4"], name: "French Defense, Winawer" },
  { moves: ["e4", "e6"], name: "French Defense" },
  { moves: ["e4", "c6", "d4", "d5", "Nc3"], name: "Caro-Kann Defense" },
  { moves: ["e4", "d5"], name: "Scandinavian Defense" },
  { moves: ["e4", "Nf6", "e5", "Nd5"], name: "Alekhine Defense" },
  { moves: ["d4", "d5", "c4", "e6"], name: "Queen's Gambit Declined" },
  { moves: ["d4", "d5", "c4", "c6"], name: "Slav Defense" },
  { moves: ["d4", "d5", "c4", "dxc4"], name: "Queen's Gambit Accepted" },
  { moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e4", "d6"], name: "King's Indian Defense" },
  { moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4"], name: "Nimzo-Indian Defense" },
  { moves: ["d4", "Nf6", "c4", "e6"], name: "Indian Defense" },
  { moves: ["d4", "f5"], name: "Dutch Defense" },
  { moves: ["d4", "d5"], name: "Queen's Pawn Game" },
  { moves: ["c4"], name: "English Opening" },
  { moves: ["Nf3", "d5", "g3"], name: "King's Indian Attack" },
  { moves: ["Nf3"], name: "Reti Opening" },
];

// Strip trailing +/#/=Q etc. down to the bare move for opening-book matching
// -- the book is written in plain SAN and a captured/checking transposition
// of the same line shouldn't fail to match.
function bareMove(san: string): string {
  return san.replace(/[+#]$/, "");
}

export function lookupOpeningName(rows: MoveRow[]): string | null {
  const played: string[] = [];
  for (const row of rows) {
    if (row.white) played.push(bareMove(row.white));
    if (row.black) played.push(bareMove(row.black));
  }

  let best: string | null = null;
  let bestLength = 0;
  for (const entry of OPENING_BOOK) {
    if (entry.moves.length > played.length) continue;
    if (entry.moves.length <= bestLength) continue;
    const matches = entry.moves.every((m, i) => m === played[i]);
    if (matches) {
      best = entry.name;
      bestLength = entry.moves.length;
    }
  }
  return best;
}
