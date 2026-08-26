# Chess Lab Ai

A chess app built with React: play against a real Stockfish engine, browse the
history of World Chess Champions, and customize how the board and pieces look.
Available in English, Russian, and Armenian, with light and dark themes.

![Home page](docs/screenshots/home-page.jpg)

![Play page](docs/screenshots/play-page.jpg)

## Features

- **Play against the computer** — click, drag-and-drop, or full keyboard control
  (arrow keys move a cursor, Enter/Space selects and moves, modified arrows step
  through history, `f` flips the board). Choose your side, a time control from
  1 minute to 2 hours, and a difficulty level (Easy through Grandmaster, each
  labeled with its approximate Elo) before starting — changeable mid-game too.
  Resign at any point via a confirm dialog; captured pieces are tracked in a
  tray next to each player's clock, rendered in whichever piece style you've
  picked so they always match the board.
- **Stockfish-powered opponent** — the bot's moves come from
  [Stockfish](https://stockfishchess.org/) (GPLv3), run client-side via
  WebAssembly in a Web Worker (see `src/components/Game/engine/stockfish.ts`),
  with strength tuned via Stockfish's own Skill Level option. If the engine
  can't start in a given browser, play falls back automatically to a small
  local minimax bot (`src/components/Game/engine/ai.ts`) so the game keeps
  working either way. Real-time clocks, full move history with algebraic
  notation, and board flipping are all part of the Play page.
- **World Champions** — a gallery of every undisputed World Chess Champion from
  Wilhelm Steinitz to the present, each linking out to their Wikipedia article.
  The reigning champion also gets a teaser card on the Home page.
- **Board customization** — 11 board color themes and 8 piece styles (a
  classic set plus seven open-licensed sets: Minimal, Bold, Staunton, Merida,
  3D, Rustic, and Celtic — see credits on the Board page), move-hint/
  raised-piece/last-move-highlight toggles, and board size, all saved to your
  device and available both from the dedicated Board page and a quick-access
  dialog opened from the Play page itself.
- **Rules page** — a full walkthrough of how to play: objective, setup, how
  each piece moves, castling/en passant/promotion, check/checkmate/stalemate,
  draws, and how to read algebraic notation. Available in all three languages.
- **Light and dark themes**, remembered across visits.
- **Internationalized** — English, Russian, and Armenian.

## Getting started

```bash
npm install
npm run dev      # start the dev server (Vite)
```

Other scripts:

```bash
npm test          # run the test suite once (Vitest)
npm run test:watch  # run tests in watch mode
npm run build      # production build
npm run preview     # preview the production build locally
```

## Tech stack

- [React 19](https://react.dev/) with [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/) for dev/build tooling
- TypeScript, adopted incrementally — the chess engine (`src/components/Game/engine`)
  and newer components are fully typed; some older UI components remain `.jsx`
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)
- [react-i18next](https://react.i18next.com/) for translations
- [Stockfish](https://stockfishchess.org/) (GPLv3) compiled to WebAssembly,
  vendored under `public/stockfish/` (see `NOTICE.md` there for licensing)

## Project structure

```text
src/
  components/
    Game/            # the Play page: board, panel, setup screen, and the AI engine
      engine/        # pieces, move rules, Stockfish/FEN glue, and the minimax fallback -- no UI code
    BoardSettingsPage/ # dedicated /board page; BoardSettingsFields.tsx is shared
                        # with the in-game settings dialog (Game/BoardSettingsModal.tsx)
    ChampionsListPage/
    RulesPage/
    HomePage/
    Header/
  context/           # theme and board-settings React context providers
  i18n/translations/ # en / ru / am
docs/                # design specs and reference screenshots
```

## Design docs

`docs/PLAY-PAGE-SPEC.md` is the approved design spec the current Play page was
built against, with reference mockups in `docs/play-page-design/`.

`docs/DESIGN-apple.md` is the Apple-derived design token reference (color,
typography, spacing, radius, and elevation system) guiding the app's visual
redesign.
