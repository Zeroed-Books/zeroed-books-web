import { AxiosError } from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery } from "react-query";
import { AuthStatus, getAuthStatus } from "./api";

interface AuthContextData {
  isAuthenticated: boolean;
  setAuthenticated: (authStatus: boolean) => void;
}

const AuthContext = createContext<AuthContextData>({
  isAuthenticated: false,
  setAuthenticated: () => {},
});

// Pull the initial status from local storage so we don't get a redirect to the
// login page followed by an immediate redirect back to where we were on each
// page load.
const authStorageKey = "isAuthenticated";
const initialAuthStatus =
  window.localStorage.getItem(authStorageKey) === "true";

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(initialAuthStatus);
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
      // eslint-disable-next-line no-console
      console.debug("Failed to persist authentication status:", e);
    }
  }, [isAuthenticated]);

  useQuery<AuthStatus, AxiosError>(["authentication", "me"], getAuthStatus, {
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
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuthStatus = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return { isAuthenticated };
};

export default useAuthStatus;
