import type { ReactNode } from "react";
import { useChassisScale, useViewportFrame } from "../hooks/useViewportFrame";

const FRAME_WIDTH = 390;
const FRAME_HEIGHT = 844;
const STATUS_BAR_HEIGHT = 44;
const CHASSIS_WIDTH = FRAME_WIDTH + 28;
const CHASSIS_HEIGHT = FRAME_HEIGHT + 28;

export function PhoneFrame({ children }: { children: ReactNode }) {
  const isFramed = useViewportFrame();
  const scale = useChassisScale(CHASSIS_WIDTH, CHASSIS_HEIGHT);

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
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-[#1a1c22] p-8">
      {/* Sized to the chassis's real post-scale footprint so it lays out (and centers/clips)
          correctly — transform alone doesn't change the box's contribution to layout, which is
          what let the unscaled chassis overflow the viewport and force a manual browser zoom. */}
      <div style={{ width: CHASSIS_WIDTH * scale, height: CHASSIS_HEIGHT * scale }}>
        <div
          className="relative rounded-[44px] bg-black p-[14px] shadow-chassis"
          style={{
            width: CHASSIS_WIDTH,
            height: CHASSIS_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
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
    </div>
  );
}
