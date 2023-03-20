import React, { createContext, useContext } from "react";

interface ApiSettingsContextData {
  apiRoot: string;
}

const ApiSettingsContext = createContext<ApiSettingsContextData>({
  apiRoot: "http://localhost:8080",
});

interface ApiSettingsProviderProps {
  apiRoot: string;
  children: React.ReactNode;
}

export const ApiSettingsProvider = ({
  apiRoot,
  children,
}: ApiSettingsProviderProps) => (
  <ApiSettingsContext.Provider value={{ apiRoot }}>
    {children}
  </ApiSettingsContext.Provider>
);

const useApiSettings = () => {
  return useContext(ApiSettingsContext);
};

export default useApiSettings;
