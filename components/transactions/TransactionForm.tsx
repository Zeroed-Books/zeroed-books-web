import {
  NewTransaction,
  NewTransactionEntry,
  Transaction,
  TransactionValidationError,
} from "@/src/api/reps";
import React, { useCallback } from "react";
import { Control, Controller, UseFormRegister } from "react-hook-form";
import AccountNameInput from "../accounts/AccountNameInput";
import {
  TransactionFormData,
  UseTransactionFormType,
} from "./useTransactionForm";
import FormInput from "../forms/FormInput";
import FormError from "../forms/FormError";

interface EntryFormProps {
  control: Control<TransactionFormData>;
  entry: NewTransactionEntry;
  index: number;
  loading: boolean;
  register: UseFormRegister<TransactionFormData>;
}

const EntryForm: React.FC<EntryFormProps> = ({
  control,
  index,
  loading,
  register,
}) => (
  <div className="mb-2 ml-4 inline-block md:inline-flex md:space-x-4">
    <Controller
      control={control}
      name={`entries.${index}.account`}
      render={({ field }) => (
        <AccountNameInput
          disabled={loading}
          label="Account"
          onChange={field.onChange}
          value={field.value}
        />
      )}
    />
    <FormInput
      disabled={loading}
      label="Amount"
      step="0.01"
      type="number"
      {...register(`entries.${index}.amount.value`)}
    />
  </div>
);

interface Props {
  error?: TransactionValidationError;
  form: UseTransactionFormType;
  loading: boolean;
  onSubmit: (transaction: NewTransaction) => void;
  transaction?: Transaction;
}

export default function TransactionForm({ form, loading, onSubmit }: Props) {
  const {
    formState: { errors },
  } = form;

  const submitFilteredData = useCallback(
    (data: TransactionFormData) => {
      onSubmit({
        date: data.date,
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

  return (
    <form onSubmit={form.handleSubmit(submitFilteredData)}>
      <FormError message={errors.root?.serverError?.message} />

      <div className="mb-2 flex gap-4">
        <div>
          <FormInput
            disabled={loading}
            error={errors.date}
            label="Date"
            type="date"
            {...form.register("date", { required: true })}
          />
        </div>
        <div className="flex-grow">
          <FormInput
            disabled={loading}
            error={errors.payee}
            label="Payee"
            {...form.register("payee", { required: true })}
          />
        </div>
      </div>
      <h3 className="mb-2 text-xl">Entries:</h3>
      <ol className="[counter-reset:section]">
        {form.entries.fields.map((field, index) => (
          <li
            className="align-text-top [counter-increment:section] before:align-top before:content-[counter(section)_'.']"
            key={field.id}
          >
            <EntryForm
              control={form.control}
              entry={field}
              index={index}
              loading={loading}
              register={form.register}
            />
          </li>
        ))}
      </ol>
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
}
