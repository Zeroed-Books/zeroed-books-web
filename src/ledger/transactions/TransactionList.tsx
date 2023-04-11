"use client";

import { Center, Divider, Loader, Text } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import React, { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { transactionKeys } from "../queries";
import { Transaction, ResourceCollection } from "@/src/api/reps";
import useApiClient from "@/components/api/useApiClient";
import NewTransactionList from "@/components/transactions/TransactionList";

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

  const transactions = listQuery.data?.pages?.reduce(
    (transactions: Transaction[], page) => {
      transactions.push(...(page.items ?? []));
      return transactions;
    },
    []
  );

  return (
    <>
      <NewTransactionList transactions={transactions ?? []} />

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
