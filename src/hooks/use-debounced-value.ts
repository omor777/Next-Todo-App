"use client";

import { useEffect, useState } from "react";

export function useDebouncedValue<T>(
  inputValue: T,
  delayMilliseconds = 300,
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(inputValue);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delayMilliseconds);

    return () => clearTimeout(timeoutId);
  }, [inputValue, delayMilliseconds]);

  return debouncedValue;
}
