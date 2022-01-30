import { useNotifications } from "@mantine/notifications";
import { CheckCircledIcon } from "@modulz/radix-icons";
import { AxiosError } from "axios";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import {
  createTransaction,
  NewTransaction,
  Transaction,
  TransactionValidationError,
} from "./api";
import { transactionKeys } from "./queries";
import TransactionForm, { useTransactionForm } from "./TransactionForm";

const createErrorResponse = (error: AxiosError): TransactionValidationError => {
  if (error.response?.data) {
    return error.response.data as TransactionValidationError;
  }

  return {
    message: "Something went wrong. Please try again.",
  };
};

const NewTransactionForm = () => {
  const form = useTransactionForm();
  const notifications = useNotifications();

  const queryClient = useQueryClient();
  const mutation = useMutation<Transaction, AxiosError, NewTransaction>(
    createTransaction,
    {
      onSuccess: () => {
        notifications.showNotification({
          color: "green",
          icon: <CheckCircledIcon style={{ width: "32px", height: "32px" }} />,
          message: "Transaction created.",
        });

        form.reset();
        queryClient.invalidateQueries(transactionKeys.list());
      },
    }
  );

  return (
    <TransactionForm
      error={mutation.error && createErrorResponse(mutation.error)}
      formData={form}
      loading={mutation.isLoading}
      onSubmit={mutation.mutate}
    />
  );
};

export default NewTransactionForm;
