import { Currency } from "@/src/api/reps";
import {
  ComponentProps,
  FormEvent,
  forwardRef,
  useCallback,
  useState,
} from "react";
import LabeledInput from "./LabeledInput";
import { formatCurrency } from "@/currency/format";

interface Props extends Omit<ComponentProps<typeof LabeledInput>, "onChange"> {
  currency: Currency;
  label: string;
  onChange: (value: number | undefined) => void;
  value?: number;
}

/**
 * Epsilon value used to determine if the result of a conversion from a parsed
 * float into a minor units value should be rounded.
 */
const MINOR_UNITS_ROUNDING_EPSILON = Math.pow(10, -5);

/**
 * Convert a parsed float value into its minor units representation.
 *
 * @param parsed - The parsed currency amount as a float or `NaN`.
 * @param minorUnits - The number of minor units in the desired currency.
 *
 * @returns The number of minor units represented by the given float amount. If
 * the float amount is invalid, return `undefined` instead.
 */
const convertToMinorUnits = (
  parsed: number,
  minorUnits: number
): number | undefined => {
  if (isNaN(parsed)) {
    return undefined;
  }

  const asMinorFloat = parsed * Math.pow(10, minorUnits);
  const asMinor = Math.round(asMinorFloat);

  // The conversion into minor units will not be an exact integer if:
  // 1. The user provides more decimal places than is valid for the currency, or
  // 2. There is a floating point error in the conversion.
  //
  // We can usually determine if it's a floating point error by ensuring the
  // difference between the rounded value and the float is very small.
  if (Math.abs(asMinorFloat - asMinor) >= MINOR_UNITS_ROUNDING_EPSILON) {
    return undefined;
  }

  return asMinor;
};

export default forwardRef<HTMLInputElement, Props>(function CurrencyInput(
  { currency, label, onChange, ...rest },
  ref
) {
  const [rawValue, setRawValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");

  const handleBlur = useCallback(() => {
    const parsedValue = parseFloat(rawValue);
    const asMinorUnits = convertToMinorUnits(parsedValue, currency.minorUnits);

    if (asMinorUnits === undefined) {
      // Leave values that cannot be interpreted as a currency value as-is. For
      // cases where the user enters more decimal places than what is allowed,
      // we don't want to round for them.
    } else {
      const [_, formattedValue] = formatCurrency(
        window.navigator.language,
        currency,
        parsedValue
      );
      setDisplayValue(formattedValue);
    }
  }, [currency, rawValue]);

  const handleChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const newRawValue = event.currentTarget.value;
      const parsedValue = parseFloat(newRawValue);

      setDisplayValue(newRawValue);
      setRawValue(newRawValue);
      onChange(convertToMinorUnits(parsedValue, currency.minorUnits));
    },
    [currency.minorUnits, onChange]
  );

  return (
    <LabeledInput
      {...rest}
      // We can set the input mode to hint that browsers should use a numeric
      // input, but we can't set the `type` to `number` because number inputs
      // cannot handle any type of formatting in the value.
      inputMode="decimal"
      label={label}
      onBlur={handleBlur}
      onChange={handleChange}
      ref={ref}
      value={displayValue}
    />
  );
});
