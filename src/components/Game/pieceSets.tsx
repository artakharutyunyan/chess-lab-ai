import type { ReactElement } from "react";

import whiteKing from "../../images/white_king.png";
import whiteBishop from "../../images/white_bishop.png";
import whiteKnight from "../../images/white_knight.png";
import whitePawn from "../../images/white_pawn.png";
import whiteQueen from "../../images/white_queen.png";
import whiteRock from "../../images/white_rook.png";
import blackKing from "../../images/black_king.png";
import blackBishop from "../../images/black_bishop.png";
import blackKnight from "../../images/black_knight.png";
import blackPawn from "../../images/black_pawn.png";
import blackQueen from "../../images/black_queen.png";
import blackRock from "../../images/black_rook.png";

export type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";
export type PieceSetId =
  | "classic"
  | "minimal"
  | "bold"
  | "staunton"
  | "merida"
  | "three-d"
  | "rustic"
  | "celtic";

export interface PieceSetOption {
  id: PieceSetId;
  name: string;
}

// `name` is an i18n key (see src/i18n/translations/*.js -> boardSettings.pieceSets).
export const PIECE_SETS: PieceSetOption[] = [
  { id: "classic", name: "boardSettings.pieceSets.classic" },
  { id: "minimal", name: "boardSettings.pieceSets.minimal" },
  { id: "bold", name: "boardSettings.pieceSets.bold" },
  { id: "staunton", name: "boardSettings.pieceSets.staunton" },
  { id: "merida", name: "boardSettings.pieceSets.merida" },
  { id: "three-d", name: "boardSettings.pieceSets.threeD" },
  { id: "rustic", name: "boardSettings.pieceSets.rustic" },
  { id: "celtic", name: "boardSettings.pieceSets.celtic" },
];

export const DEFAULT_PIECE_SET_ID: PieceSetId = "classic";

export const TYPE_BY_LETTER: Record<string, PieceType> = {
  k: "king",
  q: "queen",
  r: "rook",
  b: "bishop",
  n: "knight",
  p: "pawn",
};

const PIECE_NAMES: Record<PieceType, string> = {
  king: "king",
  queen: "queen",
  rook: "rook",
  bishop: "bishop",
  knight: "knight",
  pawn: "pawn",
};

// Reverse of TYPE_BY_LETTER -- lowercase (white) base letter per type. Used
// by PlayPanel's captured-piece trays to look up the right getPieceIcon
// ascii for a PieceType once it also knows which color was captured.
export const LETTER_BY_TYPE: Record<PieceType, string> = {
  king: "k",
  queen: "q",
  rook: "r",
  bishop: "b",
  knight: "n",
  pawn: "p",
};

// Every SVG set below (everything except "classic", which uses the original
// PNG art) lives under src/images/pieces/<dir>/{wK,wQ,wR,wB,wN,wP,bK,bQ,bR,
// bB,bN,bP}.svg -- loaded in bulk here rather than as ~90 individual named
// imports. All are sourced from lichess's open-source piece library
// (https://github.com/lichess-org/lila/tree/master/public/piece), picked
// for having an unambiguous, redistributable license (see the credits in
// BoardSettingsFields.tsx) -- deliberately excludes lichess sets whose
// license is "freeware"/non-commercial/unlisted.
const svgAssets = import.meta.glob<string>("../../images/pieces/*/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

const LETTER_TO_FILE: Record<string, string> = {
  k: "wK",
  q: "wQ",
  r: "wR",
  b: "wB",
  n: "wN",
  p: "wP",
  K: "bK",
  Q: "bQ",
  R: "bR",
  B: "bB",
  N: "bN",
  P: "bP",
};

function loadSvgSet(dir: string): Record<string, string> {
  const set: Record<string, string> = {};
  for (const [letter, file] of Object.entries(LETTER_TO_FILE)) {
    const path = `../../images/pieces/${dir}/${file}.svg`;
    const url = svgAssets[path];
    if (url == null) {
      throw new Error(`Missing piece asset: ${path}`);
    }
    set[letter] = url;
  }
  return set;
}

// Keyed by the engine's ascii convention: lowercase = white, uppercase = black.
const ICONS_BY_SET: Record<PieceSetId, Record<string, string>> = {
  classic: {
    k: whiteKing,
    q: whiteQueen,
    r: whiteRock,
    b: whiteBishop,
    n: whiteKnight,
    p: whitePawn,
    K: blackKing,
    Q: blackQueen,
    R: blackRock,
    B: blackBishop,
    N: blackKnight,
    P: blackPawn,
  },
  minimal: loadSvgSet("minimal"),
  bold: loadSvgSet("bold"),
  staunton: loadSvgSet("staunton"),
  merida: loadSvgSet("merida"),
  "three-d": loadSvgSet("three-d"),
  rustic: loadSvgSet("rustic"),
  celtic: loadSvgSet("celtic"),
};

// Returns the icon element for a piece, given its engine `ascii` code
// (lowercase = white, uppercase = black, matching pieces.tsx's convention)
// and the currently selected piece set.
export function getPieceIcon(
  ascii: string | null,
  pieceSetId: PieceSetId
): ReactElement | null {
  if (ascii == null) return null;
  const letter = ascii.toLowerCase();
  const type = TYPE_BY_LETTER[letter];
  if (type == null) return null;
  const isWhite = ascii === letter;

  const src = ICONS_BY_SET[pieceSetId][ascii];
  return (
    <img
      src={src}
      className="piece"
      alt={`${isWhite ? "white" : "black"} ${PIECE_NAMES[type]}`}
    />
  );
}
