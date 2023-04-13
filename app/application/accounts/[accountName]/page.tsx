import AccountBalance from "@/components/accounts/AccountBalance";
import AccountRunningBalanceChart from "@/components/accounts/AccountRunningBalanceChart";
import AccountMonthlyBalance from "@/components/accounts/AccountMonthlyBalance";
import TransactionList from "@/src/ledger/transactions/TransactionList";
import React from "react";
import LinkedAccountName from "@/components/accounts/LinkedAccountName";

interface Props {
  params: {
    accountName: string;
  };
}

export default function AccountDetailPage({ params }: Props) {
  const accountName = decodeURIComponent(params.accountName);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-4 text-xl md:text-3xl">
        <LinkedAccountName account={accountName} />
      </h1>
      <div className="lg:grid lg:grid-cols-3">
        <AccountBalance account={accountName} />
      </div>
      <div className="mb-4">
        <h2 className="mb-4 text-2xl">Monthly Balance</h2>
        {accountName.startsWith("Assets:") || accountName === "Assets" ? (
          <AccountRunningBalanceChart account={accountName} interval="weekly" />
        ) : (
          <AccountMonthlyBalance account={accountName} />
        )}
      </div>
      <h2 className="mb-4 text-2xl">Transactions</h2>
      <TransactionList account={accountName} />
    </div>
  );
}
