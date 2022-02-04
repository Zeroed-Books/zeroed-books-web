import { Button, Container, List, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { EnvelopeClosedIcon } from "@modulz/radix-icons";
import { AxiosError } from "axios";
import React from "react";
import { useMutation } from "react-query";
import { Navigate } from "react-router-dom";
import { createPasswordResetRequest } from "../identities/api";
import InputError from "../InputError";

interface PasswordResetRequestError {
  email: string[];
}

const PasswordResetRequestPage = () => {
  const mutation = useMutation<
    void,
    AxiosError<PasswordResetRequestError>,
    string
  >(createPasswordResetRequest);
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
        account, and we'll send you a link to reset your password.
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
