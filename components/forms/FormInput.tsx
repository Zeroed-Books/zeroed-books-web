import { ComponentProps, forwardRef } from "react";
import LabeledInput from "../inputs/LabeledInput";
import { FieldError as FieldErrorType } from "react-hook-form";
import FieldError from "./FieldError";

interface Props extends ComponentProps<typeof LabeledInput> {
  error?: Pick<FieldErrorType, "type" | "message">;
}

export default forwardRef<HTMLInputElement, Props>(function FormInput(
  { error, ...rest },
  ref
) {
  const classNames = [];
  if (error) {
    classNames.push("focus:ring-red-500");
  }

  return (
    <>
      <LabeledInput
        aria-invalid={Boolean(error)}
        className={`${error ? "ring ring-red-500" : ""}`}
        {...rest}
        ref={ref}
      />
      <FieldError error={error} />
    </>
  );
});
