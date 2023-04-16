import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vitest } from "vitest";
import CurrencyInput from "./CurrencyInput";
import { Currency } from "@/src/api/reps";

const USD: Currency = {
  code: "USD",
  minorUnits: 2,
};

describe("CurrencyInput", () => {
  it("should return numeric values in the smallest currency amount", async () => {
    const handleChange = vitest.fn();
    const user = userEvent.setup();

    render(
      <CurrencyInput currency={USD} label="test" onChange={handleChange} />
    );

    const input = screen.getByLabelText("test");
    await user.type(input, "5");

    expect(handleChange).toHaveBeenLastCalledWith(500);
  });

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

  it("should be able to handle all these inputs", async () => {
    const handleChange = vitest.fn();
    const user = userEvent.setup();

    render(
      <CurrencyInput currency={USD} label="test" onChange={handleChange} />
    );

    const input = screen.getByLabelText("test");

    const runTest = async (
      typed: string,
      expectedValue: number | undefined,
      expectedDisplay: string
    ) => {
      await user.clear(input);
      await user.type(input, typed);
      fireEvent.blur(input);

      expect(handleChange).toHaveBeenLastCalledWith(expectedValue);
      expect(input).toHaveValue(expectedDisplay);
    };

    await runTest("5432", 543200, "5,432.00");
    await runTest(".2", 20, "0.20");
    await runTest("1234.56", 123456, "1,234.56");
    await runTest("lizard", undefined, "lizard");
  });
});
