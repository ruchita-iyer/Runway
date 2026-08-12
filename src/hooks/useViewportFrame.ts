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

/**
 * Scale factor for the decorative desktop phone chassis so it fills a consistent share of the
 * viewport instead of sitting at a fixed pixel size that looks tiny on a large monitor. Never
 * shrinks below 1 — on a short window the chassis just overflows/scrolls like before.
 */
export function useChassisScale(chassisWidth: number, chassisHeight: number, targetHeightFraction = 0.82): number {
  const compute = () => {
    if (typeof window === "undefined") return 1;
    const byHeight = (window.innerHeight * targetHeightFraction) / chassisHeight;
    const byWidth = (window.innerWidth * 0.9) / chassisWidth;
    return Math.max(1, Math.min(byHeight, byWidth));
  };

  const [scale, setScale] = useState(compute);

  useEffect(() => {
    const onResize = () => setScale(compute());
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chassisWidth, chassisHeight, targetHeightFraction]);

  return scale;
}
