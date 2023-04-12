import { asISODate } from "@/dates/formatters";

interface Props {
  active?: boolean;
  dateFormatter?: (instant: Date) => string;
  label?: number;
  moneyFormatter: (value: string | number) => string;
  payload?: { value: number }[];
}

export default function AccountBalanceTooltip({
  active,
  dateFormatter = asISODate,
  label,
  moneyFormatter,
  payload,
}: Props) {
  if (active && label && payload?.length) {
    const formattedInstant = dateFormatter(new Date(label));
    const formattedCurrency = moneyFormatter(payload[0].value);

    return (
      <div className="border border-green-500 bg-slate-100 p-2 shadow">
        <p className="font-bold">{formattedInstant}</p>
        <p>Balance: {formattedCurrency}</p>
      </div>
    );
  }

  return null;
}
