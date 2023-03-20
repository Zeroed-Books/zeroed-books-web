import { Button, Container, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { AxiosError } from "axios";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import InputError from "../InputError";
import useApiClient from "../api/useApiClient";

interface PasswordResetRequestError {
  email: string[];
}

const PasswordResetRequestPage = () => {
  const client = useApiClient();
  const mutation = useMutation<
    void,
    AxiosError<PasswordResetRequestError>,
    string
  >((email) => client.createPasswordResetRequest(email));
  const form = useForm({
    initialValues: {
      email: "",
    },
  });

  if (mutation.isSuccess) {
    return <Navigate to="sent" />;
  }

  const emailErrors = mutation.error?.response?.data?.email;

  return (
    <Container size="xs">
      <Title mb="xl" order={1}>
        Reset Your Password
      </Title>
      <Text mb="xl">
        Forgot your password? Enter the email address you used to create your
        account, and we&apos;ll send you a link to reset your password.
      </Text>

      <form onSubmit={form.onSubmit((data) => mutation.mutate(data.email))}>
        <TextInput
          {...form.getInputProps("email")}
          disabled={mutation.isLoading}
          error={emailErrors && <InputError error={emailErrors} />}
          icon={<EnvelopeClosedIcon />}
          label="Email"
          mb="md"
          required
          type="email"
        />
        <Button loading={mutation.isLoading} type="submit">
          Request Reset
        </Button>
      </form>
    </Container>
  );
};

export default PasswordResetRequestPage;
