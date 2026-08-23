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

// "Minimal" is the kiwen-suwi set (CC BY 4.0, https://creativecommons.org/licenses/by/4.0/)
// by neverRare (https://github.com/neverRare), sourced from
// https://github.com/lichess-org/lila/tree/master/public/piece/kiwen-suwi.
import minimalWK from "../../images/pieces/minimal/wK.svg";
import minimalWQ from "../../images/pieces/minimal/wQ.svg";
import minimalWR from "../../images/pieces/minimal/wR.svg";
import minimalWB from "../../images/pieces/minimal/wB.svg";
import minimalWN from "../../images/pieces/minimal/wN.svg";
import minimalWP from "../../images/pieces/minimal/wP.svg";
import minimalBK from "../../images/pieces/minimal/bK.svg";
import minimalBQ from "../../images/pieces/minimal/bQ.svg";
import minimalBR from "../../images/pieces/minimal/bR.svg";
import minimalBB from "../../images/pieces/minimal/bB.svg";
import minimalBN from "../../images/pieces/minimal/bN.svg";
import minimalBP from "../../images/pieces/minimal/bP.svg";

// "Bold" is the chessnut set (Apache License 2.0,
// https://github.com/LexLuengas/chessnut-pieces/blob/master/LICENSE.txt)
// by Alexis Luengas (https://github.com/LexLuengas), sourced from
// https://github.com/lichess-org/lila/tree/master/public/piece/chessnut.
import boldWK from "../../images/pieces/bold/wK.svg";
import boldWQ from "../../images/pieces/bold/wQ.svg";
import boldWR from "../../images/pieces/bold/wR.svg";
import boldWB from "../../images/pieces/bold/wB.svg";
import boldWN from "../../images/pieces/bold/wN.svg";
import boldWP from "../../images/pieces/bold/wP.svg";
import boldBK from "../../images/pieces/bold/bK.svg";
import boldBQ from "../../images/pieces/bold/bQ.svg";
import boldBR from "../../images/pieces/bold/bR.svg";
import boldBB from "../../images/pieces/bold/bB.svg";
import boldBN from "../../images/pieces/bold/bN.svg";
import boldBP from "../../images/pieces/bold/bP.svg";

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
  minimal: {
    k: minimalWK,
    q: minimalWQ,
    r: minimalWR,
    b: minimalWB,
    n: minimalWN,
    p: minimalWP,
    K: minimalBK,
    Q: minimalBQ,
    R: minimalBR,
    B: minimalBB,
    N: minimalBN,
    P: minimalBP,
  },
  bold: {
    k: boldWK,
    q: boldWQ,
    r: boldWR,
    b: boldWB,
    n: boldWN,
    p: boldWP,
    K: boldBK,
    Q: boldBQ,
    R: boldBR,
    B: boldBB,
    N: boldBN,
    P: boldBP,
  },
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
