import React from "react";
import { withTranslation } from "react-i18next";

import { Board } from "./Board";
import { useBoardSettings } from "../../context/BoardSettingsContext";
import { getBoardTheme } from "./boardThemes";

const TranslatedBoard = withTranslation()(Board);

const SQ_SIZE_BY_BOARD_SIZE = {
  small: "64px",
  medium: "76px",
  large: "88px",
};

// Injects the selected board color pair and square size as CSS custom
// properties that playBoard.styles.css reads (with the classic colors/size
// as fallback, so nothing changes for anyone who hasn't picked a theme).
// Kept as a thin wrapper so Board.jsx itself -- and the engine it drives --
// never has to know board color/size are configurable.
export function Game(props) {
  const { boardThemeId, boardSize } = useBoardSettings();
  const theme = getBoardTheme(boardThemeId);
  const sqSize = SQ_SIZE_BY_BOARD_SIZE[boardSize] ?? SQ_SIZE_BY_BOARD_SIZE.large;

  return (
    <div
      style={{
        "--board-light": theme.light,
        "--board-dark": theme.dark,
        "--sq-size-setting": sqSize,
      }}
    >
      <TranslatedBoard {...props} />
    </div>
  );
}
