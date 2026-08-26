import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { BOARD_THEMES, DEFAULT_BOARD_THEME_ID } from "../components/Game/boardThemes";
import { PIECE_SETS, DEFAULT_PIECE_SET_ID } from "../components/Game/pieceSets";
import type { BoardThemeId } from "../components/Game/boardThemes";
import type { PieceSetId } from "../components/Game/pieceSets";

export type LastMoveStyle = "flat" | "sunken";
export type BoardSize = "small" | "medium" | "large";

const LAST_MOVE_STYLES: LastMoveStyle[] = ["flat", "sunken"];
const BOARD_SIZES: BoardSize[] = ["small", "medium", "large"];
const DEFAULT_LAST_MOVE_STYLE: LastMoveStyle = "flat";
const DEFAULT_BOARD_SIZE: BoardSize = "large";

interface BoardSettingsContextValue {
  boardThemeId: BoardThemeId;
  pieceSetId: PieceSetId;
  showMoveHints: boolean;
  raisedPieces: boolean;
  lastMoveStyle: LastMoveStyle;
  boardSize: BoardSize;
  setBoardThemeId: (id: BoardThemeId) => void;
  setPieceSetId: (id: PieceSetId) => void;
  setShowMoveHints: (value: boolean) => void;
  setRaisedPieces: (value: boolean) => void;
  setLastMoveStyle: (value: LastMoveStyle) => void;
  setBoardSize: (value: BoardSize) => void;
}

const STORAGE_KEY = "boardSettings";

const BoardSettingsContext = createContext<BoardSettingsContextValue | null>(
  null
);

interface StoredSettings {
  boardThemeId?: string;
  pieceSetId?: string;
  showMoveHints?: boolean;
  raisedPieces?: boolean;
  lastMoveStyle?: string;
  boardSize?: string;
}

function readStoredSettings(): StoredSettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed != null && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as StoredSettings)
      : {};
  } catch {
    return {};
  }
}

function getInitialBoardThemeId(): BoardThemeId {
  const stored = readStoredSettings().boardThemeId;
  return BOARD_THEMES.some((t) => t.id === stored)
    ? (stored as BoardThemeId)
    : DEFAULT_BOARD_THEME_ID;
}

function getInitialPieceSetId(): PieceSetId {
  const stored = readStoredSettings().pieceSetId;
  return PIECE_SETS.some((p) => p.id === stored)
    ? (stored as PieceSetId)
    : DEFAULT_PIECE_SET_ID;
}

function getInitialShowMoveHints(): boolean {
  const stored = readStoredSettings().showMoveHints;
  return typeof stored === "boolean" ? stored : true;
}

function getInitialRaisedPieces(): boolean {
  const stored = readStoredSettings().raisedPieces;
  return typeof stored === "boolean" ? stored : true;
}

function getInitialLastMoveStyle(): LastMoveStyle {
  const stored = readStoredSettings().lastMoveStyle;
  return LAST_MOVE_STYLES.includes(stored as LastMoveStyle)
    ? (stored as LastMoveStyle)
    : DEFAULT_LAST_MOVE_STYLE;
}

function getInitialBoardSize(): BoardSize {
  const stored = readStoredSettings().boardSize;
  return BOARD_SIZES.includes(stored as BoardSize)
    ? (stored as BoardSize)
    : DEFAULT_BOARD_SIZE;
}

export function BoardSettingsProvider({ children }: { children: ReactNode }) {
  const [boardThemeId, setBoardThemeId] = useState<BoardThemeId>(
    getInitialBoardThemeId
  );
  const [pieceSetId, setPieceSetId] = useState<PieceSetId>(
    getInitialPieceSetId
  );
  const [showMoveHints, setShowMoveHints] = useState<boolean>(
    getInitialShowMoveHints
  );
  const [raisedPieces, setRaisedPieces] = useState<boolean>(
    getInitialRaisedPieces
  );
  const [lastMoveStyle, setLastMoveStyle] = useState<LastMoveStyle>(
    getInitialLastMoveStyle
  );
  const [boardSize, setBoardSize] = useState<BoardSize>(getInitialBoardSize);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        boardThemeId,
        pieceSetId,
        showMoveHints,
        raisedPieces,
        lastMoveStyle,
        boardSize,
      })
    );
  }, [boardThemeId, pieceSetId, showMoveHints, raisedPieces, lastMoveStyle, boardSize]);

  const setBoardThemeIdCb = useCallback((id: BoardThemeId) => {
    setBoardThemeId(id);
  }, []);
  const setPieceSetIdCb = useCallback((id: PieceSetId) => {
    setPieceSetId(id);
  }, []);
  const setShowMoveHintsCb = useCallback((value: boolean) => {
    setShowMoveHints(value);
  }, []);
  const setRaisedPiecesCb = useCallback((value: boolean) => {
    setRaisedPieces(value);
  }, []);
  const setLastMoveStyleCb = useCallback((value: LastMoveStyle) => {
    setLastMoveStyle(value);
  }, []);
  const setBoardSizeCb = useCallback((value: BoardSize) => {
    setBoardSize(value);
  }, []);

  return (
    <BoardSettingsContext.Provider
      value={{
        boardThemeId,
        pieceSetId,
        showMoveHints,
        raisedPieces,
        lastMoveStyle,
        boardSize,
        setBoardThemeId: setBoardThemeIdCb,
        setPieceSetId: setPieceSetIdCb,
        setShowMoveHints: setShowMoveHintsCb,
        setRaisedPieces: setRaisedPiecesCb,
        setLastMoveStyle: setLastMoveStyleCb,
        setBoardSize: setBoardSizeCb,
      }}
    >
      {children}
    </BoardSettingsContext.Provider>
  );
}

export function useBoardSettings(): BoardSettingsContextValue {
  const ctx = useContext(BoardSettingsContext);
  if (ctx == null) {
    throw new Error(
      "useBoardSettings must be used within a BoardSettingsProvider"
    );
  }
  return ctx;
}
