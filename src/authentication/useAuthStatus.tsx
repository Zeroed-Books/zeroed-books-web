import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getAuthStatus } from "./api";

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
  const value = { isAuthenticated, setAuthenticated };

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

  useQuery(["authentication", "me"], getAuthStatus, {
    onError: () => {
      setAuthenticated(false);
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
