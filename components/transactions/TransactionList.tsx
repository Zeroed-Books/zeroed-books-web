import { Transaction } from "@/src/api/reps";
import TextLink from "@/components/TextLink";
import formatCurrency from "@/currency/formatCurrency";

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
            {transaction.entries.map((entry) => {
              const [symbol, formatted] = formatCurrency(
                window.navigator.language,
                entry.amount.currency,
                entry.amount.value,
                { decimalPlaces: 2 }
              );

              return (
                <tr
                  key={`${entry.account}-${entry.amount.currency}-${entry.amount.value}`}
                >
                  <td />
                  <td>
                    <TextLink href={`/application/accounts/${entry.account}`}>
                      {entry.account}
                    </TextLink>
                  </td>
                  <td className="text-right font-mono">{symbol}</td>
                  <td className="text-right font-mono">{formatted}</td>
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>
    </div>
  );
}
