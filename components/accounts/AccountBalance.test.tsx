import { render, screen } from "@testing-library/react";
import { describe, it, vitest } from "vitest";
import { ApiClientProvider } from "../api/ApiClientContext";
import TestQueryClientProvider from "@/test-utils/TestQueryClientProvider";
import AccountBalance from "./AccountBalance";
import ApiClient from "@/src/api/ApiClient";

interface AccountBalanceClient {
  getAccountBalance: ApiClient["getAccountBalance"];
}

const renderComponent = (client: AccountBalanceClient, account: string) => {
  render(
    <ApiClientProvider value={client as ApiClient}>
      <TestQueryClientProvider>
        <AccountBalance account={account} />
      </TestQueryClientProvider>
    </ApiClientProvider>
  );
};

describe("AccountBalance", () => {
  it("should show an account balance", async () => {
    const client = {
      getAccountBalance: vitest.fn(async () => [
        { currency: "USD", value: "1234.56" },
      ]),
    };

    renderComponent(client, "Expenses");

    await screen.findByText("$1,234.56");
  });

  it("should show multiple account balances", async () => {
    const client = {
      getAccountBalance: vitest.fn(async () => [
        { currency: "USD", value: "1234.56" },
        { currency: "EUR", value: "6543.21" },
      ]),
    };

    renderComponent(client, "Expenses");

    await screen.findByText("$1,234.56");
    await screen.findByText("EUR 6,543.21");
  });
});
