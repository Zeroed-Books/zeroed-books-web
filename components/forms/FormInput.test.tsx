import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FormInput from "./FormInput";

describe("FormInput", () => {
  it("should be valid with no error", () => {
    render(<FormInput label="test" />);

    expect(screen.getByLabelText("test").getAttribute("aria-invalid")).toBe(
      "false"
    );
  });

  it("should be invalid if there's an error", () => {
    render(<FormInput error={{ type: "custom" }} label="test" />);

    expect(screen.getByLabelText("test").getAttribute("aria-invalid")).toBe(
      "true"
    );
  });
});
