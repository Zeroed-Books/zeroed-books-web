import axios, { Axios, AxiosRequestConfig } from "axios";
import {
  AccountBalance,
  AccountPeriodicBalances,
  NewTransaction,
  ResourceCollection,
  Transaction,
  TransactionListParams,
} from "./reps";

class ApiClient {
  /**
   * Axios HTTP client used to make requests.
   */
  private readonly client: Axios;

  private static readonly Paths = {
    ACCOUNTS: "/ledger/accounts",
    AUTHENTICATION: "/authentication",
    IDENTITIES: "/identities",
    TRANSACTIONS: "/ledger/transactions",
  };

  /**
   * Construct a new API client.
   *
   * @param apiRoot - The base URL of the API to interact with, including a
   * scheme, host, and port (if applicable).
   * @param axiosOptions - Additional options to pass to the underlying axios
   * client used to make requests.
   */
  constructor(apiRoot: string, axiosOptions?: AxiosRequestConfig) {
    const config: AxiosRequestConfig = {
      baseURL: apiRoot,
      // Our API uses cookies for authentication, so we need to send credentials
      // with each request
      withCredentials: true,
      ...axiosOptions,
    };

    this.client = axios.create(config);
  }

  //////////////////////////////////////////////////////////////////////////////
  //                                 Accounts                                 //
  //////////////////////////////////////////////////////////////////////////////

  public async getAccountBalance(account: string): Promise<AccountBalance[]> {
    const path = `${ApiClient.Paths.ACCOUNTS}/${account}/balance`;
    const response = await this.client.get<AccountBalance[]>(path);

    return response.data;
  }

  public async getAccountBalanceMonthly(
    account: string
  ): Promise<Record<string, AccountBalance[]>> {
    const path = `${ApiClient.Paths.ACCOUNTS}/${account}/balance/monthly`;
    const response = await this.client.get(path);

    return response.data;
  }

  public async getAccountBalancePeriodic(
    account: string
  ): Promise<AccountPeriodicBalances> {
    const path = `${ApiClient.Paths.ACCOUNTS}/${account}/balance/periodic`;
    const response = await this.client.get<AccountPeriodicBalances>(path);

    return response.data;
  }

  public async getActiveAccounts(): Promise<string[]> {
    const path = "/ledger/active-accounts";
    const response = await this.client.get<string[]>(path);

    return response.data;
  }

  public async getPopularAccounts(search?: string): Promise<string[]> {
    const path = ApiClient.Paths.ACCOUNTS;
    const params: { query?: string } = {};
    if (search) {
      params.query = search;
    }

    const response = await this.client.get<string[]>(path, { params });

    return response.data;
  }

  //////////////////////////////////////////////////////////////////////////////
  //                               Transactions                               //
  //////////////////////////////////////////////////////////////////////////////

  public async createTransaction(
    transaction: NewTransaction
  ): Promise<Transaction> {
    const url = ApiClient.Paths.TRANSACTIONS;
    const response = await this.client.post<Transaction>(url, transaction);

    return response.data;
  }

  public async deleteTransaction(transactionID: string): Promise<void> {
    const url = `${ApiClient.Paths.TRANSACTIONS}/${transactionID}`;
    await this.client.delete(url);
  }

  public async getTransaction(id: string): Promise<Transaction> {
    const url = `${ApiClient.Paths.TRANSACTIONS}/${id}`;
    const response = await this.client.get<Transaction>(url);

    return response.data;
  }

  public async getTransactions(
    params?: Partial<TransactionListParams>
  ): Promise<ResourceCollection<Transaction>> {
    const url = ApiClient.Paths.TRANSACTIONS;
    const response = await this.client.get<ResourceCollection<Transaction>>(
      url,
      {
        params,
      }
    );

    return response.data;
  }
}

export default ApiClient;
