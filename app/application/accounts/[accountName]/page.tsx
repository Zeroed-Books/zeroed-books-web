import AccountBalance from "@/components/accounts/AccountBalance";
import AccountRunningBalanceChart from "@/components/accounts/AccountRunningBalanceChart";
import AccountMonthlyBalance from "@/components/accounts/AccountMonthlyBalance";
import TransactionList from "@/src/ledger/transactions/TransactionList";
import React from "react";

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
        {accountName.split(":").map((name, index) => (
          <React.Fragment key={`${index}-${name}`}>
            {index !== 0 && (
              <>
                :<wbr />
              </>
            )}
            {name}
          </React.Fragment>
        ))}
      </h1>
      <div className="lg:grid lg:grid-cols-3">
        <AccountBalance account={accountName} />
      </div>
      <div className="mb-4 lg:h-96">
        <h2 className="mb-4 text-2xl">Monthly Balance</h2>
        <div className="h-[28rem] lg:h-96">
          {accountName.startsWith("Assets:") ? (
            <AccountRunningBalanceChart account={accountName} />
          ) : (
            <AccountMonthlyBalance account={accountName} />
          )}
        </div>
      </div>
      <h2 className="mb-4 text-2xl">Transactions</h2>
      <TransactionList account={accountName} />
    </div>
  );
}
