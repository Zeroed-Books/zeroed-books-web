"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ExternalLink from "./ExternalLink";

interface Props {
  children: React.ReactNode;
  exact?: boolean;
  external?: boolean;
  href: string;
}

export default function NavLink({
  children,
  exact = false,
  external = false,
  href,
}: Props) {
  const pathname = usePathname();

  const active = exact ? pathname === href : pathname?.startsWith(href);

  let Component;
  if (external) {
    Component = ExternalLink;
  } else {
    Component = Link;
  }

  return (
    <Component
      className={`block px-4 py-2 hover:bg-gray-300 ${
        active ? "bg-gray-200" : ""
      }`}
      href={href}
    >
      {children}
    </Component>
  );
}
