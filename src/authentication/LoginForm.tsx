import React from 'react';
import { Button, LoadingOverlay, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { EnvelopeClosedIcon, LockClosedIcon } from '@modulz/radix-icons';

interface Credentials {
    email: string;
    password: string;
}

interface Props {
    loading: boolean;
    onSubmit: (credentials: Credentials) => void;
}

const LoginForm: React.FC<Props> = ({ loading, onSubmit }) => {
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        }
    });

    return (
        <form onSubmit={form.onSubmit(onSubmit)} style={{ position: "relative" }}>
            <LoadingOverlay visible={loading} />
            <TextInput disabled={loading} icon={<EnvelopeClosedIcon />} label="Email" mb="md" type="email" required={true} {...form.getInputProps("email")} />
            <PasswordInput disabled={loading} icon={<LockClosedIcon />} label="Password" mb="md" required={true} {...form.getInputProps("password")} />
            <Button disabled={loading} type="submit">Log In</Button>
        </form>
    )
};

export default LoginForm;
