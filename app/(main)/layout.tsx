import AppShell from "@/components/AppShell";
import React from "react";

import "./global.css";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
