import Link from "next/link";
import React from "react";

export default function TextLink(props: React.ComponentProps<typeof Link>) {
  const { className, ...rest } = props;

  return <Link className={`text-green-600 underline ${className}`} {...rest} />;
}
