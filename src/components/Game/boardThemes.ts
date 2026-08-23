export interface BoardTheme {
  id: string;
  name: string;
  light: string;
  dark: string;
}

// `name` is an i18n key (see src/i18n/translations/*.js -> boardSettings.themes),
// matching the pattern used for champion names in ChampionsListPage/constants.js.
export const BOARD_THEMES = [
  {
    id: "classic-green",
    name: "boardSettings.themes.classicGreen",
    light: "#eeeed2",
    dark: "#769656",
  },
  {
    id: "ocean-blue",
    name: "boardSettings.themes.oceanBlue",
    light: "#dfe9f2",
    dark: "#4a77a8",
  },
  {
    id: "walnut-brown",
    name: "boardSettings.themes.walnutBrown",
    light: "#e8d6b3",
    dark: "#8b5e3c",
  },
  {
    id: "charcoal-gray",
    name: "boardSettings.themes.charcoalGray",
    light: "#e4e4e4",
    dark: "#5a5a5a",
  },
  {
    id: "coral-sunset",
    name: "boardSettings.themes.coralSunset",
    light: "#fbe4d8",
    dark: "#c2694f",
  },
] as const satisfies readonly BoardTheme[];

export type BoardThemeId = (typeof BOARD_THEMES)[number]["id"];

export const DEFAULT_BOARD_THEME_ID: BoardThemeId = "classic-green";

export function getBoardTheme(id: string): BoardTheme {
  return BOARD_THEMES.find((t) => t.id === id) ?? BOARD_THEMES[0];
}
