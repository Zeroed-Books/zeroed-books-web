"use client";

import formatCurrency from "@/currency/formatCurrency";
import useMedia from "@/responsive/useMedia";
import useApiClient from "@/components/api/useApiClient";
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
import AccountBalanceTooltip from "./AccountBalanceTooltip";
import { asISOMonth } from "@/dates/formatters";

interface Props {
  account: string;
}

export default function AccountMonthlyBalance({ account }: Props) {
  const client = useApiClient();
  const query = useQuery(
    accountKeys.balanceMonthly(account),
    () => client.getAccountBalanceMonthly(account),
    {
      select: (data) => {
        let minBalance: number | null = null;
        let maxBalance: number | null = null;

        const parsedBalances = [];
        for (const [month, balances] of Object.entries(data)) {
          const parsedMonth = new Date(month);
          const displayMonth = asISOMonth(parsedMonth);

          const usd = balances.find((balance) => balance.currency === "USD");
          if (!usd) {
            continue;
          }

          const parsedValue = parseFloat(usd.value);
          if (isNaN(parsedValue)) {
            continue;
          }

          if (minBalance === null || parsedValue < minBalance) {
            minBalance = parsedValue;
          }

          if (maxBalance === null || parsedValue > maxBalance) {
            maxBalance = parsedValue;
          }

          const formattedCurrency = formatCurrency(
            window.navigator.language,
            usd.currency,
            parsedValue,
            { decimalPlaces: 2 }
          );

          parsedBalances.push({
            instant: parsedMonth.getTime(),
            name: displayMonth,
            balance: parsedValue,
            displayBalance: formattedCurrency.join(""),
          });
        }

        parsedBalances.sort((a, b) => a.instant - b.instant);

        return {
          balances: parsedBalances,
          maxBalance: maxBalance ?? 0,
          minBalance: minBalance ?? 0,
        };
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
    dataKey: "instant",
    domain: ["dataMin", "dataMax"],
    scale: "time" as const,
    tickFormatter: (value: number) => asISOMonth(new Date(value)),
    type: "number" as const,
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
    const largestDomainValue = Math.max(
      Math.abs(query.data.minBalance),
      Math.abs(query.data.maxBalance)
    );

    // The left margin depends on how big the values are. We need more space to
    // fit larger tick mark labels.
    const leftMargin = Math.ceil(Math.log10(largestDomainValue)) * 8;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={query.data.balances}
          layout={layout}
          margin={{ top: 5, right: 5, bottom: 5, left: leftMargin }}
        >
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
          <Tooltip
            content={
              <AccountBalanceTooltip
                dateFormatter={asISOMonth}
                moneyFormatter={tryFormatMoney}
              />
            }
          />
          <Legend />
          <Bar dataKey="balance" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return <div />;
}
