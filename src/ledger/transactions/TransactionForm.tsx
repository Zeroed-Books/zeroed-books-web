import {
  NewTransaction,
  NewTransactionEntry,
  TransactionValidationError,
} from "@/src/api/reps";
import { Alert, Button, Group, LoadingOverlay, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, UseFormReturnType } from "@mantine/form";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import React, { useCallback } from "react";
import AccountNameInput from "../accounts/AccountNameInput";

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
        <DateInput
          clearable={false}
          disabled={loading}
          firstDayOfWeek={0}
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
          // eslint-disable-next-line react/no-array-index-key
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
