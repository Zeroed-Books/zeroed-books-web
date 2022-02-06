import { Alert, Button, Container, PasswordInput, Title } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useNotifications } from "@mantine/notifications";
import { LockClosedIcon } from "@modulz/radix-icons";
import { AxiosError } from "axios";
import React from "react";
import { useMutation } from "react-query";
import { Navigate, useParams } from "react-router-dom";
import InputError from "../InputError";
import { createPasswordReset } from "./api";

interface PasswordResetError {
  new_password: string[];
  token: string[];
}

const PasswordResetPage = () => {
  const notifications = useNotifications();

  const { token } = useParams();
  const mutation = useMutation<void, AxiosError<PasswordResetError>, string>(
    async (password: string) => {
      if (token) {
        await createPasswordReset({ new_password: password, token });
      }
    },
    {
      onSuccess: () => {
        notifications.showNotification({
          color: "green",
          message: "Your password has been changed. Please log in.",
        });
      },
    }
  );
  const form = useForm({
    initialValues: {
      password: "",
    },
  });

  if (mutation.isSuccess) {
    return <Navigate to="/login" />;
  }

  const tokenErrors = mutation.error?.response?.data?.token ?? [];
  const passwordErrors = mutation.error?.response?.data?.new_password ?? [];

  return (
    <Container size="xs">
      <Title mb="xl" order={1}>
        Change Your Password
      </Title>

      {tokenErrors.length > 0 && (
        <Alert color="red" mb="lg">
          <InputError error={tokenErrors} />
        </Alert>
      )}

      <form onSubmit={form.onSubmit((data) => mutation.mutate(data.password))}>
        <PasswordInput
          {...form.getInputProps("password")}
          disabled={mutation.isLoading}
          error={
            passwordErrors.length > 0 && <InputError error={passwordErrors} />
          }
          icon={<LockClosedIcon />}
          label="New Password"
          mb="md"
          required
        />
        <Button loading={mutation.isLoading} type="submit">
          Change Password
        </Button>
      </form>
    </Container>
  );
};

export default PasswordResetPage;
