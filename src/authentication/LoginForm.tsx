import React from "react";
import {
  Anchor,
  Button,
  Group,
  LoadingOverlay,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { EnvelopeClosedIcon, LockClosedIcon } from "@modulz/radix-icons";
import { Link } from "react-router-dom";
import { Credentials } from "./api";

interface Props {
  loading: boolean;
  onSubmit: (credentials: Credentials) => void;
}

const LoginForm: React.FC<Props> = ({ loading, onSubmit }) => {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)} style={{ position: "relative" }}>
      <LoadingOverlay visible={loading} />
      <TextInput
        disabled={loading}
        icon={<EnvelopeClosedIcon />}
        label="Email"
        mb="md"
        type="email"
        required
        {...form.getInputProps("email")}
      />
      <PasswordInput
        disabled={loading}
        icon={<LockClosedIcon />}
        label="Password"
        mb="md"
        required
        {...form.getInputProps("password")}
      />
      <Group position="apart">
        <Button disabled={loading} type="submit">
          Log In
        </Button>
        <Anchor component={Link} to="/reset-your-password">
          Forgot your password?
        </Anchor>
      </Group>
    </form>
  );
};

export default LoginForm;
