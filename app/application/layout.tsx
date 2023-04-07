import AppShell from "@/components/AppShell";
import React from "react";
import RequireAuth from "@/src/authentication/RequireAuth";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <RequireAuth>{children}</RequireAuth>
    </AppShell>
  );
}
