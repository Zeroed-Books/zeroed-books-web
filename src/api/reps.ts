export interface AccountBalance {
  currency: string;
  value: string;
}

/**
 * Information about an authenticated user.
 */
export interface AuthStatus {
  /** The ID of the currently authenticated user. */
  user_id: string;
}

/**
 * An email/password combination that identify a user.
 */
export interface Credentials {
  email: string;
  password: string;
}

export interface PasswordReset {
  new_password: string;
  token: string;
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
