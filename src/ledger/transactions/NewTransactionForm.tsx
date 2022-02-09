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
import { transactionKeys } from "../queries";
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

        // Reset the form, but leave the selected date intact because a user is
        // likely to be entering transaction chronologically, and the next
        // transaction is probably close to the one they just entered.
        const selectedDate = form.values.date;
        form.reset();
        form.setFieldValue("date", selectedDate);

        queryClient.invalidateQueries(transactionKeys.list());
      },
    }
  );

  return (
    <TransactionForm
      error={mutation.error ? createErrorResponse(mutation.error) : undefined}
      formData={form}
      loading={mutation.isLoading}
      onSubmit={mutation.mutate}
    />
  );
};

export default NewTransactionForm;
