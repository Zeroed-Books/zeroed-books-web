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

export default forwardRef<HTMLInputElement, Props>(function CurrencyInput(
  { currency, label, onChange, ...rest },
  ref
) {
  const [rawValue, setRawValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");

  const handleBlur = useCallback(() => {
    const parsedValue = parseFloat(rawValue);

    if (isNaN(parsedValue)) {
      // Do nothing
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
      onChange(
        isNaN(parsedValue)
          ? undefined
          : parsedValue * Math.pow(10, currency.minorUnits)
      );
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
