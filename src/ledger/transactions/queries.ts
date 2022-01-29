export const transactionKeys = {
  all: ["transactions"] as const,
  list: () => [...transactionKeys.all, "list"] as const,
};
