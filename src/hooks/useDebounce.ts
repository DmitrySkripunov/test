import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value]);

  return debounced;
}
