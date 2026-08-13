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
 * viewport instead of sitting at a fixed pixel size that looks tiny on a large monitor. Also
 * shrinks below 1 on a short/narrow window (e.g. a browser chrome eating into viewport height on
 * Vercel) so the chassis always fits without the page needing a manual zoom-out.
 */
export function useChassisScale(chassisWidth: number, chassisHeight: number, targetHeightFraction = 0.82): number {
  const compute = () => {
    if (typeof window === "undefined") return 1;
    // Subtract the wrapper's own padding (p-8 = 32px per side) so the scaled chassis can never
    // exceed the actual available space, regardless of the aesthetic target fractions below.
    const availableHeight = window.innerHeight - 64;
    const availableWidth = window.innerWidth - 64;
    const byHeight = (availableHeight * targetHeightFraction) / chassisHeight;
    const byWidth = (availableWidth * 0.9) / chassisWidth;
    return Math.min(byHeight, byWidth);
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
