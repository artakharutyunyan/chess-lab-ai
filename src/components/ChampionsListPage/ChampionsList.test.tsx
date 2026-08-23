import { render, screen } from "@testing-library/react";
import ChampionsList from "./ChampionsList";
import champions from "./constants";

test("renders the page heading and every champion", () => {
  render(<ChampionsList />);

  expect(
    screen.getByRole("heading", { name: /world champions of chess/i })
  ).toBeInTheDocument();

  expect(screen.getAllByRole("img")).toHaveLength(champions.length);
  expect(screen.getByText("Garry Kasparov")).toBeInTheDocument();
});
