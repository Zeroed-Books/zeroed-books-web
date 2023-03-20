import { AxiosError } from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import useApiClient from "../api/useApiClient";
import { AuthStatus } from "../api/reps";

export interface AuthContextData {
  isAuthenticated: boolean;
  setAuthenticated: (authStatus: boolean) => void;
}

const AuthContext = createContext<AuthContextData>({
  isAuthenticated: false,
  setAuthenticated: () => {
    // noop
  },
});

// Pull the initial status from local storage so we don't get a redirect to the
// login page followed by an immediate redirect back to where we were on each
// page load.
const authStorageKey = "isAuthenticated";

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [isAuthenticated, setAuthenticated] = useState(
    () => window.localStorage.getItem(authStorageKey) === "true"
  );
  const value = useMemo(
    () => ({ isAuthenticated, setAuthenticated }),
    [isAuthenticated, setAuthenticated]
  );

  // Cache the current authentication status to local storage so we can use it
  // as the initial state for the next page load.
  useEffect(() => {
    try {
      window.localStorage.setItem(authStorageKey, isAuthenticated.toString());
    } catch (e) {
      // We don't really care that the caching operation failed because it just
      // means the auth status won't be immediately available on the next page
      // load, and we'll have to wait for the query to go through.
      console.debug("Failed to persist authentication status:", e);
    }
  }, [isAuthenticated]);

  const client = useApiClient();
  useQuery<AuthStatus, AxiosError>(
    ["authentication", "me"],
    () => client.getAuthStatus(),
    {
      onError: (error) => {
        // Only a received 401 response should mark the user as unauthenticated.
        // It's common to receive network errors from a query that occurs as the
        // user is refreshing the page, particularly in a dev environment.
        if (error.response?.status === 401) {
          setAuthenticated(false);
        }
      },
      onSuccess: () => {
        setAuthenticated(true);
      },
      retry: false,
      staleTime: 60_000,
    }
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuthStatus = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return { isAuthenticated };
};

export default useAuthStatus;
