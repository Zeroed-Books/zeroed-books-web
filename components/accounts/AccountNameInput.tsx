"use client";

import { Combobox } from "@headlessui/react";
import { useDebouncedValue } from "@mantine/hooks";
import React, { useId } from "react";
import { useQuery } from "@tanstack/react-query";
import useApiClient from "@/components/api/useApiClient";
import { accountKeys } from "@/src/ledger/queries";
import BaseInput from "../inputs/BaseInput";
import InputLabel from "../inputs/InputLabel";

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
  const inputId = useId();

  const [debouncedValue] = useDebouncedValue(value, 200);
  const client = useApiClient();
  const query = useQuery(accountKeys.popularAccounts(debouncedValue), () =>
    client.getPopularAccounts(debouncedValue)
  );

  return (
    <div className="mb-2">
      <InputLabel htmlFor={inputId}>{label}</InputLabel>
      <Combobox disabled={disabled} value={value} onChange={onChange}>
        <Combobox.Input
          as={BaseInput}
          id={inputId}
          onChange={(e) => onChange(e.currentTarget.value)}
          value={value}
        />
        <Combobox.Options className="absolute max-h-40 overflow-y-auto bg-slate-100 p-1 shadow-lg">
          {query.data?.map((account) => (
            <Combobox.Option
              className="cursor-pointer px-2 py-1 ui-active:bg-slate-200 ui-active:ring"
              key={account}
              value={account}
            >
              {account}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    </div>
  );
};

export default AccountNameInput;
