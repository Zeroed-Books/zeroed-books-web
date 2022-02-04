import { Container, Text, Title } from "@mantine/core";
import React from "react";

const PasswordResetRequestSentPage = () => (
  <Container size="xs">
    <Title mb="xl" order={1}>
      Sent
    </Title>
    <Text>
      Instructions on how to reset your password have been sent to your email.
    </Text>
  </Container>
);

export default PasswordResetRequestSentPage;
