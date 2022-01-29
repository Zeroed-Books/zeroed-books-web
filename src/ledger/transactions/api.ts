import apiClient from "../../apiClient";
import { API_ROOT } from "../../settings";

const client = apiClient();

export interface ResourceCollection<T> {
  items: T[];
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

export const getTransactions = async (): Promise<
  ResourceCollection<Transaction>
> => {
  const url = `${API_ROOT}/ledger/transactions`;
  const response = await client.get<ResourceCollection<Transaction>>(url);

  return response.data;
};
