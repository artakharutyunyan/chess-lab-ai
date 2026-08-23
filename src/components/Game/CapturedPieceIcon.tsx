import type { PieceType } from "./pieceSets";

// Flat, single-colour silhouettes for the panel's captured-piece trays --
// deliberately independent of the user's board piece-set choice (Classic's
// two-tone PNGs and Minimal/Bold's stroked SVGs can't be recolored to a
// single flat tone via CSS). Color comes from `currentColor` on the caller.
export default function CapturedPieceIcon({ type }: { type: PieceType }) {
  switch (type) {
    case "pawn":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <circle cx="12" cy="8" r="3.6" fill="currentColor" />
          <path d="M8 20 L9.5 13 L14.5 13 L16 20 Z" fill="currentColor" />
        </svg>
      );
    case "knight":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path
            d="M9 20 L8.5 12 L7 9 L9.5 4 L13 6 L16.5 8 L15 11.5 L12.5 10.5 L12.5 20 Z"
            fill="currentColor"
          />
        </svg>
      );
    case "bishop":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path d="M12 3 L9.5 6.5 L14.5 6.5 Z" fill="currentColor" />
          <circle cx="12" cy="10" r="4" fill="currentColor" />
          <path d="M8 20 L9 15 L15 15 L16 20 Z" fill="currentColor" />
        </svg>
      );
    case "rook":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path d="M7 4 H9.5 V6.5 H14.5 V4 H17 V9 H7 Z" fill="currentColor" />
          <rect x="8" y="9" width="8" height="7" fill="currentColor" />
          <path d="M7 20 L8 16 L16 16 L17 20 Z" fill="currentColor" />
        </svg>
      );
    case "queen":
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <circle cx="7" cy="5.5" r="1.8" fill="currentColor" />
          <circle cx="12" cy="4" r="1.8" fill="currentColor" />
          <circle cx="17" cy="5.5" r="1.8" fill="currentColor" />
          <path d="M7 8 L17 8 L15.5 14 L8.5 14 Z" fill="currentColor" />
          <path d="M8 20 L8.5 15 L15.5 15 L16 20 Z" fill="currentColor" />
        </svg>
      );
    case "king":
      return null;
  }
}
