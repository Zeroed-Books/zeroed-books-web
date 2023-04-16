"use client";

import "chartjs-adapter-date-fns";
import { formatCurrency } from "@/currency/format";
import useApiClient from "@/components/api/useApiClient";
import { accountKeys } from "@/src/ledger/queries";
import { useQuery } from "@tanstack/react-query";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  Chart as ChartJS,
  Legend,
  LinearScale,
  TimeScale,
  Tooltip,
  TooltipItem,
} from "chart.js";

ChartJS.register(BarElement, LinearScale, TimeScale, Tooltip, Legend);

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
        const parsedBalances = [];
        for (const [month, balances] of Object.entries(data)) {
          const usd = balances.find(
            (balance) => balance.currency.code === "USD"
          );
          if (!usd) {
            continue;
          }

          const dollarAmount =
            usd.value / Math.pow(10, usd.currency.minorUnits);

          parsedBalances.push({
            x: month,
            y: dollarAmount,
          });
        }

        return {
          datasets: [
            {
              data: parsedBalances,
              label: "USD",
              backgroundColor: "#82ca9d",
            },
          ],
        };
      },
    }
  );

  const tryFormatMoney = (value: string | number) => {
    const formattedCurrency = formatCurrency(
      window.navigator.language,
      { code: "USD", minorUnits: 2 },
      value
    );

    return formattedCurrency.join("");
  };

  if (query.data) {
    const options = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        x: {
          type: "time" as const,
          time: {
            tooltipFormat: "MMMM, yyyy",
            unit: "month" as const,
          },
        },
        y: {
          ticks: {
            callback: (value: number | string) => tryFormatMoney(value),
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (item: TooltipItem<"bar">) =>
              tryFormatMoney((item.raw as { y: number }).y),
          },
        },
      },
    };

    return (
      <div className="h-[50vh] max-h-96">
        <Bar data={query.data} options={options} />
      </div>
    );
  }

  return null;
}
