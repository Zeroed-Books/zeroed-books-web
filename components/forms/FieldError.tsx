import { FieldError as FieldErrorType } from "react-hook-form";

interface Props {
  /**
   * The field error to display.
   */
  error?: FieldErrorType;
}

/**
 * Get a human-readable error message from a field error.
 *
 * In order of priority, the message will be:
 * 1. The message specified by the error.
 * 2. A message based on the error's `type`.
 * 3. A generic error message.
 *
 * @param error - The error to get a message for.
 *
 * @returns A human-readable error emssage.
 */
const getErrorMessage = (error: FieldErrorType): string => {
  if (error.message) {
    return error.message;
  }

  if (error.type === "required") {
    return "This field is required.";
  }

  return "Unknown error.";
};

/**
 * An error associated with a specific form input.
 *
 * If there is no error, the component does not render.
 */
export default function FieldError({ error }: Props) {
  if (!error) {
    return null;
  }

  return (
    <p className="mb-1 italic text-red-500" role="alert">
      {getErrorMessage(error)}
    </p>
  );
}
