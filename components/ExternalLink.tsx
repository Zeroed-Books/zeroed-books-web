import { HTMLProps } from "react";

/**
 * A link to a destination outside the application.
 *
 * This is also used for authentication since we need to link to API routes that
 * can redirect, and those do not play nice with Next's `Link` component.
 */
export default function ExternalLink({
  children,
  ...rest
}: HTMLProps<HTMLAnchorElement>) {
  return <a {...rest}>{children}</a>;
}
