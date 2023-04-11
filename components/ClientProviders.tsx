"use client";

import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiClientProvider } from "./api/ApiClientContext";
import ApiClient from "@/src/api/ApiClient";

const apiClient = new ApiClient("/api/proxy");
const queryClient = new QueryClient();

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MantineProvider
      theme={{ primaryColor: "green" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <ApiClientProvider value={apiClient}>
        <QueryClientProvider client={queryClient}>
          <UserProvider>{children}</UserProvider>
        </QueryClientProvider>
      </ApiClientProvider>
    </MantineProvider>
  );
}
