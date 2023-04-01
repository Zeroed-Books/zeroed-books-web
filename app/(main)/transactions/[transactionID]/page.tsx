import TransactionDetail from "@/components/transactions/TransactionDetail";

interface PageProps {
  params: {
    transactionID: string;
  };
}

export default async function TransactionDetailPage({ params }: PageProps) {
  return <TransactionDetail transactionID={params.transactionID} />;
}
