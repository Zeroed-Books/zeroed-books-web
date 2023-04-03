"use client";

import {
  NewTransaction,
  NewTransactionEntry,
  TransactionValidationError,
} from "@/src/api/reps";
import { Alert, Group } from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import React, { useCallback } from "react";
import AccountNameInput from "../accounts/AccountNameInput";
import LabeledInput from "../inputs/LabeledInput";

interface Props {
  error?: TransactionValidationError;
  formData: UseFormReturnType<FormData>;
  loading: boolean;
  onSubmit: (transaction: NewTransaction) => void;
}

interface FormData {
  date: Date;
  payee: string;
  entries: NewTransactionEntry[];
}

export const useTransactionForm = () =>
  useForm<FormData>({
    initialValues: {
      date: new Date(),
      payee: "",
      entries: Array(2)
        .fill(0)
        .map(() => ({
          account: "",
          amount: {
            currency: "USD",
            value: "",
          },
        })),
    },
  });

interface EntryFormProps {
  entry: NewTransactionEntry;
  index: number;
  loading: boolean;
  onChange: (index: number, entry: NewTransactionEntry) => void;
}

const EntryForm: React.FC<EntryFormProps> = ({
  entry,
  index,
  loading,
  onChange,
}) => (
  <Group ml="lg" mb="sm">
    <AccountNameInput
      disabled={loading}
      label="Account"
      onChange={(newValue) => onChange(index, { ...entry, account: newValue })}
      value={entry.account}
    />
    <LabeledInput
      disabled={loading}
      label="Amount"
      name="amount"
      onChange={(e) =>
        onChange(index, {
          ...entry,
          amount: { currency: "USD", value: e.currentTarget.value },
        })
      }
      step="0.01"
      type="number"
      value={entry.amount?.value ?? ""}
    />
  </Group>
);

const TransactionForm: React.FC<Props> = ({
  error,
  formData,
  loading,
  onSubmit,
}) => {
  const handleSubmit = useCallback(
    (data: FormData) => {
      onSubmit({
        date: dayjs(data.date).format("YYYY-MM-DD"),
        payee: data.payee,
        notes: "",
        entries: data.entries
          .filter((entry) => entry.account !== "")
          .map((entry) => {
            if (entry.amount?.value === "") {
              return {
                account: entry.account,
              };
            }

            return entry;
          }),
      });
    },
    [onSubmit]
  );

  const handleEntryChange = useCallback(
    (index: number, entry: NewTransactionEntry) => {
      const { entries } = formData.values;
      formData.setFieldValue("entries", [
        ...entries.slice(0, index),
        entry,
        ...entries.slice(index + 1),
      ]);
    },
    [formData]
  );

  return (
    <form
      onSubmit={formData.onSubmit(handleSubmit)}
      style={{ position: "relative" }}
    >
      {error?.message && (
        <Alert color="red" icon={<CrossCircledIcon />} mb="lg" title="Error">
          {error.message}
        </Alert>
      )}

      <div className="flex gap-4">
        <LabeledInput
          disabled={loading}
          label="Date"
          required
          type="date"
          {...formData.getInputProps("date")}
          value={dayjs(formData.values.date).format("YYYY-MM-DD")}
        />
        <div className="flex-grow">
          <LabeledInput
            disabled={loading}
            label="Payee"
            required
            {...formData.getInputProps("payee")}
          />
        </div>
      </div>
      {formData.values.entries.map((entry, index) => (
        <EntryForm
          entry={entry}
          index={index}
          key={index}
          loading={loading}
          onChange={handleEntryChange}
        />
      ))}
      <div className="flex justify-end">
        <button
          className="bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-green-400"
          disabled={loading}
          type="submit"
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
