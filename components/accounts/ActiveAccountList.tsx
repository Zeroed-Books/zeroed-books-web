"use client";

import useApiClient from "@/src/api/useApiClient";
import { accountKeys } from "@/src/ledger/queries";
import { useQuery } from "@tanstack/react-query";
import TextLink from "../TextLink";

export default function ActiveAccountList() {
  const client = useApiClient();
  const query = useQuery(accountKeys.active, () => client.getActiveAccounts(), {
    select: (accounts): string[] => {
      accounts.sort();

      return accounts;
    },
  });

  if (query.data) {
    return (
      <ul>
        {query.data.map((account) => (
          <li key={account}>
            <TextLink href={`/accounts/${account}`}>{account}</TextLink>
          </li>
        ))}
      </ul>
    );
  }

  return <div>Accounts</div>;
}
