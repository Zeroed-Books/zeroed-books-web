import apiClient from "../../apiClient";
import { API_ROOT } from "../../settings";

const client = apiClient();

export interface AccountBalance {
  currency: string;
  value: string;
}

export const getAccountBalance = async (
  account: string
): Promise<AccountBalance[]> => {
  const url = `${API_ROOT}/ledger/accounts/${account}/balance`;
  const response = await client.get<AccountBalance[]>(url);

  return response.data;
};
