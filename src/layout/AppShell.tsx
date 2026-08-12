import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";

export function AppShell({
  children,
  withNav = false,
  className,
  style,
}: {
  children: ReactNode;
  withNav?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const swipe = useSwipeNavigation();
  return (
    <div className={clsx("relative h-full w-full overflow-hidden bg-canvas transition-colors duration-500", className)} style={style}>
      <div
        className={clsx("h-full w-full overflow-y-auto", withNav && "pb-[84px]")}
        {...(withNav ? swipe : null)}
      >
        {children}
      </div>
    </div>
  );
}
