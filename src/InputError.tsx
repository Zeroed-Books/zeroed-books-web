import { List, Text } from "@mantine/core";
import React from "react";

interface Props {
  error?: string[];
}

const InputError: React.FC<Props> = ({ error }) => {
  if (error === undefined || error.length === 0) {
    return null;
  }

  if (error.length === 1) {
    return <Text inherit>{error[0]}</Text>;
  }

  return (
    <List>
      {error.map((e) => (
        <List.Item key={e}>{e}</List.Item>
      ))}
    </List>
  );
};

export default InputError;
