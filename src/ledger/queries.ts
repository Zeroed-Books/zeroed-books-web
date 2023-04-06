export const accountKeys = {
  all: ["accounts"] as const,
  active: ["active-accounts"] as const,
  balances: () => [...accountKeys.all, "balances"] as const,
  balance: (name?: string) => [...accountKeys.balances(), name] as const,
  balanceMonthly: (name: string) =>
    [...accountKeys.all, "monthly-balances", name] as const,
  details: () => [...accountKeys.all, "details"] as const,
  detail: (name?: string) => [...accountKeys.details(), name] as const,
  popularAccounts: (search?: string) =>
    [accountKeys.all, "popular", search] as const,
};

export const transactionKeys = {
  all: ["transactions"] as const,
  list: (account?: string) =>
    [...transactionKeys.all, "list", account] as const,
  details: () => [...transactionKeys.all, "details"] as const,
  detail: (id?: string) => [...transactionKeys.details(), id] as const,
};
