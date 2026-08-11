import type { ReactNode } from "react";
import { useViewportFrame } from "../hooks/useViewportFrame";

const FRAME_WIDTH = 390;
const FRAME_HEIGHT = 844;
const STATUS_BAR_HEIGHT = 44;

export function PhoneFrame({ children }: { children: ReactNode }) {
  const isFramed = useViewportFrame();

  if (!isFramed) {
    return (
      <div
        className="relative w-full overflow-hidden bg-canvas text-ink"
        style={{ height: "100dvh", ["--app-height" as string]: "100dvh" }}
      >
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#1a1c22] p-8">
      <div
        className="relative rounded-[44px] bg-black p-[14px] shadow-chassis"
        style={{ width: FRAME_WIDTH + 28, height: FRAME_HEIGHT + 28 }}
      >
        <div
          className="relative overflow-hidden rounded-[32px] bg-canvas text-ink"
          style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
        >
          <div
            className="pointer-events-none absolute left-1/2 top-0 z-50 h-[28px] w-[130px] -translate-x-1/2 rounded-b-2xl bg-black"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 top-0 z-40 flex items-end justify-between px-7 pb-1 text-[13px] font-medium text-ink"
            style={{ height: STATUS_BAR_HEIGHT }}
          >
            <span>9:41</span>
            <span className="tabular">100%</span>
          </div>
          <div
            className="relative overflow-hidden"
            style={{
              position: "absolute" as const,
              top: STATUS_BAR_HEIGHT,
              left: 0,
              right: 0,
              bottom: 0,
              ["--app-height" as string]: `${FRAME_HEIGHT - STATUS_BAR_HEIGHT}px`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
