"use client";

import { accountKeys } from "@/src/ledger/queries";
import useApiClient from "../api/useApiClient";
import { useQuery } from "@tanstack/react-query";
import formatCurrency from "@/currency/formatCurrency";
import { Currency } from "@/src/api/reps";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  TooltipItem,
} from "chart.js";

ChartJS.register(
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip
);

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
        for (const balance of usdData.balances) {
          const parsedBalance = parseFloat(balance.balance);
          if (isNaN(parsedBalance)) {
            continue;
          }

          balances.push({
            x: balance.instant,
            y: parsedBalance,
          });
        }

        return {
          currency: usdData.currency,
          datasets: [
            {
              data: balances,
              label: usdData.currency.code,
              backgroundColor: "#82ca9d",
            },
          ],
        };
      },
    }
  );

  if (query.data) {
    const moneyFormatter = tryFormatMoney(query.data.currency);

    const options = {
      elements: {
        line: {
          tension: 0.2,
        },
      },
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (item: TooltipItem<"line">) =>
              moneyFormatter((item.raw as { y: number }).y),
          },
        },
      },
      responsive: true,
      scales: {
        x: {
          type: "time" as const,
          time: {
            tooltipFormat: "PP",
            unit: "day" as const,
          },
        },
        y: {
          ticks: {
            callback: moneyFormatter,
          },
        },
      },
    };

    return (
      <div className="h-[50vh] max-h-96">
        <Line data={query.data} options={options} />
      </div>
    );
  }

  return <p>No data.</p>;
}
