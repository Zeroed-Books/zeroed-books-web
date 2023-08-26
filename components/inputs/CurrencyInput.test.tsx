import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vitest } from "vitest";
import CurrencyInput from "./CurrencyInput";
import { Currency } from "@/src/api/reps";

const USD: Currency = {
  code: "USD",
  minorUnits: 2,
};

const runTest = async (
  typed: string,
  expectedValue: number | undefined,
  expectedDisplay: string
) => {
  const handleChange = vitest.fn();
  const user = userEvent.setup();

  render(<CurrencyInput currency={USD} label="test" onChange={handleChange} />);

  const input = screen.getByLabelText("test");

  await user.clear(input);
  await user.type(input, typed);
  fireEvent.blur(input);

  expect(handleChange).toHaveBeenLastCalledWith(expectedValue);
  expect(input).toHaveValue(expectedDisplay);
};

describe("CurrencyInput", () => {
  it("should format the input on blur", async () => {
    const handleChange = vitest.fn();
    const user = userEvent.setup();

    render(
      <CurrencyInput currency={USD} label="test" onChange={handleChange} />
    );

    const input = screen.getByLabelText("test");
    await user.type(input, "5");
    fireEvent.blur(input);

    expect(input).toHaveValue("5.00");
  });

  it("should not change the value if it isn't a number", async () => {
    const handleChange = vitest.fn();
    const user = userEvent.setup();

    render(
      <CurrencyInput currency={USD} label="test" onChange={handleChange} />
    );

    const input = screen.getByLabelText("test");
    await user.type(input, "lizard");
    fireEvent.blur(input);

    expect(input).toHaveValue("lizard");
  });

  describe("Parsing tests", () => {
    it("should format thousands values", async () =>
      await runTest("5432", 543200, "5,432.00"));

    it("should handle bare decimal points", async () =>
      await runTest(".2", 20, "0.20"));

    it("should format values with decimal places", async () =>
      await runTest("1234.56", 123456, "1,234.56"));

    it("should not break for non-numeric values", async () =>
      await runTest("lizard", undefined, "lizard"));

    it("should not pass through values with too many decimal places", async () =>
      await runTest("123.456", undefined, "123.456"));

    // Regression test for #243
    it("should round minor units to integers", async () =>
      await runTest("19.94", 1994, "19.94"));
  });
});
