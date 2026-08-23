import { render, screen } from "@testing-library/react";
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
    .filter((cell) => /white|black/.test(cell.getAttribute("aria-label") ?? ""));
  expect(occupied).toHaveLength(32);
});

test("clicking a white pawn highlights its legal destination squares", async () => {
  const user = userEvent.setup();
  renderGame();

  await user.click(screen.getByRole("gridcell", { name: /^e2,/ }));

  const e3 = screen.getByRole("gridcell", { name: "e3" });
  const e4 = screen.getByRole("gridcell", { name: "e4" });
  expect(e3.querySelector(".play-legal-mark")).not.toBeNull();
  expect(e4.querySelector(".play-legal-mark")).not.toBeNull();
});
