import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vitest } from "vitest";
import TransactionForm from "./TransactionForm";
import { ComponentProps } from "react";
import useTransactionForm from "./useTransactionForm";
import TestQueryClientProvider from "@/test-utils/TestQueryClientProvider";

const TestFormWrapper = ({
  onSubmit,
}: Pick<ComponentProps<typeof TransactionForm>, "onSubmit">) => {
  const form = useTransactionForm();

  return (
    <TestQueryClientProvider>
      <TransactionForm form={form} loading={false} onSubmit={onSubmit} />
    </TestQueryClientProvider>
  );
};

describe("TransactionForm", () => {
  it("should be submittable", async () => {
    const user = userEvent.setup();

    const handleSubmit = vitest.fn();
    render(<TestFormWrapper onSubmit={handleSubmit} />);

    const date = "2023-04-09";
    const dateInput = screen.getByLabelText(/date/i);
    await user.clear(dateInput);
    await user.type(dateInput, date);

    const payee = "Grocery Store";
    await user.type(screen.getByLabelText(/payee/i), payee);

    const [accountInput1, accountInput2] = screen.getAllByLabelText(/account/i);
    const [amountInput1] = screen.getAllByLabelText(/amount/i);

    const account1 = "Expenses:Groceries";
    const amount1 = "23.74";
    const account2 = "Assets:Checking";

    await user.type(accountInput1, account1);
    await user.type(amountInput1, amount1);
    await user.type(accountInput2, account2);

    const expectedData = {
      date,
      payee,
      notes: "",
      entries: [
        {
          account: account1,
          amount: {
            currency: "USD",
            value: 2374,
          },
        },
        {
          account: account2,
        },
      ],
    };

    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(handleSubmit).toHaveBeenCalledWith(expectedData);
  });

  it("should require a date and payee", async () => {
    const user = userEvent.setup();

    const handleSubmit = vitest.fn();
    render(<TestFormWrapper onSubmit={handleSubmit} />);

    await user.clear(screen.getByLabelText(/date/i));
    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
