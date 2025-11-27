import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../HomePage";

// Mock fetch before tests
beforeAll(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            _id: "abc123",
            title: "Laptop",
            description: "Powerful laptop",
            imageURL: "laptop.jpg",
            category: "Electronics",
          },
          {
            _id: "xyz789",
            title: "Basketball",
            description: "Standard size",
            imageURL: "ball.jpg",
            category: "Sports",
          },
        ]),
    })
  );
});

describe("HomePage Tests", () => {
  test("renders HomePage component", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Share and Borrow with Ease")
    ).toBeInTheDocument();
  });

  test("fetches and displays items", async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/api/items");

    // Wait for items to show up
    expect(await screen.findByText("Laptop")).toBeInTheDocument();
    expect(await screen.findByText("Basketball")).toBeInTheDocument();
  });

  test("search filters items correctly", async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Wait for items to render
    await screen.findByText("Laptop");
    await screen.findByText("Basketball");

    const searchBox = screen.getByPlaceholderText("Search items...");

    await userEvent.type(searchBox, "lap");

    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.queryByText("Basketball")).not.toBeInTheDocument();
  });

  test("Detail button has correct link", async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const detailsButton = await screen.findByText("Details");
    expect(detailsButton.closest("a")).toHaveAttribute(
      "href",
      "/item/abc123"
    );
  });
});
