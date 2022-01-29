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
import TransactionListPage from "./ledger/transactions/TransactionListPage";

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

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AppLayout />}>
      <Route
        index
        element={
          <RequireAuth>
            <TransactionListPage />
          </RequireAuth>
        }
      />
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
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
