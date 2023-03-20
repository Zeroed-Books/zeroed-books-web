import { Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { CrossCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { AxiosError } from "axios";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { transactionKeys } from "../queries";
import useApiClient from "@/src/api/useApiClient";
import { ResourceCollection, Transaction } from "@/src/api/reps";

interface Props {
  transaction: Transaction;
}

const DeleteTransactionButton: React.FC<Props> = ({ transaction }) => {
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
      },
    }
  );

  if (mutation.isSuccess) {
    return <Navigate to="/" />;
  }

  return (
    <Button
      color="red"
      loading={mutation.isLoading}
      onClick={() => mutation.mutate()}
    >
      Delete
    </Button>
  );
};

export default DeleteTransactionButton;
