import {
  Anchor,
  Center,
  Divider,
  Group,
  Loader,
  Paper,
  Skeleton,
  Text,
} from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import React, { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { transactionKeys } from "../queries";
import { Transaction, ResourceCollection } from "@/src/api/reps";
import useApiClient from "@/src/api/useApiClient";

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
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <Paper key={index} p="md" mb="lg" shadow="sm">
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
        <Paper key={transaction.id} mb="lg" p="md" shadow="sm">
          <div>
            <Text>
              {transaction.date} &mdash;{" "}
              <Anchor component={Link} to={`/transactions/${transaction.id}`}>
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

interface Props {
  account?: string;
}

const TransactionList: React.FC<Props> = ({ account }) => {
  const client = useApiClient();
  const fetchTransactions = async ({ pageParam }: { pageParam?: string }) =>
    client.getTransactions({ account, after: pageParam });

  const listQuery = useInfiniteQuery<ResourceCollection<Transaction>>(
    transactionKeys.list(account),
    fetchTransactions,
    {
      getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    }
  );

  const { ref: loadMoreRef, entry: observer } = useIntersection({
    // On mobile, the URL bar at the bottom of the screen prevents the target
    // element from ever being intersected. Adding a 100px margin at the bottom
    // fixes the problem.
    rootMargin: "0px 0px 100px 0px",
  });

  useEffect(() => {
    if (
      !listQuery.isFetchingNextPage &&
      listQuery.hasNextPage &&
      observer?.isIntersecting
    ) {
      listQuery.fetchNextPage();
    }
  }, [
    listQuery,
    // Include `isFetching` so that if a page is fetched and the last element is
    // still in the viewport, the effect is triggered again.
    listQuery.isFetching,
    observer?.isIntersecting,
  ]);

  return (
    <>
      {listQuery.data?.pages?.map((page, i) => (
        <DisplayTransactionList
          key={`${i}-${page.next}`}
          loading={listQuery.isFetching}
          transactions={page?.items ?? []}
        />
      ))}

      <Divider mx="xl" my="lg" ref={loadMoreRef} />

      <Center>
        {!listQuery.hasNextPage ? (
          <Text color="dimmed">No more transactions.</Text>
        ) : (
          listQuery.isFetchingNextPage && <Loader />
        )}
      </Center>
    </>
  );
};

export default TransactionList;
