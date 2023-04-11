"use client";

import formatCurrency from "@/currency/formatCurrency";
import useMedia from "@/responsive/useMedia";
import useApiClient from "@/src/api/useApiClient";
import { accountKeys } from "@/src/ledger/queries";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AxisDomain, LayoutType } from "recharts/types/util/types";

interface Props {
  account: string;
}

export default function MonthlyAccountBalance({ account }: Props) {
  const client = useApiClient();
  const query = useQuery(
    accountKeys.balanceMonthly(account),
    () => client.getAccountBalanceMonthly(account),
    {
      select: (data) => {
        const months = [];
        for (const [month, balances] of Object.entries(data)) {
          let parsedMonth: Date;
          try {
            parsedMonth = new Date(month);
          } catch (e) {
            continue;
          }

          const displayMonth = `${parsedMonth.getUTCFullYear()}-${
            parsedMonth.getUTCMonth() + 1
          }`;

          const usd = balances.find((balance) => balance.currency === "USD");
          if (!usd) {
            continue;
          }

          const parsedValue = parseFloat(usd.value);
          if (isNaN(parsedValue)) {
            continue;
          }

          const formattedCurrency = formatCurrency(
            window.navigator.language,
            usd.currency,
            parsedValue,
            { decimalPlaces: 2 }
          );

          months.push({
            month: parsedMonth,
            name: displayMonth,
            balance: parsedValue,
            displayBalance: formattedCurrency.join(" "),
          });
        }

        months.sort((a, b) => a.month.getTime() - b.month.getTime());

        return months;
      },
    }
  );

  const tryFormatMoney = (value: string | number) => {
    const formattedCurrency = formatCurrency(
      window.navigator.language,
      "USD",
      value,
      { decimalPlaces: 2 }
    );

    return formattedCurrency.join("");
  };

  const layout = useMedia<LayoutType>(
    [{ query: "(min-width: 1024px)", matchingValue: "horizontal" }],
    "vertical"
  );

  const horizontalAxisProps = {
    dataKey: "name",
    type: "category" as const,
  };

  const verticalAxisProps = {
    domain: [
      (dataMin: number) => (dataMin >= 0 ? 0 : dataMin - 100),
      (dataMax: number) => (dataMax <= 0 ? 0 : dataMax + 100),
    ] as AxisDomain,
    name: "Balance",
    tickFormatter: tryFormatMoney,
    type: "number" as const,
  };

  if (query.data) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={query.data} layout={layout}>
          <XAxis
            {...(layout === "horizontal"
              ? horizontalAxisProps
              : verticalAxisProps)}
          />
          <YAxis
            {...(layout === "horizontal"
              ? verticalAxisProps
              : horizontalAxisProps)}
          />
          <Tooltip formatter={tryFormatMoney} />
          <Legend />
          <Bar dataKey="balance" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return <div />;
}