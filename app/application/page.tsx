import NewTransactionForm from "@/components/transactions/NewTransactionForm";
import TransactionList from "@/src/ledger/transactions/TransactionList";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-4 text-2xl">New Transaction</h2>
      <NewTransactionForm />

      <h2 className="mb-4 text-2xl">Transactions</h2>
      <TransactionList />
    </div>
  );
}
