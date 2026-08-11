import { useEffect, useState } from "react";

const QUERY = "(min-width: 768px)";

export function useViewportFrame(): boolean {
  const [isFramed, setIsFramed] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(QUERY).matches : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsFramed(e.matches);
    mql.addEventListener("change", onChange);
    setIsFramed(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isFramed;
}
