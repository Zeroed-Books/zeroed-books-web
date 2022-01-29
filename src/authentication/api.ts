import apiClient from "../apiClient";
import { API_ROOT } from "../settings";

const client = apiClient();

export interface Credentials {
  email: string;
  password: string;
}

export const createCookieSession = async (
  credentials: Credentials
): Promise<void> => {
  const url = `${API_ROOT}/authentication/cookie-sessions`;

  await client.post<void>(url, credentials);
};

export interface AuthStatus {
  user_id: string;
}

export const getAuthStatus = async (): Promise<AuthStatus> => {
  const url = `${API_ROOT}/authentication/me`;
  const response = await client.get<AuthStatus>(url);

  return response.data;
};
