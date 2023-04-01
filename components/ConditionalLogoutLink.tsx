"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import NavLink from "./NavLink";

export default function ConditionalLogoutLink() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <NavLink external href="/api/auth/logout">
      Log Out
    </NavLink>
  );
}
