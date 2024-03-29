"use client";

import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Center, Loader } from "@mantine/core";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
  const { isLoading, user } = useUser();
  const pathname = usePathname();

  if (!user && !isLoading) {
    window.location.replace(`/api/auth/login?returnTo=${pathname}`);

    return null;
  }

  if (isLoading) {
    <Center style={{ height: "200px", width: "100%" }}>
      <Loader size="xl" />
    </Center>;
  }

  return <>{children}</>;
}
