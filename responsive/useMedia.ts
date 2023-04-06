import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * A media query and corresponding value.
 */
export interface MediaQuery<T> {
  /**
   * The media query to use.
   */
  query: string;

  /**
   * The value to return if the media query matches.
   */
  matchingValue: T;
}

/**
 * Use media queries to determine a value.
 *
 * @param queries - The media queries to use.
 * @param defaultValue - The value to use if none of the queries match.
 */
export default function useMedia<T>(queries: MediaQuery<T>[], defaultValue: T) {
  const mediaQueries = useMemo(
    () => queries.map((q) => window.matchMedia(q.query)),
    [queries]
  );

  const getFirstMatchingValue = useCallback(() => {
    const matchingIndex = mediaQueries.findIndex((q) => q.matches);

    return matchingIndex === -1
      ? defaultValue
      : queries[matchingIndex].matchingValue;
  }, [defaultValue, mediaQueries, queries]);

  const [value, setValue] = useState(getFirstMatchingValue);

  const handleQueryChange = useCallback(
    () => setValue(getFirstMatchingValue),
    [getFirstMatchingValue, setValue]
  );

  useEffect(() => {
    mediaQueries.forEach((query) =>
      query.addEventListener("change", handleQueryChange)
    );

    return () => {
      mediaQueries.forEach((query) =>
        query.removeEventListener("change", handleQueryChange)
      );
    };
  }, [handleQueryChange, mediaQueries]);

  return value;
}
