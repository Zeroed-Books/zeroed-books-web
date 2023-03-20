import { Autocomplete } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { accountKeys } from "../queries";
import useApiClient from "@/src/api/useApiClient";

interface Props {
  disabled?: boolean;
  label: string;
  onChange: (name: string) => void;
  value: string;
}

const AccountNameInput: React.FC<Props> = ({
  disabled,
  label,
  onChange,
  value,
}) => {
  const [debouncedValue] = useDebouncedValue(value, 200);
  const client = useApiClient();
  const query = useQuery(accountKeys.popularAccounts(debouncedValue), () =>
    client.getPopularAccounts(debouncedValue)
  );

  return (
    <Autocomplete
      data={query.data ?? []}
      disabled={disabled}
      label={label}
      onChange={onChange}
      sx={{ flexGrow: 1 }}
      value={value}
    />
  );
};

export default AccountNameInput;
