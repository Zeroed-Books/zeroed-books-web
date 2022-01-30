import { Alert, Button, Group, LoadingOverlay, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/hooks";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { CrossCircledIcon } from "@modulz/radix-icons";
import dayjs from "dayjs";
import React, { useCallback } from "react";
import {
  NewTransaction,
  NewTransactionEntry,
  TransactionValidationError,
} from "./api";

interface Props {
  error?: TransactionValidationError;
  formData: UseForm<FormData>;
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
      entries: [...Array(2).keys()].map(() => ({
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
}) => {
  return (
    <Group ml="lg" mb="sm">
      <TextInput
        disabled={loading}
        label="Account"
        onChange={(e) =>
          onChange(index, { ...entry, account: e.currentTarget.value })
        }
        sx={{ flexGrow: 1 }}
        value={entry.account}
      />
      <TextInput
        disabled={loading}
        icon="$"
        label="Amount"
        onChange={(e) =>
          onChange(index, {
            ...entry,
            amount: { currency: "USD", value: e.currentTarget.value },
          })
        }
        value={entry.amount?.value ?? ""}
      />
    </Group>
  );
};

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
    [formData.setFieldValue, formData.values.entries]
  );

  return (
    <form
      onSubmit={formData.onSubmit(handleSubmit)}
      style={{ position: "relative" }}
    >
      <LoadingOverlay visible={loading} />

      {error?.message && (
        <Alert color="red" icon={<CrossCircledIcon />} mb="lg" title="Error">
          {error.message}
        </Alert>
      )}

      <Group mb="sm">
        <DatePicker
          clearable={false}
          disabled={loading}
          firstDayOfWeek="sunday"
          label="Date"
          required
          {...formData.getInputProps("date")}
        />
        <TextInput
          disabled={loading}
          label="Payee"
          required
          sx={{ flexGrow: 1 }}
          {...formData.getInputProps("payee")}
        />
      </Group>
      {formData.values.entries.map((entry, index) => (
        <EntryForm
          entry={entry}
          index={index}
          key={index}
          loading={loading}
          onChange={handleEntryChange}
        />
      ))}
      <Group position="right">
        <Button disabled={loading} loading={loading} type="submit">
          Create
        </Button>
      </Group>
    </form>
  );
};

export default TransactionForm;
