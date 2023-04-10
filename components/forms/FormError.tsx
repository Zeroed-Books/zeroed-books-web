interface Props {
  message?: string;
}

export default function FormError({ message }: Props) {
  if (!message) {
    return null;
  }

  return (
    <p
      className="mb-4 border border-red-500 bg-red-100 px-4 py-2 italic text-red-500"
      role="alert"
    >
      {message}
    </p>
  );
}
