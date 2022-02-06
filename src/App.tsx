import React, { Suspense } from "react";
import {
  Anchor,
  AppShell,
  Center,
  Group,
  Header,
  Loader,
  MantineProvider,
  Title,
} from "@mantine/core";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { NotificationsProvider } from "@mantine/notifications";
import NotFound from "./NotFound";
import RequireAuth from "./authentication/RequireAuth";
import { AuthProvider } from "./authentication/useAuthStatus";

const AppLayout = () => (
  <AppShell
    header={
      <Header
        height={60}
        styles={(theme) => ({
          root: { background: theme.colors[theme.primaryColor][5] },
        })}
      >
        <Group style={{ height: "100%", justifyItems: "center" }}>
          <Anchor component={Link} to="/">
            <Title order={3} ml="lg">
              Zeroed Books
            </Title>
          </Anchor>
        </Group>
      </Header>
    }
  >
    <Outlet />
  </AppShell>
);

const RequireAuthForTree = () => (
  <RequireAuth>
    <Outlet />
  </RequireAuth>
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

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={{ primaryColor: "green" }}>
        <NotificationsProvider>
          <Suspense
            fallback={
              <Center style={{ height: "200px", width: "100%" }}>
                <Loader size="xl" />
              </Center>
            }
          >
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </Suspense>
        </NotificationsProvider>
      </MantineProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
