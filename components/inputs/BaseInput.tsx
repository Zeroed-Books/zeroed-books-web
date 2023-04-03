import { HTMLProps, forwardRef } from "react";

export default forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>(
  function BaseInput({ className, ...rest }, ref) {
    return (
      <input
        className={`w-full border border-slate-300 px-2 py-1 focus:ring ${
          className ?? ""
        }`}
        {...rest}
        ref={ref}
      />
    );
  }
);
