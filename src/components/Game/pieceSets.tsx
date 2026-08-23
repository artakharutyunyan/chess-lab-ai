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
export type PieceSetId = "classic" | "minimal" | "bold";

export interface PieceSetOption {
  id: PieceSetId;
  name: string;
}

// `name` is an i18n key (see src/i18n/translations/*.js -> boardSettings.pieceSets).
export const PIECE_SETS: PieceSetOption[] = [
  { id: "classic", name: "boardSettings.pieceSets.classic" },
  { id: "minimal", name: "boardSettings.pieceSets.minimal" },
  { id: "bold", name: "boardSettings.pieceSets.bold" },
];

export const DEFAULT_PIECE_SET_ID: PieceSetId = "classic";

const CLASSIC_ICONS: Record<string, string> = {
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
};

const TYPE_BY_LETTER: Record<string, PieceType> = {
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

// Original geometric silhouettes, one shape per piece type, shared by both
// the "minimal" and "bold" sets (they differ only in fill/stroke weight,
// the same way an icon library's filled/outlined variants share geometry).
// viewBox is a fixed 0 0 100 100 for all of them.
function PieceShape({
  type,
  fill,
  stroke,
  strokeWidth,
}: {
  type: PieceType;
  fill: string;
  stroke: string;
  strokeWidth: number;
}) {
  const shapeProps = { fill, stroke, strokeWidth, strokeLinejoin: "round" as const };

  switch (type) {
    case "pawn":
      return (
        <g {...shapeProps}>
          <circle cx="50" cy="38" r="13" />
          <rect x="44" y="50" width="12" height="8" rx="2" />
          <polygon points="35,88 65,88 58,58 42,58" />
        </g>
      );
    case "rook":
      return (
        <g {...shapeProps}>
          <rect x="32" y="12" width="8" height="13" />
          <rect x="46" y="12" width="8" height="13" />
          <rect x="60" y="12" width="8" height="13" />
          <rect x="32" y="25" width="36" height="33" />
          <polygon points="28,88 72,88 66,58 34,58" />
        </g>
      );
    case "bishop":
      return (
        <g {...shapeProps}>
          <circle cx="50" cy="15" r="7" />
          <ellipse cx="50" cy="42" rx="15" ry="20" />
          <polygon points="32,88 68,88 60,62 40,62" />
        </g>
      );
    case "knight":
      return (
        <g {...shapeProps}>
          <polygon points="26,88 74,88 70,62 74,50 62,36 66,20 55,14 46,24 34,20 36,38 24,52 30,60" />
        </g>
      );
    case "queen":
      return (
        <g {...shapeProps}>
          <circle cx="30" cy="15" r="6.5" />
          <circle cx="40" cy="15" r="6.5" />
          <circle cx="50" cy="15" r="6.5" />
          <circle cx="60" cy="15" r="6.5" />
          <circle cx="70" cy="15" r="6.5" />
          <rect x="27" y="20" width="46" height="8" />
          <polygon points="37,58 63,58 57,28 43,28" />
          <polygon points="28,88 72,88 64,58 36,58" />
        </g>
      );
    case "king":
      return (
        <g {...shapeProps}>
          <rect x="45" y="4" width="10" height="20" />
          <rect x="38" y="10" width="24" height="8" />
          <rect x="38" y="26" width="24" height="6" />
          <polygon points="37,58 63,58 57,30 43,30" />
          <polygon points="28,88 72,88 64,58 36,58" />
        </g>
      );
  }
}

function svgIcon(type: PieceType, isWhite: boolean, variant: "minimal" | "bold") {
  const fill =
    variant === "minimal"
      ? isWhite
        ? "#f5f4f1"
        : "#1d1d1f"
      : isWhite
      ? "#fbead9"
      : "#2a1a12";
  // Stroke must contrast with this piece's own fill, not just the board --
  // a dark stroke on a dark fill (or vice versa) disappears regardless of
  // what's behind it. White pieces get a dark stroke, black pieces a light
  // one, in each variant's palette.
  const stroke = isWhite
    ? variant === "minimal"
      ? "#1d1d1f"
      : "#8b5e3c"
    : variant === "minimal"
    ? "#c9c7bd"
    : "#c98a5e";
  const strokeWidth = variant === "minimal" ? 2 : 4.5;

  return (
    <svg
      viewBox="0 0 100 100"
      className="piece"
      role="img"
      aria-label={`${isWhite ? "white" : "black"} ${PIECE_NAMES[type]}`}
    >
      <PieceShape type={type} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
}

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

  if (pieceSetId === "classic") {
    const src = CLASSIC_ICONS[ascii];
    return (
      <img
        src={src}
        className="piece"
        alt={`${isWhite ? "white" : "black"} ${PIECE_NAMES[type]}`}
      />
    );
  }

  return svgIcon(type, isWhite, pieceSetId);
}
