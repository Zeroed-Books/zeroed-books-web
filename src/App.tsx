import React from 'react';
import { MantineProvider, Title } from "@mantine/core";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './authentication/LoginPage';
import NotFound from './NotFound';
import RequireAuth from './authentication/RequireAuth';

const Protected = () => <Title order={1}>Protected</Title>;

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<RequireAuth><Protected /></RequireAuth>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

const App = () => (
    <BrowserRouter>
        <MantineProvider>
            <AppRoutes />
        </MantineProvider>
    </BrowserRouter>
);

export default App;
