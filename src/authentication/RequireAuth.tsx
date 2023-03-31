import React from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Center, Loader } from "@mantine/core";

interface Props {
  children: JSX.Element;
}

const RequireAuth: React.FC<Props> = ({ children }) => {
  const { isLoading, user } = useUser();
  const location = useLocation();

  if (!user && !isLoading) {
    window.location.replace(`/api/auth/login?returnTo=${location.pathname}`);

    return null;
  }

  if (isLoading) {
    <Center style={{ height: "200px", width: "100%" }}>
      <Loader size="xl" />
    </Center>;
  }

  return children;
};

export default RequireAuth;
