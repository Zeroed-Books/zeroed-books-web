export interface AccountBalance {
  currency: string;
  value: string;
}

export type AccountBalanceReportInterval = "daily" | "monthly";

export type AccountPeriodicBalances = Record<string, CurrencyPeriodicBalances>;

export interface Currency {
  code: string;
  minor_units: number;
}

export interface CurrencyPeriodicBalances {
  currency: Currency;
  balances: InstantBalance[];
}

export interface InstantBalance {
  instant: string;
  balance: string;
}

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

export interface PeriodicAccountBalanceParams {
  interval?: AccountBalanceReportInterval;
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

export interface TransactionListParams {
  account?: string;
  after?: string;
}
