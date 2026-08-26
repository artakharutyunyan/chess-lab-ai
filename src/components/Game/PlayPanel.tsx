import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPieceIcon, LETTER_BY_TYPE, type PieceType, type PieceSetId } from "./pieceSets";
import type { MoveRow } from "./notation";
import { DIFFICULTY_LEVELS, STOCKFISH_DIFFICULTY_PRESETS, type Difficulty } from "./engine/ai";
import BoardSettingsModal from "./BoardSettingsModal";
import ConfirmDialog from "./ConfirmDialog";
import { useBoardSettings } from "../../context/BoardSettingsContext";
import "./playPanel.styles.css";

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

// Ticks whichever side's clock is active, one second at a time. Isolated
// here (rather than in Board's state) so a tick only re-renders the panel,
// not the whole board.
function useChessClocks(activePlayer: "w" | "b" | null, resetToken: number, initialMs: number) {
  const [whiteMs, setWhiteMs] = useState(initialMs);
  const [blackMs, setBlackMs] = useState(initialMs);

  useEffect(() => {
    setWhiteMs(initialMs);
    setBlackMs(initialMs);
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

function PlayerRow({
  label,
  captured,
  capturedColor,
  pieceSetId,
  materialLead,
  clockMs,
  clockRunning,
}: {
  label: string;
  captured: PieceType[];
  capturedColor: "w" | "b";
  pieceSetId: PieceSetId;
  materialLead: number;
  clockMs: number;
  clockRunning: boolean;
}) {
  return (
    <div className="play-player-row">
      <div className="play-avatar" aria-hidden="true" />
      <div className="play-player-info">
        <div className="play-player-name">{label}</div>
        <div className="play-captured-row">
          {sortForTray(captured).map((type, i) => (
            <span className="play-captured-piece" key={i}>
              {getPieceIcon(capturedAscii(type, capturedColor), pieceSetId)}
            </span>
          ))}
          {materialLead > 0 && <span className="play-material-lead">+{materialLead}</span>}
        </div>
      </div>
      <ClockChip ms={clockMs} running={clockRunning} />
    </div>
  );
}

function IconFirst() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <rect x="4" y="4" width="1.8" height="12" fill="currentColor" />
      <path d="M15 4 L7 10 L15 16 Z" fill="currentColor" />
    </svg>
  );
}
function IconPrev() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path d="M13 4 L6 10 L13 16 Z" fill="currentColor" />
    </svg>
  );
}
function IconNext() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path d="M7 4 L14 10 L7 16 Z" fill="currentColor" />
    </svg>
  );
}
function IconLast() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <rect x="14.2" y="4" width="1.8" height="12" fill="currentColor" />
      <path d="M5 4 L13 10 L5 16 Z" fill="currentColor" />
    </svg>
  );
}
function IconFlip() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path
        d="M5 7 H13 M13 7 L10.5 4.5 M13 7 L10.5 9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 13 H7 M7 13 L9.5 10.5 M7 13 L9.5 15.5"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconRestart() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path
        d="M15.5 10a5.5 5.5 0 1 1-1.8-4.1"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M14.5 3.5 L14.5 6.5 L11.5 6.5 Z" fill="currentColor" />
    </svg>
  );
}
function IconGear() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <circle cx="10" cy="10" r="2.6" fill="currentColor" />
      <path
        d="M10 3.2v1.8M10 15v1.8M16.8 10H15M5 10H3.2M14.8 5.2l-1.3 1.3M6.5 13.5l-1.3 1.3M14.8 14.8l-1.3-1.3M6.5 6.5 5.2 5.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconFlag() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path
        d="M6 3v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M6 4 C9 2.5 11 5.5 14 4 V10 C11 11.5 9 8.5 6 10 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export interface PlayPanelProps {
  capturedByWhite: PieceType[];
  capturedByBlack: PieceType[];
  moveRows: MoveRow[];
  currentMoveIndex: number;
  openingName: string | null;
  activePlayer: "w" | "b" | null;
  clockResetToken: number;
  initialClockMs: number;
  resultText: string | null;
  whiteLabel: string;
  blackLabel: string;
  humanPlayer: "w" | "b";
  difficulty: Difficulty;
  onSelectDifficulty: (level: Difficulty) => void;
  gameOver: boolean;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  onFlip: () => void;
  onRestart: () => void;
  onResign: () => void;
}

