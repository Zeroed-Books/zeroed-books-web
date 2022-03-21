import { Loader, Paper, Text, Title } from "@mantine/core";
import React from "react";
import { useQuery } from "react-query";
import { accountKeys } from "../queries";
import { getAccountBalance } from "./api";

interface Props {
  account: string;
}

const AccountBalance: React.FC<Props> = ({ account }) => {
  const query = useQuery(accountKeys.balance(account), async () =>
    getAccountBalance(account)
  );

  if (query.data && query.data.length > 0) {
    return (
      <Paper mb="lg" padding="md" shadow="md">
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
      <Paper padding="md" shadow="md">
        <Loader size="lg" />
      </Paper>
    );
  }

  return null;
};

export default AccountBalance;
