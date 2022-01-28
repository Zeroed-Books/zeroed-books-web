import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStatus from "./useAuthStatus";

interface Props {
  children: JSX.Element;
}

const RequireAuth: React.FC<Props> = ({ children }) => {
  const auth = useAuthStatus();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace={true} />;
  }

  return children;
};

export default RequireAuth;
