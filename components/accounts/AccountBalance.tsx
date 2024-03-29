"use client";

import { formatMinorCurrency } from "@/currency/format";
import useApiClient from "@/components/api/useApiClient";
import { accountKeys } from "@/src/ledger/queries";
import { useQuery } from "@tanstack/react-query";

const useAccountBalance = (account: string) => {
  const client = useApiClient();

  return useQuery(
    accountKeys.balance(account),
    () => client.getAccountBalance(account),
    {
      select: (data) =>
        data.map((amount) => ({
          currency: amount.currency,
          formatted: formatMinorCurrency(
            window.navigator.language,
            amount.currency,
            amount.value
          ),
        })),
    }
  );
};

interface Props {
  account: string;
}

export default function AccountBalance({ account }: Props) {
  const query = useAccountBalance(account);

  return (
    <div className="mb-4 bg-slate-100 p-4 text-slate-800 shadow">
      {query.data?.length ? (
        <>
          <h3 className="mb-2 text-xl">Balance</h3>
          {query.data.map((amount) => (
            <p key={amount.currency.code}>{amount.formatted.join("")}</p>
          ))}
        </>
      ) : query.isLoading ? (
        <p>Loading...</p>
      ) : (
        <p>No balance.</p>
      )}
    </div>
  );
}
