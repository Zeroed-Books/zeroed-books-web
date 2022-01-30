import { Container, Title } from "@mantine/core";
import React from "react";
import NewTransactionForm from "./ledger/transactions/NewTransactionForm";
import TransactionList from "./ledger/transactions/TransactionList";

const HomePage = () => (
  <Container size="md">
    <Title order={2} mb="xl">
      New Transaction
    </Title>
    <NewTransactionForm />

    <Title order={2} my="xl">
      Transactions
    </Title>
    <TransactionList />
  </Container>
);

export default HomePage;
