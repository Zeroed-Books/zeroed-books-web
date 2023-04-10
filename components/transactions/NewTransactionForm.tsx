"use client";

import { showNotification } from "@mantine/notifications";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { AxiosError } from "axios";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApiClient from "@/src/api/useApiClient";
import { NewTransaction, Transaction } from "@/src/api/reps";
import { transactionKeys } from "@/src/ledger/queries";
import TransactionForm from "./TransactionForm";
import useTransactionForm from "./useTransactionForm";
import { FieldError } from "react-hook-form";

const createErrorResponse = (error: AxiosError): FieldError => {
  if (error.response?.data?.message) {
    return {
      message: error.response.data.message,
      type: error.response.status.toString(),
    };
  }

  return {
    message: "Something went wrong. Please try again.",
    type: "500",
  };
};

const NewTransactionForm = () => {
  const form = useTransactionForm();

  const client = useApiClient();
  const queryClient = useQueryClient();
  const mutation = useMutation<Transaction, AxiosError, NewTransaction>(
    (newTransaction) => client.createTransaction(newTransaction),
    {
      onError: (error) => {
        form.setError("root.serverError", createErrorResponse(error));
      },

      onSuccess: () => {
        showNotification({
          color: "green",
          icon: <CheckCircledIcon style={{ width: "32px", height: "32px" }} />,
          message: "Transaction created.",
        });

        // Reset the form, but leave the selected date intact because a user is
        // likely to be entering transaction chronologically, and the next
        // transaction is probably close to the one they just entered.
        const selectedDate = form.getValues("date");
        form.reset({ ...form.defaultValues, date: selectedDate });

        queryClient.invalidateQueries(transactionKeys.list());
      },
    }
  );

  return (
    <TransactionForm
      form={form}
      loading={mutation.isLoading}
      onSubmit={mutation.mutate}
    />
  );
};

export default NewTransactionForm;
