import { useFieldArray, useForm } from "react-hook-form";
import { NewTransactionEntry, Transaction } from "@/src/api/reps";

export interface TransactionFormData {
  date: string;
  payee: string;
  entries: NewTransactionEntry[];
}

const isoFormatDay = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return [year, month, day].join("-");
};

const useTransactionForm = (transaction?: Transaction) => {
  let defaultValues: TransactionFormData;
  if (transaction) {
    defaultValues = {
      date: transaction.date,
      payee: transaction.payee,
      entries: transaction.entries,
    };
  } else {
    defaultValues = {
      date: isoFormatDay(new Date()),
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
    };
  }

  const form = useForm<TransactionFormData>({
    defaultValues,
  });
  const entries = useFieldArray({ control: form.control, name: "entries" });

  return {
    ...form,
    defaultValues,
    entries,
  };
};

export default useTransactionForm;

export type UseTransactionFormType = ReturnType<typeof useTransactionForm>;
