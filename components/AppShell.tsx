import Link from "next/link";
import React from "react";
import NavLink from "./NavLink";
import ConditionalLogoutLink from "./ConditionalLogoutLink";

interface Props {
  children: React.ReactNode;
}

export default function AppShell({ children }: Props) {
  return (
    <section className="flex h-screen flex-col md:grid md:grid-cols-app-shell md:grid-rows-app-shell">
      <Link
        className="bg-green-500 px-4 py-2 text-lg font-semibold hover:underline md:text-2xl"
        href="/?noAuthRedirect=true"
      >
        Zeroed Books
      </Link>
      <div className="display:none bg-green-500 md:block" />
      <nav className="flex flex-col bg-gray-100 shadow">
        <ul className="md:flex-grow">
          <li>
            <NavLink exact href="/application">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink href="/application/accounts">Accounts</NavLink>
          </li>
        </ul>
        <ConditionalLogoutLink />
      </nav>
      <section className="flex-grow overflow-auto p-4">{children}</section>
    </section>
  );
}
