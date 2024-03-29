import { describe, expect, it } from "vitest";
import { formatCurrency } from "./format";
import { Currency } from "@/src/api/reps";

const USD: Currency = {
  code: "USD",
  minorUnits: 2,
};

const UNKNOWN: Currency = {
  code: "XXU",
  minorUnits: 0,
};

describe("formatCurrency", () => {
  it("should return a currency symbol if available", () => {
    const [currencySymbol] = formatCurrency("en", USD, 1);

    expect(currencySymbol).toBe("$");
  });

  it("should return the currency identifier with a trailing space if no symbol is available", () => {
    const [currencySymbol] = formatCurrency("en", UNKNOWN, 1);

    expect(currencySymbol).toBe(`${UNKNOWN.code} `);
  });

  it("should format currencies to the provided number of decimal places", () => {
    const [_, formatted] = formatCurrency("en", USD, 1);

    expect(formatted).toBe("1.00");
  });

  it("should accept string values", () => {
    const [_, formatted] = formatCurrency("en", USD, "1");

    expect(formatted).toBe("1.00");
  });

  it("should accept string values with decimals", () => {
    const [_, formatted] = formatCurrency("en", USD, "1.23");

    expect(formatted).toBe("1.23");
  });

  it("should accept large string values with decimals", () => {
    const [_, formatted] = formatCurrency("en", USD, "1234.56");

    expect(formatted).toBe("1,234.56");
  });

  it("should accept large numeric values with decimals", () => {
    const [_, formatted] = formatCurrency("en", USD, 1234.56);

    expect(formatted).toBe("1,234.56");
  });

  it("should return the given amount if it's not a number", () => {
    const [_, formatted] = formatCurrency("en", USD, "dolphin");

    expect(formatted).toBe("dolphin");
  });
});
