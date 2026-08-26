import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Squares } from "./engine/pieces";
import { getPieceIcon, LETTER_BY_TYPE, type PieceType, type PieceSetId } from "./pieceSets";
import { useBoardSettings } from "../../context/BoardSettingsContext";
import PlayBoard, { type LegalTarget } from "./PlayBoard";
import "./boardStage.styles.css";

const CAPTURE_ORDER: PieceType[] = ["pawn", "knight", "bishop", "rook", "queen"];
const PIECE_VALUE: Record<PieceType, number> = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 0,
};

function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function sortForTray(pieces: PieceType[]): PieceType[] {
  return [...pieces].sort((a, b) => CAPTURE_ORDER.indexOf(a) - CAPTURE_ORDER.indexOf(b));
}

function materialValue(pieces: PieceType[]): number {
  return pieces.reduce((sum, p) => sum + PIECE_VALUE[p], 0);
}

// The engine's ascii convention is lowercase = white, uppercase = black --
// a captured-piece tray only ever holds one color (the *opponent's* pieces,
// see capturedColor below), so this just picks the right case.
function capturedAscii(type: PieceType, color: "w" | "b"): string {
  const letter = LETTER_BY_TYPE[type];
  return color === "w" ? letter : letter.toUpperCase();
}

// Ticks whichever side's clock is active, one second at a time, and calls
// onFlagFall exactly once for whichever side's clock reaches zero first
// (guarded by firedRef so a re-render or a lagging interval tick never
// fires it twice for the same game).
function useChessClocks(
  activePlayer: "w" | "b" | null,
  resetToken: number,
  initialMs: number,
  onFlagFall: (color: "w" | "b") => void
) {
  const [whiteMs, setWhiteMs] = useState(initialMs);
  const [blackMs, setBlackMs] = useState(initialMs);
  const firedRef = useRef(false);

  useEffect(() => {
    setWhiteMs(initialMs);
    setBlackMs(initialMs);
    firedRef.current = false;
    // Only the token identifies a fresh game -- initialMs doesn't change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetToken]);

  useEffect(() => {
    if (activePlayer == null) return undefined;
    const id = window.setInterval(() => {
      if (activePlayer === "w") setWhiteMs((ms) => Math.max(0, ms - 1000));
      else setBlackMs((ms) => Math.max(0, ms - 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, [activePlayer]);

  useEffect(() => {
    if (firedRef.current) return;
    if (whiteMs <= 0) {
      firedRef.current = true;
      onFlagFall("w");
    } else if (blackMs <= 0) {
      firedRef.current = true;
      onFlagFall("b");
    }
  }, [whiteMs, blackMs, onFlagFall]);

  return { whiteMs, blackMs };
}

function ClockChip({ ms, running }: { ms: number; running: boolean }) {
  const label = formatClock(ms);
  const seconds = Math.ceil(ms / 1000);
  // Only the running clock is actually counting down -- announcing the
  // idle side's static remaining time is just noise. Fixed thresholds
  // (not "every second under 30") keep this from firing ~30 times.
  const announce = running && (seconds === 30 || seconds === 10 || seconds === 5);
  return (
    <div
      className={`play-clock${running ? " play-clock--running" : ""}`}
      aria-live="off"
    >
      {label}
      {announce && (
        <span className="visually-hidden" aria-live="polite">
          {seconds} seconds left
        </span>
      )}
    </div>
  );
}

// Generic, gender-neutral silhouette -- we don't know anything about the
// human player, so this is deliberately just a head-and-shoulders shape
// rather than a stylized person.
function PersonAvatarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <circle cx="12" cy="8.2" r="4" fill="currentColor" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="currentColor" />
    </svg>
  );
}

// The opponent is always the chess engine -- a small monitor-with-a-face
// reads unambiguously as "computer" at avatar size without needing a label.
function ComputerAvatarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <rect
        x="4"
        y="5"
        width="16"
        height="11"
        rx="2"
        fill="currentColor"
        opacity="0.16"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="10.4" r="1.25" fill="currentColor" />
      <circle cx="15" cy="10.4" r="1.25" fill="currentColor" />
      <path
        d="M9 13.4c1 .8 5 .8 6 0"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M10.5 16v3M13.5 16v3M8.5 19h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlayerBar({
  isBot,
  label,
  captured,
  capturedColor,
  pieceSetId,
  materialLead,
  clockMs,
  clockRunning,
}: {
  isBot: boolean;
  label: string;
  captured: PieceType[];
  capturedColor: "w" | "b";
  pieceSetId: PieceSetId;
  materialLead: number;
  clockMs: number;
  clockRunning: boolean;
}) {
  return (
    <div className="play-board-bar">
      <div className="play-board-bar-avatar" aria-hidden="true">
        {isBot ? <ComputerAvatarIcon /> : <PersonAvatarIcon />}
      </div>
      <div className="play-board-bar-info">
        <div className="play-board-bar-name">{label}</div>
        <div className="play-captured-row">
          {sortForTray(captured).map((type, i) => (
            <span className="play-captured-piece" key={i}>
              {getPieceIcon(capturedAscii(type, capturedColor), pieceSetId)}
            </span>
          ))}
        </div>
      </div>
      <div className="play-board-bar-corner">
        {materialLead > 0 && <span className="play-material-lead">+{materialLead}</span>}
        <ClockChip ms={clockMs} running={clockRunning} />
      </div>
    </div>
  );
}

export interface BoardStageProps {
  squares: Squares;
  selected: number | null;
  legalTargets: LegalTarget[];
  lastMoveSquares: number[];
  checkSquare: number | null;
  movablePlayer: "w" | "b" | null;
  flipped: boolean;
  onSquareClick: (index: number) => void;
  onFlip: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  humanPlayer: "w" | "b";
  activePlayer: "w" | "b" | null;
  clockResetToken: number;
  initialClockMs: number;
  capturedByWhite: PieceType[];
  capturedByBlack: PieceType[];
  onTimeExpire: (color: "w" | "b") => void;
}

// The board itself plus the two player info bars docked to its top-right
// and bottom-right corners (avatar, captured pieces, material lead, clock)
// -- opponent above the board, human below, matching the board's own
// flip so the human's bar always ends up nearest them.
export default function BoardStage({
  humanPlayer,
  activePlayer,
  clockResetToken,
  initialClockMs,
  capturedByWhite,
  capturedByBlack,
  onTimeExpire,
  ...boardProps
}: BoardStageProps) {
  const { t } = useTranslation();
  const { pieceSetId } = useBoardSettings();
  const { whiteMs, blackMs } = useChessClocks(activePlayer, clockResetToken, initialClockMs, onTimeExpire);

  const material = materialValue(capturedByWhite) - materialValue(capturedByBlack);

  const whiteBar = (
    <PlayerBar
      isBot={humanPlayer !== "w"}
      label={t("game.white")}
      captured={capturedByWhite}
      capturedColor="b"
      pieceSetId={pieceSetId}
      materialLead={material > 0 ? material : 0}
      clockMs={whiteMs}
      clockRunning={activePlayer === "w"}
    />
  );
  const blackBar = (
    <PlayerBar
      isBot={humanPlayer !== "b"}
      label={t("game.black")}
      captured={capturedByBlack}
      capturedColor="w"
      pieceSetId={pieceSetId}
      materialLead={material < 0 ? -material : 0}
      clockMs={blackMs}
      clockRunning={activePlayer === "b"}
    />
  );
  const topBar = humanPlayer === "w" ? blackBar : whiteBar;
  const bottomBar = humanPlayer === "w" ? whiteBar : blackBar;

  return (
    <div className="play-board-shell">
      {topBar}
      <PlayBoard {...boardProps} />
      {bottomBar}
    </div>
  );
}
