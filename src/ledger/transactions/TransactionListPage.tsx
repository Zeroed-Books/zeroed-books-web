import { Container, Title } from "@mantine/core";
import React from "react";
import TransactionList from "./TransactionList";

const TransactionListPage = () => (
  <Container size="md">
    <Title order={1} mb="xl">
      Transactions
    </Title>
    <TransactionList />
  </Container>
);

export default TransactionListPage;
