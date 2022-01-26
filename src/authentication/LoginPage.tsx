import { Container, Title } from '@mantine/core';
import React from 'react';
import LoginForm from './LoginForm';

const LoginPage = () => (
    <Container size="xs">
            <Title mb="lg" order={1}>Log In</Title>
            <LoginForm loading={false} onSubmit={(event) => console.log(event)} />
        </Container>
);

export default LoginPage;
