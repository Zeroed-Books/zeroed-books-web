import { Transaction } from "@/src/api/reps";
import TextLink from "@/components/TextLink";

interface Props {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: Props) {
  return (
    <div className="max-w-full overflow-x-auto shadow">
      <table className="w-full border-separate border-spacing-2 bg-slate-100">
        <thead>
          <tr className="text-left">
            <th>Date</th>
            <th>Details</th>
            <th>Currency</th>
            <th>Amount</th>
          </tr>
        </thead>
        {transactions.map((transaction) => (
          <tbody key={transaction.id}>
            <tr>
              <td>{transaction.date}</td>
              <td className="w-full">
                <TextLink href={`/application/transactions/${transaction.id}`}>
                  {transaction.payee}
                </TextLink>
              </td>
            </tr>
            {transaction.entries.map((entry) => (
              <tr
                key={`${entry.account}-${entry.amount.currency}-${entry.amount.value}`}
              >
                <td />
                <td>
                  <TextLink href={`/application/accounts/${entry.account}`}>
                    {entry.account}
                  </TextLink>
                </td>
                <td className="font-mono">{entry.amount.currency}</td>
                <td className="text-right font-mono">{entry.amount.value}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
