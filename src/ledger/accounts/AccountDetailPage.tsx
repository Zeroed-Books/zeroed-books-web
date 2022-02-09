import { Container, Title } from "@mantine/core";
import React from "react";
import { useParams } from "react-router-dom";
import TransactionList from "../transactions/TransactionList";

const AccountDetailPage = () => {
  const { accountName } = useParams();

  return (
    <Container size="md">
      <Title mb="xl" order={1}>
        {accountName}
      </Title>
      <Title mb="lg" order={2}>
        Transactions
      </Title>
      <TransactionList account={accountName} />
    </Container>
  );
};

export default AccountDetailPage;
