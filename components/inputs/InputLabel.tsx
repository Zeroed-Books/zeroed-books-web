import { HTMLProps } from "react";

export default function InputLabel({
  className,
  ...rest
}: HTMLProps<HTMLLabelElement>) {
  return <label className={`mb-1 block ${className ?? ""}`} {...rest} />;
}
