import nock from "nock";
import { describe, beforeEach, afterEach, expect, it } from "vitest";
import ApiClient from "./ApiClient";
import { AccountBalance } from "./reps";

describe("ApiClient", () => {
  const apiRoot = "http://localhost";
  let scope: nock.Scope;

  beforeEach(() => {
    scope = nock(apiRoot);
  });

  afterEach(() => {
    expect(scope.isDone());
  });

  describe("Account Services", () => {
    describe("getAccountBalance", () => {
      it("should return response data for a successful request", async () => {
        const account = "Expenses:Groceries";
        const path = `/ledger/accounts/${account}/balance`;

        const balances: AccountBalance[] = [
          {
            currency: "USD",
            value: "123.45",
          },
          {
            currency: "EUR",
            value: "543.21",
          },
        ];

        scope.get(path).reply(200, balances);

        const client = new ApiClient(apiRoot);

        const gotData = await client.getAccountBalance(account);

        expect(gotData).toMatchObject(balances);
      });
    });

    describe("getPopularAccounts", () => {
      it("should return the list of accounts", async () => {
        const path = "/ledger/accounts";

        const accounts = [
          "Liabilities:Credit",
          "Assets:Checking",
          "Expenses:Groceries",
        ];

        scope.get(path).reply(200, accounts);

        const client = new ApiClient(apiRoot);

        const gotData = await client.getPopularAccounts();

        expect(gotData).toMatchObject(accounts);
      });

      it("should pass the search string as a query parameter", async () => {
        const path = "/ledger/accounts";
        const search = "Expenses";

        const accounts = ["Expenses:Groceries"];

        scope.get(path).query({ query: search }).reply(200, accounts);

        const client = new ApiClient(apiRoot);

        const gotData = await client.getPopularAccounts(search);

        expect(gotData).toMatchObject(accounts);
      });
    });
  });
});
