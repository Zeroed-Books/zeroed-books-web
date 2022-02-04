import apiClient from "../apiClient";
import { API_ROOT } from "../settings";

const client = apiClient();

export interface PasswordReset {
  new_password: string;
  token: string;
}

export const createPasswordReset = async (
  request: PasswordReset
): Promise<void> => {
  const url = `${API_ROOT}/identities/password-resets`;

  await client.post<void>(url, request);
};

export const createPasswordResetRequest = async (
  email: string
): Promise<void> => {
  const url = `${API_ROOT}/identities/password-reset-requests`;

  await client.post<void>(url, { email });
};
