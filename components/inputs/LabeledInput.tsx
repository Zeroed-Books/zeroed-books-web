import React, { HTMLProps, forwardRef, useId } from "react";
import InputLabel from "./InputLabel";
import BaseInput from "./BaseInput";

interface Props extends Omit<HTMLProps<HTMLInputElement>, "label"> {
  label: React.ReactNode;
}

export default forwardRef<HTMLInputElement, Props>(function LabeledInput(
  { label, ...rest },
  ref
) {
  const id = useId();

  return (
    <div className="mb-1">
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <BaseInput id={id} {...rest} ref={ref} />
    </div>
  );
});
