"use client";

import { showNotification } from "@mantine/notifications";
import { CrossCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionKeys } from "../../src/ledger/queries";
import useApiClient from "@/components/api/useApiClient";
import { ResourceCollection, Transaction } from "@/src/api/reps";

interface Props {
  transaction: Transaction;
}

export default function DeleteTransactionButton({ transaction }: Props) {
  const router = useRouter();
  const client = useApiClient();
  const queryClient = useQueryClient();
  const mutation = useMutation<void, AxiosError>(
    () => client.deleteTransaction(transaction.id),
    {
      onError: (error) => {
        const message =
          error.response?.data?.message ?? "Something went wrong.";
        showNotification({
          color: "red",
          icon: <CrossCircledIcon />,
          message,
        });
      },

      onSettled: () => {
        queryClient.invalidateQueries(transactionKeys.all);
      },

      onSuccess: () => {
        showNotification({
          color: "red",
          icon: <TrashIcon />,
          message: `Transaction for "${transaction.payee}" has been deleted.`,
          title: "Transaction Deleted",
        });

        // Remove the deleted transaction from the query data so it disappears
        // without requiring a refetch.
        const transactionList = queryClient.getQueryData<
          ResourceCollection<Transaction>
        >(transactionKeys.list());
        if (transactionList) {
          const updatedTransactions = transactionList.items.filter(
            (t) => t.id !== transaction.id
          );
          queryClient.setQueryData(transactionKeys.list(), updatedTransactions);
        }

        router.push("/application");
      },
    }
  );

  return (
    <button
      className="inline-flex items-center bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:bg-red-300"
      disabled={mutation.isLoading}
      onClick={() => mutation.mutate()}
    >
      {mutation.isLoading ? (
        <svg
          className="mr-2 h-5 w-4 animate-spin font-medium text-white"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <TrashIcon className="mr-2 w-4 scale-150" />
      )}
      <span className="font-bold">Delete</span>
    </button>
  );
}
