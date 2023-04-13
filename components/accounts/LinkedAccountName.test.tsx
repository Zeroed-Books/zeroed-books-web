import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LinkedAccountName from "./LinkedAccountName";

const getByTextContent =
  (text: string) => (content: string, element: Element | null) =>
    content !== "" && element?.textContent === text;

describe("LinkedAccountName", () => {
  it("should link to a single-level account", () => {
    render(<LinkedAccountName account="Expenses" />);

    const link = screen.getByRole("link", { name: "Expenses" });

    expect(link).toHaveAttribute("href", "/application/accounts/Expenses");

    expect(screen.getByText(getByTextContent("Expenses")));
  });

  it("should link to both levels of a two-level account", () => {
    render(<LinkedAccountName account="Expenses:Food" />);

    const expensesLink = screen.getByRole("link", { name: "Expenses" });
    const foodLink = screen.getByRole("link", { name: "Food" });

    expect(expensesLink).toHaveAttribute(
      "href",
      "/application/accounts/Expenses"
    );
    expect(foodLink).toHaveAttribute(
      "href",
      "/application/accounts/Expenses:Food"
    );

    expect(screen.getByText(getByTextContent("Expenses:Food")));
  });

  it("should link to all levels of a three-level account", () => {
    render(<LinkedAccountName account="Expenses:Food:Groceries" />);

    const expensesLink = screen.getByRole("link", { name: "Expenses" });
    const foodLink = screen.getByRole("link", { name: "Food" });
    const groceriesLink = screen.getByRole("link", { name: "Groceries" });

    expect(expensesLink).toHaveAttribute(
      "href",
      "/application/accounts/Expenses"
    );
    expect(foodLink).toHaveAttribute(
      "href",
      "/application/accounts/Expenses:Food"
    );
    expect(groceriesLink).toHaveAttribute(
      "href",
      "/application/accounts/Expenses:Food:Groceries"
    );

    expect(
      screen.getByText(getByTextContent("Expenses:Food:Groceries"))
    ).toBeInTheDocument();
  });
});
