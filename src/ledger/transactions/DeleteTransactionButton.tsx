import { Button } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { CrossCircledIcon, TrashIcon } from "@modulz/radix-icons";
import { AxiosError } from "axios";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { Navigate } from "react-router-dom";
import { deleteTransaction, ResourceCollection, Transaction } from "./api";
import { transactionKeys } from "../queries";

interface Props {
  transaction: Transaction;
}

const DeleteTransactionButton: React.FC<Props> = ({ transaction }) => {
  const notifications = useNotifications();

  const queryClient = useQueryClient();
  const mutation = useMutation<void, AxiosError>(
    async () => deleteTransaction(transaction.id),
    {
      onError: (error) => {
        const message =
          error.response?.data?.message ?? "Something went wrong.";
        notifications.showNotification({
          color: "red",
          icon: <CrossCircledIcon />,
          message,
        });
      },

      onSettled: () => {
        queryClient.invalidateQueries(transactionKeys.all);
      },

      onSuccess: () => {
        notifications.showNotification({
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
