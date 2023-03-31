import { useMemo } from "react";
import ApiClient from "./ApiClient";

const useApiClient = () => {
  const client = useMemo(() => new ApiClient("/api/proxy"), []);

  return client;
};

export default useApiClient;
