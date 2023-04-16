import { Currency } from "@/src/api/reps";

type FormattedCurrency = readonly [string, string];

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
};

/**
 * Format a value if it is numeric.
 *
 * @param formatter - The number formatter to use.
 * @param amount - The amount to format as a number.
 *
 * @returns If the amount can be parsed as a number, then the formatted numeric
 * value is returned. Otherwise, the amount is returned as-is.
 */
const formatIfNumeric = (
  formatter: Intl.NumberFormat,
  amount: number | string
) => {
  if (typeof amount === "number") {
    return formatter.format(amount);
  }

  const parsed = parseFloat(amount);
  if (isNaN(parsed)) {
    return amount;
  }

  return formatter.format(parsed);
};

/**
 * Format a currency value for a specific locale.
 *
 * @param locale - The locale to use when formatting the value.
 * @param currency - The currency to format the amount as.
 * @param amount - The currency amount to format. If this is a string, it will
 * be parsed as a float first.
 *
 * @returns A pair containing the symbol for the currency and the formatted
 * value. If no symbol is available for the currency, the currency code is used
 * instead. If the amount cannot be formatted as a number, it is returned as-is.
 */
export function formatCurrency(
  locale: string,
  currency: Currency,
  amount: number | string
): FormattedCurrency {
  const formatterOpts: Intl.NumberFormatOptions = {
    maximumFractionDigits: currency.minorUnits,
    minimumFractionDigits: currency.minorUnits,
  };

  const formatter = Intl.NumberFormat(locale, formatterOpts);
  const displayAmount = formatIfNumeric(formatter, amount);

  return [
    CURRENCY_SYMBOLS[currency.code] ?? `${currency.code} `,
    displayAmount,
  ];
}

export function formatMinorCurrency(
  locale: string,
  currency: Currency,
  amount: number
): FormattedCurrency {
  const currencyAmount = amount / Math.pow(10, currency.minorUnits);

  return formatCurrency(locale, currency, currencyAmount);
}
