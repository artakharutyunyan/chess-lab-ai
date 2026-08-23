# Play page — implementation spec

Target: rebuild the `/play` route to match the approved design. Board left, dark side
panel right. Nothing outside this page changes except the shared header.

## Design tokens

Define once (CSS custom properties on `:root` / `[data-theme="dark"]`). Do not
hard-code these anywhere else.

| Token | Light | Dark |
| --- | --- | --- |
| `--page-bg` | `#F4F3EE` | `#121517` |
| `--header-bg` | `#FBFAF6` | `#191D20` |
| `--border` | `#E4E2D8` | `#2A2F33` |
| `--text` | `#23261F` | `#E9EBE6` |
| `--text-muted` | `#70746A` | `#8D948C` |
| `--sq-dark` | `#6E8C4F` | `#5C7844` |
| `--sq-light` | `#EDEFD6` | `#D5D9BB` |
| `--coord-on-dark` | `#F3F5E4` | `#E6EAD3` |
| `--coord-on-light` | `#4C6633` | `#3E5528` |
| `--panel-bg` | `#252A23` | `#242A2D` |
| `--panel-bg-2` | `#2D332B` | `#2E3538` |
| `--panel-line` | `rgba(255,255,255,.08)` | `rgba(255,255,255,.07)` |
| `--panel-text` | `#ECEEE6` | `#E9EBE6` |
| `--panel-muted` | `#98A092` | `#8D948C` |
| `--accent` | `#E0A63F` | `#E0A63F` |

The panel is dark in **both** themes — that is deliberate, it is what anchors the
composition against the light board.

`--accent` has exactly four jobs and no others: last-move squares, the selected
square, the running clock, the current move in the list.

## Type

```
--font-ui:   'Familjen Grotesk', 'Helvetica Neue', Arial, sans-serif;
--font-mono: 'IBM Plex Mono', 'SF Mono', Menlo, monospace;
```

Mono is not decorative — clocks, move notation and board coordinates all need
fixed advance widths so columns don't jitter as values change.

Sizes: nav 15px/500 (600 when active) · player name 15px/600 · clock 21px/600 mono ·
move 14px/500 mono (600 when current) · move number 13px/500 mono ·
section label 11px/600, `letter-spacing:.14em`, uppercase · coordinate 12px/600 mono
(11px on mobile).

## Layout — desktop (1440×900)

```
header  64px, sticky, --header-bg, 1px bottom border, 28px side padding
main    flex, centred, gap 28px
        board   704×704   (8 × 88px squares, 6px radius, overflow hidden)
        panel   380×704   (18px radius)
```

Board and panel are one centred pair. There is no third column — the old floating
control card is gone; everything it held now lives in the panel.

Board shadow: `0 28px 70px -34px rgba(35,38,31,.5)` (light) /
`… rgba(0,0,0,.75)` (dark). Panel shadow:
`0 24px 60px -28px rgba(35,38,31,.45), 0 2px 6px rgba(35,38,31,.06)` /
`0 24px 60px -30px rgba(0,0,0,.8)`.

### Board squares

`a1` is dark. Square is dark when `(fileIndex + rank) % 2 === 1`.

Each square is `position:relative` and stacks, in this order:

1. last-move overlay — `inset:0; background:var(--accent); opacity:.36`
2. selected overlay — same, `opacity:.58`
3. coordinate — files on rank 1 bottom-right (`right:6px; bottom:3px`), ranks on
   file a top-left (`left:6px; top:4px`); colour is the *opposite* square's tone
4. piece — `inset:4px` (≈5% of the square)
5. legal-move dot — centred circle, 26% of square, `rgba(30,34,26,.24)`;
   for a capture, render a ring instead (4px border, same colour, no fill)

Coordinates live inside the squares. Do not re-add the outer coordinate gutters —
they were what pushed the old board off-centre.

### Panel anatomy (top to bottom)

1. **Black player row** — 20px padding. 42px avatar tile (11px radius, king glyph),
   name, captured pieces underneath at 15px, clock chip right.
2. **Move list** — 1px hairline top and bottom. Header row: `MOVES` label left,
   opening name right (both `--panel-muted`). Rows: 30px move number, then two
   equal-flex cells. Row 8px radius, odd rows `rgba(255,255,255,.028)`, 4px gap,
   cells `padding:9px 10px`. The list scrolls and auto-scrolls to the current move.
3. **White player row** — identical to Black.
4. **Controls** — 1px hairline top, 14/18px padding.
   Segmented group on `--panel-bg-2` (12px radius, 3px inset) holding
   first / prev / next / last, each 46×44. Then a spacer, then flip-board and
   restart as separate 46×44 buttons on `--panel-bg-2`.

**Clock chip.** Idle: `--panel-bg-2` background, `--panel-muted` text.
Running: `--accent` background, `#1D2018` text. Only one is ever running.

**Captured pieces.** Flat single-colour silhouettes, 15px, laid out with `gap:4px`,
ordered pawn → knight → bishop → rook → queen. Captured white pieces render
`#DCE0D4`, captured black `#79806F` — full piece colours are unreadable on the dark
panel. If one side is up material, append `+N` in `--panel-muted` after that side's
row; show nothing when material is level.

## Layout — mobile (390×844)

Single column, no side panel:

```
header       56px  — mark left, menu button right (44×44)
status row   34px  — accent dot + "White to move", time control chip right
Black strip  68px  — 15px side margin, 15px radius, --panel-bg
board        384px — near full bleed (8 × 48px)
White strip  68px
bottom sheet       — --panel-bg, 20px top radii, sticks to the bottom edge
                     recent moves row (last two move pairs, leading "…")
                     control row: 52×48 buttons, same order as desktop
```

Vertical gap 14px throughout. **Every hit target is ≥44px.** No fake status bar and
no fake keyboard.

## States to implement

- **hover** on a movable piece: `cursor:grab`, square gets
  `inset 0 0 0 3px rgba(255,255,255,.35)`
- **selected**: the accent overlay above, plus legal-move dots/rings on targets
- **check**: radial red glow behind the king's square, not a flat fill
- **game over**: the running clock chip stops pulsing; result banner replaces the
  status row on mobile and the move-list header on desktop
- **theme toggle**: swap `data-theme` on `<html>`; only the tokens above change

## Accessibility

- Board is a `role="grid"`, squares `role="gridcell"` with `aria-label="e4, white pawn"`.
- Move list is an ordered list; the current move carries `aria-current="step"`.
- Clocks are `aria-live="off"` — announcing every second is unusable. Announce only
  under 30 seconds, and on a move.
- Never signal a square by colour alone; the selected state also gets the ring.
- Keyboard: arrow keys move a cursor around the board, space/enter selects and
  moves, `←`/`→` with a modifier steps through history, `f` flips.
