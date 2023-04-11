interface CurrencyFormatOptions {
  decimalPlaces: number;
}

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
 * @param currency - The code for the currency being used.
 * @param amount - The currency amount to format. If this is a string, it will
 * be parsed as a float first.
 * @param opts - Options to modify the format output.
 *
 * @returns A pair containing the symbol for the currency and the formatted
 * value. If no symbol is available for the currency, the currency code is used
 * instead. If the amount cannot be formatted as a number, it is returned as-is.
 */
export default function formatCurrency(
  locale: string,
  currency: string,
  amount: number | string,
  opts?: CurrencyFormatOptions
): FormattedCurrency {
  const formatterOpts: Intl.NumberFormatOptions = {};
  if (opts) {
    formatterOpts.maximumFractionDigits = opts.decimalPlaces;
    formatterOpts.minimumFractionDigits = opts.decimalPlaces;
  }

  const formatter = Intl.NumberFormat(locale, formatterOpts);
  const displayAmount = formatIfNumeric(formatter, amount);

  return [CURRENCY_SYMBOLS[currency] ?? `${currency} `, displayAmount];
}
