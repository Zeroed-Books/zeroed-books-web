"use client";

import { Transaction } from "@/src/api/reps";
import useApiClient from "@/src/api/useApiClient";
import { transactionKeys } from "@/src/ledger/queries";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import TextLink from "@/components/TextLink";
import DeleteTransactionButton from "./DeleteTransactionButton";
import Breadcrumbs from "../Breadcrumbs";

interface TransactionDetailDisplayProps {
  transaction: Transaction;
}

const TransactionDetailDisplay = ({
  transaction,
}: TransactionDetailDisplayProps) => {
  const parsedDate = dayjs(transaction.date);

  return (
    <div className="mx-auto max-w-4xl">
      <Breadcrumbs>
        <Breadcrumbs.Child>
          <TextLink href="/">Home</TextLink>
        </Breadcrumbs.Child>
        <Breadcrumbs.Child>
          <span>Transactions</span>
        </Breadcrumbs.Child>
        <Breadcrumbs.Child>
          <span>{transaction.payee}</span>
        </Breadcrumbs.Child>
      </Breadcrumbs>
      <div className="flex align-top">
        <div className="flex-grow">
          <h1 className="mb-2 text-xl md:text-3xl">{transaction.payee}</h1>
          <h2 className="mb-4 text-lg md:text-xl">
            {parsedDate.format("MMMM D, YYYY")}
          </h2>
        </div>
        <div>
          <DeleteTransactionButton transaction={transaction} />
        </div>
      </div>

      <table className="w-full">
        <tbody>
          {transaction.entries.map((entry) => (
            <tr
              key={`${entry.account}-${entry.amount.currency}-${entry.amount.value}`}
            >
              <td className="w-full">
                <TextLink href={`/accounts/${entry.account}`}>
                  {entry.account}
                </TextLink>
              </td>
              <td className="px-2 font-mono">{entry.amount.currency}</td>
              <td className="text-right font-mono">{entry.amount.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface Props {
  transactionID: string;
}

export default function TransactionDetail({ transactionID }: Props) {
  const client = useApiClient();
  const query = useQuery(transactionKeys.detail(transactionID), () =>
    client.getTransaction(transactionID)
  );

  if (query.data) {
    return <TransactionDetailDisplay transaction={query.data} />;
  }

  if (query.error) {
    return (
      <div className="mx-auto max-w-2xl border border-red-500 bg-red-100 p-4 text-red-500">
        <p>Something went wrong retrieving the transaction.</p>
      </div>
    );
  }

  return null;
}
