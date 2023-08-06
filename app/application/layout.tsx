import AppShell from "@/components/AppShell";
import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default withPageAuthRequired(async function MainLayout({
  children,
}: any) {
  return <AppShell>{children}</AppShell>;
});
