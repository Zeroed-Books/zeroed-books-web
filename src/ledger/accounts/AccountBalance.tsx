"use client";

import { Loader, Paper, Text, Title } from "@mantine/core";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { accountKeys } from "../queries";
import useApiClient from "@/src/api/useApiClient";

interface Props {
  account: string;
}

const AccountBalance: React.FC<Props> = ({ account }) => {
  const client = useApiClient();
  const query = useQuery(accountKeys.balance(account), async () =>
    client.getAccountBalance(account)
  );

  if (query.data && query.data.length > 0) {
    return (
      <Paper mb="lg" p="md" shadow="md">
        <Title mb="md" order={3}>
          Balance
        </Title>

        {query.data.map((amount) => (
          <Text key={amount.currency}>
            {amount.currency}&nbsp;{amount.value}
          </Text>
        ))}
      </Paper>
    );
  }

  if (query.isLoading) {
    return (
      <Paper p="md" shadow="md">
        <Loader size="lg" />
      </Paper>
    );
  }

  return null;
};

export default AccountBalance;
