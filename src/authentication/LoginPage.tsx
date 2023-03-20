import { Alert, Container, Title } from "@mantine/core";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { AxiosError } from "axios";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Location, Navigate, useLocation } from "react-router-dom";
import LoginForm from "./LoginForm";
import useAuthStatus from "./useAuthStatus";
import useApiClient from "../api/useApiClient";
import { Credentials } from "../api/reps";

interface PageState {
  from?: Location;
}

const LoginPage = () => {
  const authStatus = useAuthStatus();
  const location = useLocation();

  const nextURL = (location.state as PageState)?.from?.pathname ?? "/";

  const client = useApiClient();
  const queryClient = useQueryClient();
  const loginMutation = useMutation<void, AxiosError, Credentials>(
    (credentials) => client.createCookieSession(credentials),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["authentication"]);
      },
    }
  );

  if (authStatus.isAuthenticated || loginMutation.isSuccess) {
    return <Navigate to={nextURL} />;
  }

  return (
    <Container size="xs">
      <Title mb="lg" order={1}>
        Log In
      </Title>
      {loginMutation.isError && (
        <Alert icon={<CrossCircledIcon />} title="Error!" color="red" mb="lg">
          {loginMutation.error.response?.data?.message ?? "Unknown"}
        </Alert>
      )}
      <LoginForm
        loading={loginMutation.isLoading}
        onSubmit={loginMutation.mutate}
      />
    </Container>
  );
};

export default LoginPage;
