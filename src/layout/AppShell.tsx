import type { ReactNode } from "react";
import clsx from "clsx";

export function AppShell({
  children,
  withNav = false,
  className,
}: {
  children: ReactNode;
  withNav?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx("relative h-full w-full overflow-hidden bg-canvas", className)}>
      <div className={clsx("h-full w-full overflow-y-auto", withNav && "pb-[84px]")}>{children}</div>
    </div>
  );
}
