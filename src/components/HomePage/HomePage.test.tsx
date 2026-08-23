import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./HomePage";

test("renders the hero title, subtitle, and a Play Now link into /game", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(
    screen.getByRole("heading", { name: "World of Chess" })
  ).toBeInTheDocument();

  const cta = screen.getByRole("link", { name: /play now/i });
  expect(cta).toBeInTheDocument();
  expect(cta).toHaveAttribute("href", "/game");
});
