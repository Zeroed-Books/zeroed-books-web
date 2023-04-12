"use client";

import { accountKeys } from "@/src/ledger/queries";
import useApiClient from "../api/useApiClient";
import { useQuery } from "@tanstack/react-query";
import formatCurrency from "@/currency/formatCurrency";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Currency } from "@/src/api/reps";
import { asISODate } from "@/dates/formatters";
import AccountBalanceTooltip from "./AccountBalanceTooltip";

interface Props {
  account: string;
}

const tryFormatMoney = (currency: Currency) => (value: string | number) => {
  const formattedCurrency = formatCurrency(
    window.navigator.language,
    currency.code,
    value,
    { decimalPlaces: currency.minor_units }
  );

  return formattedCurrency.join("");
};

export default function AccountRunningBalanceChart({ account }: Props) {
  const client = useApiClient();
  const query = useQuery(
    accountKeys.balancePeriodic(account),
    () => client.getAccountBalancePeriodic(account),
    {
      select: (data) => {
        const usdData = data["USD"];
        if (!usdData?.balances) {
          return null;
        }

        const balances = [];
        let minBalance: number | null = null;
        let maxBalance: number | null = null;

        for (const balance of usdData.balances) {
          const instant = new Date(balance.instant);

          const parsedBalance = parseFloat(balance.balance);
          if (isNaN(parsedBalance)) {
            continue;
          }

          if (minBalance === null || parsedBalance < minBalance) {
            minBalance = parsedBalance;
          }

          if (maxBalance === null || parsedBalance > maxBalance) {
            maxBalance = parsedBalance;
          }

          const formattedCurrency = formatCurrency(
            window.navigator.language,
            usdData.currency.code,
            parsedBalance,
            { decimalPlaces: usdData.currency.minor_units }
          );

          balances.push({
            instant: instant.getTime(),
            balance: parsedBalance,
            displayBalance: formattedCurrency,
          });
        }

        return {
          currency: usdData.currency,
          balances,
          minBalance: minBalance ?? 0,
          maxBalance: maxBalance ?? 0,
        };
      },
    }
  );

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
        <LineChart
          data={query.data.balances}
          margin={{ top: 5, right: 5, bottom: 5, left: leftMargin }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="instant"
            domain={["auto", "auto"]}
            tickFormatter={(value) => asISODate(new Date(value))}
            type="number"
          />
          <YAxis
            name="Balance"
            tickFormatter={tryFormatMoney(query.data.currency)}
            type="number"
          />
          <Tooltip
            content={
              <AccountBalanceTooltip
                moneyFormatter={tryFormatMoney(query.data.currency)}
              />
            }
          />
          <Legend />
          <Line type="monotone" dataKey="balance" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return <p>No data.</p>;
}
