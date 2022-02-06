import { Container, Text, Title } from "@mantine/core";
import React from "react";

const NotFound = () => (
  <Container size="xs">
    <Title order={1} mb="lg">
      Not Found
    </Title>
    <Text size="lg">You&apos;ve reached a page that doesn&apos;t exist.</Text>
  </Container>
);

export default NotFound;
