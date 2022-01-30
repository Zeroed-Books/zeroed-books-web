import { Button } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { useNotifications } from "@mantine/notifications";
import { TrashIcon } from "@modulz/radix-icons";
import React from "react";
import { useMutation } from "react-query";
import { Navigate } from "react-router-dom";
import { deleteTransaction, Transaction } from "./api";

interface Props {
  transaction: Transaction;
}

const DeleteTransactionButton: React.FC<Props> = ({ transaction }) => {
  const notifications = useNotifications();
  const mutation = useMutation(async () => deleteTransaction(transaction.id), {
    onSuccess: () => {
      notifications.showNotification({
        color: "red",
        icon: <TrashIcon />,
        message: `Transaction for "${transaction.payee}" has been deleted.`,
        title: "Transaction Deleted",
      });
    },
  });

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
