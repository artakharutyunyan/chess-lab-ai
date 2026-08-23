import { useState } from "react";
import type { Squares } from "./engine/pieces";
import { TYPE_BY_LETTER, getPieceIcon } from "./pieceSets";
import { useBoardSettings } from "../../context/BoardSettingsContext";
import "./playBoard.styles.css";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ROWS = [0, 1, 2, 3, 4, 5, 6, 7];

export interface LegalTarget {
  index: number;
  capture: boolean;
}

interface PlayBoardProps {
  squares: Squares;
  selected: number | null;
  legalTargets: LegalTarget[];
  lastMoveSquares: number[];
  checkSquare: number | null;
  // Whose pieces are currently clickable -- null when no moves are
  // allowed right now (bot thinking, game over, browsing history).
  movablePlayer: "w" | "b" | null;
  flipped: boolean;
  onSquareClick: (index: number) => void;
}

function squareLabel(file: string, rank: number, ascii: string | null): string {
  const coord = `${file}${rank}`;
  if (ascii == null) return coord;
  const isWhite = ascii === ascii.toLowerCase();
  const type = TYPE_BY_LETTER[ascii.toLowerCase()];
  return `${coord}, ${isWhite ? "white" : "black"} ${type}`;
}

export default function PlayBoard({
  squares,
  selected,
  legalTargets,
  lastMoveSquares,
  checkSquare,
  movablePlayer,
  flipped,
  onSquareClick,
}: PlayBoardProps) {
  const { pieceSetId } = useBoardSettings();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  return (
    <div className="play-board" role="grid" aria-label="Chess board">
      {ROWS.map((visualRow) => {
        return (
          <div className="play-board-row" role="row" key={visualRow}>
            {ROWS.map((visualCol) => {
              const i = flipped ? 7 - visualRow : visualRow;
              const j = flipped ? 7 - visualCol : visualCol;
              const index = i * 8 + j;
              const rank = 8 - i;
              const file = FILES[j];
              const dark = (i + j) % 2 === 1;
              const piece = squares[index];
              const legal = legalTargets.find((t) => t.index === index);
              const isMovable = movablePlayer != null && piece.player === movablePlayer;
              const coordTone = dark ? "play-coord--on-dark" : "play-coord--on-light";

              const className = [
                "play-square",
                dark ? "play-square--dark" : "play-square--light",
                isMovable ? "play-square--movable" : "",
                dragOverIndex === index ? "play-square--drag-over" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={index}
                  role="gridcell"
                  aria-label={squareLabel(file, rank, piece.ascii)}
                  className={className}
                  onClick={() => onSquareClick(index)}
                  onDragOver={(e) => {
                    if (draggedIndex == null) return;
                    e.preventDefault();
                    if (dragOverIndex !== index) setDragOverIndex(index);
                  }}
                  onDragLeave={() => {
                    if (dragOverIndex === index) setDragOverIndex(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverIndex(null);
                    if (draggedIndex == null) return;
                    if (draggedIndex !== index) onSquareClick(index);
                    setDraggedIndex(null);
                  }}
                >
                  {lastMoveSquares.includes(index) && (
                    <span className="play-square-overlay play-square-overlay--last" aria-hidden="true" />
                  )}
                  {selected === index && (
                    <span className="play-square-overlay play-square-overlay--selected" aria-hidden="true" />
                  )}
                  {checkSquare === index && (
                    <span className="play-square-check" aria-hidden="true" />
                  )}
                  {visualCol === 0 && (
                    <span className={`play-coord play-coord--rank ${coordTone}`} aria-hidden="true">
                      {rank}
                    </span>
                  )}
                  {visualRow === 7 && (
                    <span className={`play-coord play-coord--file ${coordTone}`} aria-hidden="true">
                      {file}
                    </span>
                  )}
                  {piece.ascii != null && (
                    <span
                      className={`play-piece${draggedIndex === index ? " play-piece--dragging" : ""}`}
                      aria-hidden="true"
                      draggable={isMovable}
                      onDragStart={(e) => {
                        if (!isMovable) {
                          e.preventDefault();
                          return;
                        }
                        e.dataTransfer.effectAllowed = "move";
                        setDraggedIndex(index);
                        onSquareClick(index);
                      }}
                      onDragEnd={() => {
                        setDraggedIndex(null);
                        setDragOverIndex(null);
                      }}
                    >
                      {getPieceIcon(piece.ascii, pieceSetId)}
                    </span>
                  )}
                  {legal && (
                    <span
                      className={`play-legal-mark${legal.capture ? " play-legal-mark--capture" : ""}`}
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
