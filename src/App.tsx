"use client";

import React, { Suspense } from "react";
import { Center, Loader, MantineProvider } from "@mantine/core";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import NotFound from "./NotFound";
import RequireAuth from "./authentication/RequireAuth";
import { AuthProvider } from "./authentication/useAuthStatus";
import CustomAppShell from "./CustomAppShell";
import { ApiSettingsProvider } from "./api/useApiSettings";
import "client-only";

const AppLayout = () => (
  // Add a suspence boundary inside the app shell so that page loads after the
  // first one will keep the app shell and display the spinner in the content
  // section instead of placing a spinner over the entire page.
  <CustomAppShell>
    <Suspense
      fallback={
        <Center style={{ height: "200px", width: "100%" }}>
          <Loader size="xl" />
        </Center>
      }
    >
      <Outlet />
    </Suspense>
  </CustomAppShell>
);

const RequireAuthForTree = () => (
  <RequireAuth>
    <Outlet />
  </RequireAuth>
);

const LazyAccountDetail = React.lazy(
  () => import("./ledger/accounts/AccountDetailPage")
);
const LazyHome = React.lazy(() => import("./HomePage"));
const LazyLogin = React.lazy(() => import("./authentication/LoginPage"));
const LazyPasswordReset = React.lazy(
  () => import("./identities/PasswordResetPage")
);
const LazyPasswordResetRequest = React.lazy(
  () => import("./authentication/PasswordResetRequestPage")
);
const LazyPasswordResetRequestSent = React.lazy(
  () => import("./identities/PasswordResetRequestSentPage")
);
const LazyTransactionDetail = React.lazy(
  () => import("./ledger/transactions/TransactionDetailPage")
);

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AppLayout />}>
      <Route element={<RequireAuthForTree />}>
        <Route index element={<LazyHome />} />
        <Route path="accounts/:accountName" element={<LazyAccountDetail />} />
        <Route
          path="transactions/:transactionID"
          element={<LazyTransactionDetail />}
        />
      </Route>
      <Route path="login" element={<LazyLogin />} />
      <Route path="reset-your-password">
        <Route index element={<LazyPasswordResetRequest />} />
        <Route path="sent" element={<LazyPasswordResetRequestSent />} />
        <Route path=":token" element={<LazyPasswordReset />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

const queryClient = new QueryClient();

interface AppProps {
  apiRoot: string;
}

const App = ({ apiRoot }: AppProps) => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={{ primaryColor: "green" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Notifications />
        <Suspense
          fallback={
            <Center style={{ height: "200px", width: "100%" }}>
              <Loader size="xl" />
            </Center>
          }
        >
          <ApiSettingsProvider apiRoot={apiRoot}>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </ApiSettingsProvider>
        </Suspense>
      </MantineProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
