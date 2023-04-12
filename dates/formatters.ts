export function asISODate(instant: Date): string {
  return [
    instant.getUTCFullYear(),
    (instant.getUTCMonth() + 1).toString().padStart(2, "0"),
    instant.getUTCDate().toString().padStart(2, "0"),
  ].join("-");
}

export function asISOMonth(instant: Date): string {
  return [
    instant.getUTCFullYear(),
    (instant.getUTCMonth() + 1).toString().padStart(2, "0"),
  ].join("-");
}
