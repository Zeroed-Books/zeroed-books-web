export interface AccountBalance {
  currency: Currency;
  value: number;
}

export type AccountBalanceReportInterval = "daily" | "monthly" | "weekly";

export type AccountPeriodicBalances = Record<string, CurrencyPeriodicBalances>;

export interface Currency {
  code: string;
  minorUnits: number;
}

export interface CurrencyPeriodicBalances {
  currency: Currency;
  balances: InstantBalance[];
}

export interface InstantBalance {
  instant: string;
  balance: number;
}

export interface ResourceCollection<T> {
  next: null | string;
  items: T[];
}

export interface NewTransaction {
  date: string;
  payee: string;
  notes?: string;
  entries: NewTransactionEntry[];
}

export interface NewTransactionEntry {
  account: string;
  amount?: {
    currency: string;
    value: number;
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
    currency: Currency;
    value: number;
  };
}

export interface TransactionValidationError {
  message: string | null;
}

export interface TransactionListParams {
  account?: string;
  after?: string;
}
