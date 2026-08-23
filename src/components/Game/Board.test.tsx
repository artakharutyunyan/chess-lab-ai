import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Game } from "./index";

test("renders the initial 32-piece position", () => {
  render(<Game />);
  expect(screen.getAllByRole("img")).toHaveLength(32);
});

test("clicking a white pawn highlights its legal destination squares", async () => {
  const user = userEvent.setup();
  const { container } = render(<Game />);
  const squares = container.querySelectorAll(".table button.square");

  await user.click(squares[52]); // e2

  expect(squares[44].className).toMatch(/highlighted/); // e3
  expect(squares[36].className).toMatch(/highlighted/); // e4
});
