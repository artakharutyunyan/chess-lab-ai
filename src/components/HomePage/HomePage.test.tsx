import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./HomePage";

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

test("renders the hero heading and a Play Now link to /game", () => {
  renderHome();
  expect(screen.getByRole("heading", { level: 1, name: /chess lab ai/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /play now/i })).toHaveAttribute("href", "/game");
});

test("renders all four feature cards linking to their pages", () => {
  renderHome();
  expect(screen.getByRole("link", { name: /play vs stockfish/i })).toHaveAttribute("href", "/game");
  expect(screen.getByRole("link", { name: /customize your board/i })).toHaveAttribute("href", "/board");
  expect(screen.getByRole("link", { name: /world champions/i })).toHaveAttribute("href", "/champions");
  expect(screen.getByRole("link", { name: /learn the rules/i })).toHaveAttribute("href", "/rules");
});
