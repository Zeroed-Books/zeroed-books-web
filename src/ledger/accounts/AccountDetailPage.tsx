import { Container, SimpleGrid, Title } from "@mantine/core";
import React from "react";
import { useParams } from "react-router-dom";
import TransactionList from "../transactions/TransactionList";
import AccountBalance from "./AccountBalance";

const AccountDetailPage = () => {
  const { accountName } = useParams();

  return (
    <Container size="md">
      <Title mb="xl" order={1}>
        {accountName}
      </Title>
      {accountName && (
        <SimpleGrid
          breakpoints={[
            { minWidth: "sm", cols: 1 },
            { minWidth: "md", cols: 3 },
          ]}
        >
          <AccountBalance account={accountName} />
        </SimpleGrid>
      )}
      <Title mb="lg" order={2}>
        Transactions
      </Title>
      <TransactionList account={accountName} />
    </Container>
  );
};

export default AccountDetailPage;
