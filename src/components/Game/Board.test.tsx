import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Game } from "./index";
import { BoardSettingsProvider } from "../../context/BoardSettingsContext";

function renderGame() {
  return render(
    <BoardSettingsProvider>
      <Game />
    </BoardSettingsProvider>
  );
}

test("renders the initial 32-piece position", () => {
  renderGame();
  const occupied = screen
    .getAllByRole("gridcell")
    .filter((cell) => /white|black/i.test(cell.getAttribute("aria-label") ?? ""));
  expect(occupied).toHaveLength(32);
});

test("clicking a white pawn highlights its legal destination squares", async () => {
  const user = userEvent.setup();
  renderGame();

  await user.click(screen.getByRole("button", { name: /start game/i }));
  await user.click(screen.getByRole("gridcell", { name: /^e2,/ }));

  const e3 = screen.getByRole("gridcell", { name: "e3" });
  const e4 = screen.getByRole("gridcell", { name: "e4" });
  expect(e3.querySelector(".play-legal-mark")).not.toBeNull();
  expect(e4.querySelector(".play-legal-mark")).not.toBeNull();
});

test("keyboard: arrow keys move the roving cursor, Enter selects and moves", async () => {
  const user = userEvent.setup();
  renderGame();

  await user.click(screen.getByRole("button", { name: /start game/i }));

  // a8 (top-left) starts as the sole tab stop.
  const a8 = screen.getByRole("gridcell", { name: /^a8,/ });
  expect(a8).toHaveAttribute("tabIndex", "0");
  a8.focus();
  expect(a8).toHaveFocus();

  // Down 6 times: a8 -> a2 (white's pawn rank).
  for (let i = 0; i < 6; i++) {
    await user.keyboard("{ArrowDown}");
  }
  const a2 = screen.getByRole("gridcell", { name: /^a2,/ });
  expect(a2).toHaveFocus();
  expect(a2).toHaveAttribute("tabIndex", "0");
  expect(a8).toHaveAttribute("tabIndex", "-1");

  // Right once: a2 -> b2, then Right again: b2 -> c2 (both empty in terms
  // of the destination -- moving the cursor doesn't select anything).
  await user.keyboard("{ArrowRight}{ArrowRight}");
  const c2 = screen.getByRole("gridcell", { name: /^c2,/ });
  expect(c2).toHaveFocus();

  // Enter selects the pawn on c2; its legal targets (c3/c4) should light up.
  await user.keyboard("{Enter}");
  expect(screen.getByRole("gridcell", { name: "c3" }).querySelector(".play-legal-mark")).not.toBeNull();
  expect(screen.getByRole("gridcell", { name: "c4" }).querySelector(".play-legal-mark")).not.toBeNull();

  // Move the cursor up to c4 and press Space to complete the move.
  await user.keyboard("{ArrowUp}{ArrowUp}");
  await user.keyboard(" ");
  expect(screen.getByRole("gridcell", { name: /^c4, white pawn$/i })).toBeInTheDocument();
});

test("a player's clock reaching zero ends the game on time and freezes the board", () => {
  vi.useFakeTimers();
  try {
    renderGame();
    // Default time control is 10 minutes; White moves first and never
    // moves here, so White's own clock is the one ticking down.
    fireEvent.click(screen.getByRole("button", { name: /start game/i }));

    act(() => {
      vi.advanceTimersByTime(10 * 60 * 1000);
    });

    expect(screen.getByText(/black wins on time/i)).toBeInTheDocument();

    // Board is frozen, same as after checkmate or resignation -- clicking
    // a piece no longer selects it or highlights legal moves.
    fireEvent.click(screen.getByRole("gridcell", { name: /^e2,/ }));
    expect(
      screen.getByRole("gridcell", { name: "e4" }).querySelector(".play-legal-mark")
    ).toBeNull();
  } finally {
    vi.useRealTimers();
  }
});

test("keyboard: f flips the board", async () => {
  const user = userEvent.setup();
  renderGame();
  await user.click(screen.getByRole("button", { name: /start game/i }));

  const a8 = screen.getByRole("gridcell", { name: /^a8,/ });
  a8.focus();
  await user.keyboard("f");

  // Flipped, the visual top-left square (still the roving cursor's
  // position) is h1 instead of a8, and keyboard focus should have moved
  // there with it (not silently dropped by the remount under a new key).
  const h1 = screen.getByRole("gridcell", { name: /^h1,/ });
  expect(h1).toHaveAttribute("tabIndex", "0");
  expect(h1).toHaveFocus();
});
