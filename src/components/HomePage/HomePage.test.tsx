import { render } from "@testing-library/react";
import Home from "./HomePage";

test("renders the background container", () => {
  const { container } = render(<Home />);
  expect(container.querySelector(".background")).toBeInTheDocument();
});
