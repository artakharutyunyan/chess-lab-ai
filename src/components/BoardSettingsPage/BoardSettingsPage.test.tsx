import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BoardSettingsPage from "./BoardSettingsPage";
import { BoardSettingsProvider } from "../../context/BoardSettingsContext";

function renderPage() {
  return render(
    <BoardSettingsProvider>
      <BoardSettingsPage />
    </BoardSettingsProvider>
  );
}

beforeEach(() => {
  window.localStorage.removeItem("boardSettings");
});

test("renders both sections with all board colors and piece styles", () => {
  renderPage();
  expect(
    screen.getByRole("heading", { name: /board colors/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /piece style/i })
  ).toBeInTheDocument();

  expect(screen.getByRole("button", { name: /classic green/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /ocean blue/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /walnut brown/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /charcoal gray/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /coral sunset/i })).toBeInTheDocument();

  expect(screen.getByRole("button", { name: /^classic$/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /minimal/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /bold/i })).toBeInTheDocument();
});

test("classic green and classic piece set are selected by default", () => {
  renderPage();
  expect(
    screen.getByRole("button", { name: /classic green/i })
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    screen.getByRole("button", { name: /^classic$/i })
  ).toHaveAttribute("aria-pressed", "true");
});

test("selecting a board color and piece style persists to localStorage", async () => {
  const user = userEvent.setup();
  renderPage();

  await user.click(screen.getByRole("button", { name: /ocean blue/i }));
  await user.click(screen.getByRole("button", { name: /^bold$/i }));

  expect(
    screen.getByRole("button", { name: /ocean blue/i })
  ).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("button", { name: /^bold$/i })).toHaveAttribute(
    "aria-pressed",
    "true"
  );

  const stored = JSON.parse(window.localStorage.getItem("boardSettings") ?? "{}");
  expect(stored.boardThemeId).toBe("ocean-blue");
  expect(stored.pieceSetId).toBe("bold");
});
