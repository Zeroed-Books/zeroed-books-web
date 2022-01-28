import React, { createContext, useContext, useState } from "react";
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

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const value = { isAuthenticated, setAuthenticated };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuthStatus = () => {
  const { isAuthenticated, setAuthenticated } = useContext(AuthContext);
  const authStatusQuery = useQuery(["authentication", "me"], getAuthStatus, {
    onError: () => {
      setAuthenticated(false);
    },
    onSuccess: () => {
      setAuthenticated(true);
    },
    retry: false,
    staleTime: 60_000,
  });

  return { isAuthenticated };
};

export default useAuthStatus;
