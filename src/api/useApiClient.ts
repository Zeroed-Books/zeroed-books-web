import { useMemo } from "react";
import ApiClient from "./ApiClient";
import useApiSettings from "./useApiSettings";

const useApiClient = () => {
  const apiSettings = useApiSettings();
  const client = useMemo(
    () => new ApiClient(apiSettings.apiRoot),
    [apiSettings]
  );

  return client;
};

export default useApiClient;
