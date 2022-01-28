import React from "react";
import { AppShell, MantineProvider, Title } from "@mantine/core";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import LoginPage from "./authentication/LoginPage";
import NotFound from "./NotFound";
import RequireAuth from "./authentication/RequireAuth";
import { AuthProvider } from "./authentication/useAuthStatus";
import { QueryClient, QueryClientProvider } from "react-query";

const Protected = () => <Title order={1}>Protected</Title>;

const AppLayout = () => (
  <AppShell header={<Title order={3}>Zeroed Books</Title>}>
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
            <Protected />
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
