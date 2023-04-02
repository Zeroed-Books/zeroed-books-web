"use client";

import useApiClient from "@/src/api/useApiClient";
import { accountKeys } from "@/src/ledger/queries";
import { useQuery } from "@tanstack/react-query";

interface Props {
  account: string;
}

export default function AccountBalance({ account }: Props) {
  const client = useApiClient();
  const query = useQuery(accountKeys.balance(account), () =>
    client.getAccountBalance(account)
  );

  return (
    <div className="mb-4 bg-slate-100 p-4 text-slate-800 shadow">
      {query.data?.length ? (
        <>
          <h3 className="mb-2 text-xl">Balance</h3>
          {query.data.map((amount) => (
            <p key={amount.currency}>
              {amount.currency}&nbsp;{amount.value}
            </p>
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
