import apiClient from "../../apiClient";
import { API_ROOT } from "../../settings";

const client = apiClient();

export interface ResourceCollection<T> {
  next: null | string;
  items: T[];
}

export interface NewTransaction {
  date: string;
  payee: string;
  notes: string;
  entries: NewTransactionEntry[];
}

export interface NewTransactionEntry {
  account: string;
  amount?: {
    currency: string;
    value: string;
  };
}

export interface Transaction {
  id: string;
  date: string;
  payee: string;
  notes: string;
  entries: TransactionEntry[];
  created_at: string;
  updated_at: string;
}

export interface TransactionEntry {
  account: string;
  amount: {
    currency: string;
    value: string;
  };
}

export interface TransactionValidationError {
  message: string | null;
}

export const createTransaction = async (
  transaction: NewTransaction
): Promise<Transaction> => {
  const url = `${API_ROOT}/ledger/transactions`;
  const response = await client.post<Transaction>(url, transaction);

  return response.data;
};

export const deleteTransaction = async (
  transactionID: string
): Promise<void> => {
  const url = `${API_ROOT}/ledger/transactions/${transactionID}`;
  await client.delete(url);
};

export const getTransaction = async (id: string): Promise<Transaction> => {
  const url = `${API_ROOT}/ledger/transactions/${id}`;
  const response = await client.get<Transaction>(url);

  return response.data;
};

interface TransactionListParams {
  account?: string;
  after?: string;
}

export const getTransactions = async (
  params?: Partial<TransactionListParams>
): Promise<ResourceCollection<Transaction>> => {
  const url = `${API_ROOT}/ledger/transactions`;
  const response = await client.get<ResourceCollection<Transaction>>(url, {
    params,
  });

  return response.data;
};
