import { Anchor, Group, Paper, Skeleton, Text } from "@mantine/core";
import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { getTransactions, Transaction } from "./api";
import { transactionKeys } from "./queries";

interface DisplayTransactionListProps {
  loading: boolean;
  transactions: Transaction[];
}

const DisplayTransactionList: React.FC<DisplayTransactionListProps> = ({
  loading,
  transactions,
}) => {
  const showSkeleton = loading && transactions.length === 0;

  if (showSkeleton) {
    return (
      <>
        {[...Array(5).keys()].map((_, index) => (
          <Paper key={index} padding="md" mb="lg" shadow="sm">
            <Skeleton height={16} mb="md" width="30%" />
            <Skeleton height={8} mb="sm" ml="xl" width="80%" />
            <Skeleton height={8} mb="sm" ml="xl" width="80%" />
          </Paper>
        ))}
      </>
    );
  }

  return (
    <>
      {transactions.map((transaction) => (
        <Paper key={transaction.id} mb="lg" padding="md" shadow="sm">
          <div>
            <Text>
              {transaction.date} &mdash;{" "}
              <Anchor component={Link} to={`transactions/${transaction.id}`}>
                {transaction.payee}
              </Anchor>
            </Text>
          </div>
          {transaction.entries.map((entry) => (
            <Group
              key={`${entry.account}-${entry.amount.currency}-${entry.amount.value}`}
            >
              <Anchor
                component={Link}
                ml="lg"
                to={`/accounts/${entry.account}`}
                style={{ flexGrow: 1 }}
              >
                {entry.account}
              </Anchor>
              <Text>
                {entry.amount.currency} {entry.amount.value}
              </Text>
            </Group>
          ))}
        </Paper>
      ))}
    </>
  );
};

const TransactionList = () => {
  const listQuery = useQuery(transactionKeys.list(), getTransactions);

  return (
    <DisplayTransactionList
      loading={listQuery.isFetching}
      transactions={listQuery?.data?.items ?? []}
    />
  );
};

export default TransactionList;
