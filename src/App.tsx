import React from "react";
import {
  Anchor,
  AppShell,
  Group,
  Header,
  MantineProvider,
  Title,
} from "@mantine/core";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import LoginPage from "./authentication/LoginPage";
import NotFound from "./NotFound";
import RequireAuth from "./authentication/RequireAuth";
import { AuthProvider } from "./authentication/useAuthStatus";
import { QueryClient, QueryClientProvider } from "react-query";
import HomePage from "./HomePage";
import { NotificationsProvider } from "@mantine/notifications";
import TransactionDetailPage from "./ledger/transactions/TransactionDetailPage";

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

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AppLayout />}>
      <Route element={<RequireAuthForTree />}>
        <Route index element={<HomePage />} />
        <Route
          path="transactions/:transactionID"
          element={<TransactionDetailPage />}
        />
      </Route>
      <Route path="login" element={<LoginPage />} />
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
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </NotificationsProvider>
      </MantineProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
