import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Breadcrumbs({ children }: Props) {
  return <div className="mb-4 flex space-x-2 md:text-lg">{children}</div>;
}

interface ChildProps {
  children: React.ReactNode;
}

Breadcrumbs.Child = function Child({ children }: ChildProps) {
  return (
    <span className="before:mr-2 before:text-gray-500 before:content-['/'] first:before:content-[]">
      {children}
    </span>
  );
};
