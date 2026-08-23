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

// Every piece shares the same trunk (base + neck + head), so all six types
// stay proportionally consistent -- only a bold, simple emblem above the
// head differs per type. Shared by both the "minimal" and "bold" sets (they
// differ only in fill/stroke weight). viewBox is a fixed 0 0 100 100.
function Trunk({ withHead = true }: { withHead?: boolean }) {
  return (
    <>
      <polygon points="30,90 70,90 62,62 38,62" />
      <rect x="43" y="50" width="14" height="12" />
      {withHead && <circle cx="50" cy="38" r="13" />}
    </>
  );
}

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
          <Trunk />
        </g>
      );
    case "bishop":
      return (
        <g {...shapeProps}>
          <Trunk />
          <polygon points="50,8 44,20 56,20" />
        </g>
      );
    case "queen":
      return (
        <g {...shapeProps}>
          <Trunk />
          <circle cx="30" cy="16" r="5.5" />
          <circle cx="42.5" cy="10" r="5.5" />
          <circle cx="57.5" cy="10" r="5.5" />
          <circle cx="70" cy="16" r="5.5" />
        </g>
      );
    case "king":
      return (
        <g {...shapeProps}>
          <Trunk />
          <rect x="47" y="6" width="6" height="18" />
          <rect x="41" y="12" width="18" height="6" />
        </g>
      );
    case "rook":
      return (
        <g {...shapeProps}>
          <Trunk withHead={false} />
          <rect x="38" y="24" width="24" height="26" />
          <rect x="36" y="12" width="7" height="9" />
          <rect x="46.5" y="12" width="7" height="9" />
          <rect x="57" y="12" width="7" height="9" />
        </g>
      );
    case "knight":
      return (
        <g {...shapeProps}>
          <Trunk withHead={false} />
          <polygon points="38,50 38,30 46,16 54,22 68,28 64,38 54,34 52,50" />
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