export default function PlayPanel({
  capturedByWhite,
  capturedByBlack,
  moveRows,
  currentMoveIndex,
  openingName,
  activePlayer,
  clockResetToken,
  initialClockMs,
  resultText,
  whiteLabel,
  blackLabel,
  humanPlayer,
  difficulty,
  onSelectDifficulty,
  gameOver,
  onFirst,
  onPrev,
  onNext,
  onLast,
  onFlip,
  onRestart,
  onResign,
}: PlayPanelProps) {
  const { t } = useTranslation();
  const { pieceSetId } = useBoardSettings();
  const { whiteMs, blackMs } = useChessClocks(activePlayer, clockResetToken, initialClockMs);
  const currentMoveRef = useRef<HTMLSpanElement>(null);
  const moveListBodyRef = useRef<HTMLOListElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resignConfirmOpen, setResignConfirmOpen] = useState(false);

  useEffect(() => {
    // Scroll only the move list's own scroll container into position --
    // element.scrollIntoView() walks up every scrollable ancestor including
    // the page itself, which on mobile (where the panel sits below the
    // board) yanked the whole page down to the move list after every move.
    const el = currentMoveRef.current;
    const container = moveListBodyRef.current;
    if (!el || !container) return;
    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;
    const viewTop = container.scrollTop;
    const viewBottom = viewTop + container.clientHeight;
    if (elTop < viewTop) {
      container.scrollTop = elTop;
    } else if (elBottom > viewBottom) {
      container.scrollTop = elBottom - container.clientHeight;
    }
  }, [currentMoveIndex]);

  const material = materialValue(capturedByWhite) - materialValue(capturedByBlack);

  const currentRow = currentMoveIndex > 0 ? Math.floor((currentMoveIndex - 1) / 2) : -1;
  const currentColor = currentMoveIndex % 2 === 1 ? "white" : "black";

  // Opponent on top, human on the bottom -- matches the board's own
  // orientation (which flips the same way when playing black).
  const whiteRow = (
    <PlayerRow
      label={whiteLabel}
      captured={capturedByWhite}
      capturedColor="b"
      pieceSetId={pieceSetId}
      materialLead={material > 0 ? material : 0}
      clockMs={whiteMs}
      clockRunning={activePlayer === "w"}
    />
  );
  const blackRow = (
    <PlayerRow
      label={blackLabel}
      captured={capturedByBlack}
      capturedColor="w"
      pieceSetId={pieceSetId}
      materialLead={material < 0 ? -material : 0}
      clockMs={blackMs}
      clockRunning={activePlayer === "b"}
    />
  );
  const topRow = humanPlayer === "w" ? blackRow : whiteRow;
  const bottomRow = humanPlayer === "w" ? whiteRow : blackRow;

  return (
    <div className="play-panel">
      {topRow}

      <div className="play-engine-row">
        <span className="play-engine-label">{t("game.difficulty")}</span>
        <select
          className="play-difficulty-select"
          value={difficulty}
          aria-label={t("game.changeDifficulty")}
          onChange={(e) => onSelectDifficulty(e.target.value as Difficulty)}
        >
          {DIFFICULTY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {t(`game.difficulty${level.charAt(0).toUpperCase()}${level.slice(1)}`)} (~
              {STOCKFISH_DIFFICULTY_PRESETS[level].approxElo})
            </option>
          ))}
        </select>
      </div>

      <div className="play-movelist">
        <div className="play-movelist-header">
          {resultText ? (
            <span className="play-result-banner">{resultText}</span>
          ) : (
            <>
              <span className="play-movelist-label">{t("game.moves")}</span>
              {openingName && <span className="play-opening-name">{openingName}</span>}
            </>
          )}
        </div>
        <ol className="play-movelist-body" ref={moveListBodyRef}>
          {moveRows.map((row, i) => (
            <li className="play-move-row" key={row.number}>
              <span className="play-move-number">{row.number}.</span>
              <span
                ref={i === currentRow && currentColor === "white" ? currentMoveRef : undefined}
                className={
                  "play-move-cell" +
                  (i === currentRow && currentColor === "white" ? " play-move-cell--current" : "")
                }
                aria-current={i === currentRow && currentColor === "white" ? "step" : undefined}
              >
                {row.white}
              </span>
              <span
                ref={i === currentRow && currentColor === "black" ? currentMoveRef : undefined}
                className={
                  "play-move-cell" +
                  (i === currentRow && currentColor === "black" ? " play-move-cell--current" : "")
                }
                aria-current={i === currentRow && currentColor === "black" ? "step" : undefined}
              >
                {row.black}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {bottomRow}

      <div className="play-controls">
        <div className="play-controls-segment">
          <button type="button" className="play-control-button" onClick={onFirst} aria-label={t("game.firstMove")}>
            <IconFirst />
          </button>
          <button type="button" className="play-control-button" onClick={onPrev} aria-label={t("game.previousMove")}>
            <IconPrev />
          </button>
          <button type="button" className="play-control-button" onClick={onNext} aria-label={t("game.nextMove")}>
            <IconNext />
          </button>
          <button type="button" className="play-control-button" onClick={onLast} aria-label={t("game.lastMove")}>
            <IconLast />
          </button>
        </div>
        <div className="play-controls-spacer" />
        <button
          type="button"
          className="play-control-button play-control-button--solo"
          onClick={() => setResignConfirmOpen(true)}
          disabled={gameOver}
          aria-label={t("game.resign")}
        >
          <IconFlag />
        </button>
        <button
          type="button"
          className="play-control-button play-control-button--solo"
          onClick={onFlip}
          aria-label={t("game.flipBoard")}
        >
          <IconFlip />
        </button>
        <button
          type="button"
          className="play-control-button play-control-button--solo"
          onClick={onRestart}
          aria-label={t("game.restart")}
        >
          <IconRestart />
        </button>
        <button
          type="button"
          className="play-control-button play-control-button--solo"
          onClick={() => setSettingsOpen(true)}
          aria-label={t("game.openSettings")}
        >
          <IconGear />
        </button>
      </div>

      {settingsOpen && <BoardSettingsModal onClose={() => setSettingsOpen(false)} />}
      {resignConfirmOpen && (
        <ConfirmDialog
          message={t("game.confirmResign")}
          confirmLabel={t("game.resign")}
          cancelLabel={t("game.cancel")}
          onConfirm={() => {
            setResignConfirmOpen(false);
            onResign();
          }}
          onCancel={() => setResignConfirmOpen(false)}
        />
      )}
    </div>
  );
}
