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

interface BoardSettingsContextValue {
  boardThemeId: BoardThemeId;
  pieceSetId: PieceSetId;
  setBoardThemeId: (id: BoardThemeId) => void;
  setPieceSetId: (id: PieceSetId) => void;
}

const STORAGE_KEY = "boardSettings";

const BoardSettingsContext = createContext<BoardSettingsContextValue | null>(
  null
);

interface StoredSettings {
  boardThemeId?: string;
  pieceSetId?: string;
}

function readStoredSettings(): StoredSettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
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

export function BoardSettingsProvider({ children }: { children: ReactNode }) {
  const [boardThemeId, setBoardThemeId] = useState<BoardThemeId>(
    getInitialBoardThemeId
  );
  const [pieceSetId, setPieceSetId] = useState<PieceSetId>(
    getInitialPieceSetId
  );

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ boardThemeId, pieceSetId })
    );
  }, [boardThemeId, pieceSetId]);

  const setBoardThemeIdCb = useCallback((id: BoardThemeId) => {
    setBoardThemeId(id);
  }, []);
  const setPieceSetIdCb = useCallback((id: PieceSetId) => {
    setPieceSetId(id);
  }, []);

  return (
    <BoardSettingsContext.Provider
      value={{
        boardThemeId,
        pieceSetId,
        setBoardThemeId: setBoardThemeIdCb,
        setPieceSetId: setPieceSetIdCb,
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
