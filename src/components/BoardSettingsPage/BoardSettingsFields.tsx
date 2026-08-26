import { useTranslation } from "react-i18next";

import "./boardSettingsPage.styles.css";
import {
  useBoardSettings,
  type BoardSize,
  type LastMoveStyle,
} from "../../context/BoardSettingsContext";
import { BOARD_THEMES } from "../Game/boardThemes";
import { PIECE_SETS, getPieceIcon } from "../Game/pieceSets";

const LAST_MOVE_STYLES: LastMoveStyle[] = ["flat", "sunken"];
const BOARD_SIZES: BoardSize[] = ["small", "medium", "large"];

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface PieceCredit {
  id: string;
  // One or more boardSettings.pieceSets.<key> suffixes -- two when a single
  // credit line covers multiple sets (3D and Celtic share one artist).
  setKeys: string[];
  author: string;
  authorUrl?: string;
  licenseName: string;
  licenseUrl: string;
}

// Artist names and license identifiers (CC BY 4.0, GPLv2+, ...) are proper
// nouns/standard short-names, not prose -- left as-is in every language.
// Only the connective text around them (in the JSX below) is translated.
const PIECE_CREDITS: PieceCredit[] = [
  {
    id: "minimal",
    setKeys: ["minimal"],
    author: "neverRare",
    authorUrl: "https://github.com/neverRare",
    licenseName: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  },
  {
    id: "bold",
    setKeys: ["bold"],
    author: "Alexis Luengas",
    authorUrl: "https://github.com/LexLuengas",
    licenseName: "Apache 2.0",
    licenseUrl: "https://github.com/LexLuengas/chessnut-pieces/blob/master/LICENSE.txt",
  },
  {
    id: "staunton",
    setKeys: ["staunton"],
    author: "Colin M.L. Burnett",
    licenseName: "GPLv2+",
    licenseUrl: "https://www.gnu.org/licenses/gpl-2.0.txt",
  },
  {
    id: "merida",
    setKeys: ["merida"],
    author: "Armando Hernandez Marroquin",
    licenseName: "GPLv2+",
    licenseUrl: "https://www.gnu.org/licenses/gpl-2.0.txt",
  },
  {
    id: "three-d-celtic",
    setKeys: ["threeD", "celtic"],
    author: "Maurizio Monge",
    authorUrl: "https://github.com/maurimo/chess-art",
    licenseName: "MIT",
    licenseUrl: "https://github.com/maurimo/chess-art/blob/main/LICENSE",
  },
  {
    id: "rustic",
    setKeys: ["rustic"],
    author: "RhosGFX",
    authorUrl: "https://rhosgfx.itch.io/",
    licenseName: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
];

// The full set of board/piece options, shared by the standalone /board page
// (BoardSettingsPage.tsx) and the in-game settings dialog opened from
// PlayPanel.tsx's gear button -- both just wrap this in their own shell.
export default function BoardSettingsFields() {
  const { t } = useTranslation();
  const {
    boardThemeId,
    pieceSetId,
    showMoveHints,
    raisedPieces,
    lastMoveStyle,
    boardSize,
    setBoardThemeId,
    setPieceSetId,
    setShowMoveHints,
    setRaisedPieces,
    setLastMoveStyle,
    setBoardSize,
  } = useBoardSettings();

  return (
    <>
      <section className="board-settings-section">
        <h2 className="board-settings-heading">
          {t("boardSettings.colorsHeading")}
        </h2>
        <div className="board-theme-grid">
          {BOARD_THEMES.map((theme) => (
            <button
              type="button"
              key={theme.id}
              className={
                "board-theme-option" +
                (theme.id === boardThemeId ? " board-theme-option--selected" : "")
              }
              onClick={() => setBoardThemeId(theme.id)}
              aria-pressed={theme.id === boardThemeId}
            >
              <span className="board-theme-swatch" aria-hidden="true">
                <span style={{ backgroundColor: theme.light }} />
                <span style={{ backgroundColor: theme.dark }} />
                <span style={{ backgroundColor: theme.dark }} />
                <span style={{ backgroundColor: theme.light }} />
              </span>
              <span className="board-theme-name">{t(theme.name)}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="board-settings-section">
        <h2 className="board-settings-heading">
          {t("boardSettings.pieceStyleHeading")}
        </h2>
        <div className="piece-set-grid">
          {PIECE_SETS.map((set) => (
            <button
              type="button"
              key={set.id}
              className={
                "piece-set-option" +
                (set.id === pieceSetId ? " piece-set-option--selected" : "")
              }
              onClick={() => setPieceSetId(set.id)}
              aria-pressed={set.id === pieceSetId}
            >
              <span className="piece-set-preview" aria-hidden="true">
                {getPieceIcon("k", set.id)}
                {getPieceIcon("K", set.id)}
              </span>
              <span className="piece-set-name">{t(set.name)}</span>
            </button>
          ))}
        </div>
        <p className="piece-set-credit">
          {t("boardSettings.pieceCreditsIntro")}{" "}
          <a
            href="https://github.com/lichess-org/lila/tree/master/public/piece"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("boardSettings.pieceCreditsLibraryLink")}
          </a>
          :{" "}
          {PIECE_CREDITS.map((credit, i) => (
            <span key={credit.id}>
              {credit.setKeys
                .map((key) => t(`boardSettings.pieceSets.${key}`))
                .join(` ${t("boardSettings.and")} `)}{" "}
              (
              {credit.authorUrl ? (
                <a href={credit.authorUrl} target="_blank" rel="noopener noreferrer">
                  {credit.author}
                </a>
              ) : (
                credit.author
              )}
              ,{" "}
              <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer">
                {credit.licenseName}
              </a>
              ){i < PIECE_CREDITS.length - 1 ? ". " : "."}
            </span>
          ))}
        </p>
      </section>

      <section className="board-settings-section">
        <h2 className="board-settings-heading">
          {t("boardSettings.optionsHeading")}
        </h2>

        <div className="board-toggle-row">
          <label className="board-toggle">
            <input
              type="checkbox"
              checked={showMoveHints}
              onChange={(e) => setShowMoveHints(e.target.checked)}
            />
            <span>{t("boardSettings.showMoveHints")}</span>
          </label>
          <label className="board-toggle">
            <input
              type="checkbox"
              checked={raisedPieces}
              onChange={(e) => setRaisedPieces(e.target.checked)}
            />
            <span>{t("boardSettings.raisedPieces")}</span>
          </label>
        </div>

        <div className="board-settings-subrow">
          <span className="board-settings-label">
            {t("boardSettings.lastMoveHeading")}
          </span>
          <div className="board-chip-group" role="group" aria-label={t("boardSettings.lastMoveHeading")}>
            {LAST_MOVE_STYLES.map((style) => (
              <button
                type="button"
                key={style}
                className={
                  "board-chip" + (lastMoveStyle === style ? " board-chip--selected" : "")
                }
                aria-pressed={lastMoveStyle === style}
                onClick={() => setLastMoveStyle(style)}
              >
                {t(`boardSettings.lastMoveStyle${capitalize(style)}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="board-settings-subrow">
          <span className="board-settings-label">
            {t("boardSettings.boardSizeHeading")}
          </span>
          <div className="board-chip-group" role="group" aria-label={t("boardSettings.boardSizeHeading")}>
            {BOARD_SIZES.map((size) => (
              <button
                type="button"
                key={size}
                className={
                  "board-chip" + (boardSize === size ? " board-chip--selected" : "")
                }
                aria-pressed={boardSize === size}
                onClick={() => setBoardSize(size)}
              >
                {t(`boardSettings.boardSize${capitalize(size)}`)}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
