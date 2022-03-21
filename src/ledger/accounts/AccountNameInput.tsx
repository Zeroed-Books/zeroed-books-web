import { Autocomplete } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import React from "react";
import { useQuery } from "react-query";
import { accountKeys } from "../queries";
import { getPopularAccounts } from "./api";

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
  const query = useQuery(
    accountKeys.popularAccounts(debouncedValue),
    async () => getPopularAccounts(debouncedValue)
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
