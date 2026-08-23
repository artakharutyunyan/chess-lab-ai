import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";
import { ThemeProvider } from "../../context/ThemeContext";
import { i18n } from "../../i18n";

function renderHeader() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </ThemeProvider>
  );
}

beforeEach(async () => {
  window.localStorage.removeItem("theme");
  // i18next is a module-level singleton, so a language switch in one test
  // otherwise leaks into the next.
  await i18n.changeLanguage("en");
});

test("renders the nav links", () => {
  renderHeader();
  expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /world champions/i })
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /play/i })).toBeInTheDocument();
});

test("opens the language popup and closes it on an outside click", async () => {
  const user = userEvent.setup();
  renderHeader();

  const toggle = screen.getByRole("button", { name: /change language/i });
  await user.click(toggle);
  expect(screen.getByText("Русский")).toBeInTheDocument();

  // click somewhere outside the popup/toggle entirely
  await user.click(document.body);
  expect(screen.queryByText("Русский")).not.toBeInTheDocument();
});

test("selecting a language switches the rendered text and closes the popup", async () => {
  const user = userEvent.setup();
  renderHeader();

  await user.click(screen.getByRole("button", { name: /change language/i }));
  await user.click(screen.getByText("Русский"));

  expect(screen.getByRole("link", { name: "Главная" })).toBeInTheDocument();
  expect(screen.queryByText("English")).not.toBeInTheDocument();
});

test("theme toggle switches the document's data-theme and persists it", async () => {
  const user = userEvent.setup();
  renderHeader();

  expect(document.documentElement.getAttribute("data-theme")).toBe("light");

  await user.click(screen.getByRole("button", { name: /toggle dark mode/i }));

  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  expect(window.localStorage.getItem("theme")).toBe("dark");
});
