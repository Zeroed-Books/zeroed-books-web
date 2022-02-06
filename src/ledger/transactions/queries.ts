// We will eventually have more query key types (eg accounts).
// eslint-disable-next-line import/prefer-default-export
export const transactionKeys = {
  all: ["transactions"] as const,
  list: () => [...transactionKeys.all, "list"] as const,
  details: () => [...transactionKeys.all, "details"] as const,
  detail: (id?: string) => [...transactionKeys.details(), id] as const,
};
