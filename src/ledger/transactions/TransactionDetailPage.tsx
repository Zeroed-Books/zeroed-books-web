import {
  Alert,
  Anchor,
  Breadcrumbs,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { getTransaction, Transaction } from "./api";
import DeleteTransactionButton from "./DeleteTransactionButton";
import { transactionKeys } from "../queries";

interface TransactionDetailDisplayProps {
  transaction: Transaction;
}

const TransactionDetailDisplay: React.FC<TransactionDetailDisplayProps> = ({
  transaction,
}) => {
  const parsedDate = dayjs(transaction.date);

  return (
    <>
      <Title order={1} mb="xs">
        {transaction.payee}
      </Title>
      <Title order={2} mb="xl">
        <Text color="dimmed" inherit>
          {parsedDate.format("MMMM D, YYYY")}
        </Text>
      </Title>

      <Paper mb="xl" p="md" shadow="xs">
        <DeleteTransactionButton transaction={transaction} />
      </Paper>

      {transaction.entries.map((entry) => (
        <Group
          key={`${entry.account}-${entry.amount.currency}-${entry.amount.value}`}
        >
          <Anchor
            component={Link}
            sx={{ flexGrow: 1 }}
            to={`/accounts/${entry.account}`}
          >
            {entry.account}
          </Anchor>
          <Text>
            {entry.amount.currency} {entry.amount.value}
          </Text>
        </Group>
      ))}
    </>
  );
};

const TransactionDetailPage = () => {
  const { transactionID } = useParams();
  const query = useQuery(transactionKeys.detail(transactionID), async () => {
    if (transactionID) {
      return getTransaction(transactionID);
    }

    throw new Error("No transaction ID provided.");
  });

  return (
    <Container>
      <Breadcrumbs mb="xl">
        <Anchor component={Link} to="/">
          Home
        </Anchor>
        <Text>Transactions</Text>
        {query.data?.payee ? (
          <Text>{query.data?.payee}</Text>
        ) : (
          <Skeleton height="1em" width={250} />
        )}
      </Breadcrumbs>

      {/* eslint-disable-next-line no-nested-ternary */}
      {query.isError ? (
        <Alert color="red" title="Error">
          Something went wrong loading the transaction.
        </Alert>
      ) : // eslint-disable-next-line no-nested-ternary
      query.isLoading ? (
        <Center>
          <Loader size="xl" />
        </Center>
      ) : query.data ? (
        <TransactionDetailDisplay transaction={query.data} />
      ) : null}
    </Container>
  );
};

export default TransactionDetailPage;
