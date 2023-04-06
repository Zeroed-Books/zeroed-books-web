import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Breadcrumbs({ children }: Props) {
  return (
    <div className="mb-4 flex flex-wrap space-x-2 md:text-lg">{children}</div>
  );
}

interface ChildProps {
  children: React.ReactNode;
}

Breadcrumbs.Child = function Child({ children }: ChildProps) {
  return (
    <span className="after:ml-2 after:text-gray-500 after:content-['/'] last:after:content-[]">
      {children}
    </span>
  );
};
