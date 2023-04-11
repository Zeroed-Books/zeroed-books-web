import { useContext } from "react";
import ApiClientContext from "./ApiClientContext";

export default function useApiClient() {
  return useContext(ApiClientContext);
}
