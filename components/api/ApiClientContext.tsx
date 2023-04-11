import ApiClient from "@/src/api/ApiClient";
import { createContext } from "react";

const ApiClientContext = createContext(new ApiClient("/api/proxy"));
export default ApiClientContext;

export const ApiClientConsumer = ApiClientContext.Consumer;
export const ApiClientProvider = ApiClientContext.Provider;
