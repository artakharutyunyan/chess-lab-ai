import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PageNotFound from "./PageNotFound";

test("renders localized 404 copy with a link back home", () => {
  render(
    <MemoryRouter>
      <PageNotFound />
    </MemoryRouter>
  );

  expect(
    screen.getByRole("heading", { name: /page not found/i })
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
    "href",
    "/"
  );
});
