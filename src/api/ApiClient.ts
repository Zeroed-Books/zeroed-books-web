/* eslint-disable spaced-comment */

import axios, { Axios, AxiosRequestConfig } from "axios";
import {
  AccountBalance,
  AuthStatus,
  Credentials,
  NewTransaction,
  PasswordReset,
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
  //                              Authentication                              //
  //////////////////////////////////////////////////////////////////////////////

  public async createCookieSession(credentials: Credentials): Promise<void> {
    const url = `${ApiClient.Paths.AUTHENTICATION}/cookie-sessions`;

    await this.client.post<void>(url, credentials);
  }

  public async getAuthStatus(): Promise<AuthStatus> {
    const url = `${ApiClient.Paths.AUTHENTICATION}/me`;
    const response = await this.client.get<AuthStatus>(url);

    return response.data;
  }

  //////////////////////////////////////////////////////////////////////////////
  //                            Identities Services                           //
  //////////////////////////////////////////////////////////////////////////////

  public async createPasswordReset(request: PasswordReset): Promise<void> {
    const path = `${ApiClient.Paths.IDENTITIES}/password-resets`;

    await this.client.post<void>(path, request);
  }

  public async createPasswordResetRequest(email: string): Promise<void> {
    const path = `${ApiClient.Paths.IDENTITIES}/password-reset-requests`;

    await this.client.post<void>(path, { email });
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
