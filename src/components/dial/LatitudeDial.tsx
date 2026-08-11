import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DIAL_ARC_SPAN_DEG, DIAL_ROTATION_DEG, SPAN_FRACTION, pointAtFraction } from "./dialMath";
import { paceColorVar } from "../../theme/tokens";
import type { PaceStatus } from "../../theme/tokens";
import { SealCheckIllustration } from "../ui/illustrations/SealCheckIllustration";

export type DialMode = "idle" | "sunrise" | "dropping" | "complete";

interface LatitudeDialProps {
  fraction: number;
  status: PaceStatus;
  mode: DialMode;
  dropDirection?: "in" | "out";
  dropTargetFraction?: number;
  showOvershootRing?: boolean;
  centerLabel: ReactNode;
  size?: number;
  onDropComplete?: () => void;
  onSunriseComplete?: () => void;
  onArcSettled?: () => void;
}

const SIZE_DEFAULT = 232;
const STROKE = 14;

export function LatitudeDial({
  fraction,
  status,
  mode,
  dropDirection = "in",
  dropTargetFraction,
  showOvershootRing,
  centerLabel,
  size = SIZE_DEFAULT,
  onDropComplete,
  onSunriseComplete,
  onArcSettled,
}: LatitudeDialProps) {
  const [badgeRevealed, setBadgeRevealed] = useState(false);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - STROKE * 1.6;
  const color = paceColorVar(status);
  const trackTransform = `rotate(${DIAL_ROTATION_DEG} ${cx} ${cy})`;

  useEffect(() => {
    if (mode !== "complete") {
      setBadgeRevealed(false);
      return;
    }
    const t = setTimeout(() => setBadgeRevealed(true), 950);
    return () => clearTimeout(t);
  }, [mode]);

  const beadTarget = pointAtFraction(cx, cy, r, dropTargetFraction ?? fraction);
  const beadOrigin = { x: cx, y: size + 26 };
  const beadFrom = dropDirection === "in" ? beadOrigin : beadTarget;
  const beadTo = dropDirection === "in" ? beadTarget : beadOrigin;

  const progressPathLength =
    mode === "complete"
      ? [fraction * SPAN_FRACTION, SPAN_FRACTION, SPAN_FRACTION]
      : Math.min(Math.max(fraction, 0), 1) * SPAN_FRACTION;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {/* background track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--hairline)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={`${SPAN_FRACTION} ${1 - SPAN_FRACTION}`}
          transform={trackTransform}
        />

        {/* sunrise overlay: brightens bottom-up once on day rollover */}
        <AnimatePresence>
          {mode === "sunrise" && (
            <motion.circle
              key="sunrise"
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="var(--pace-teal)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={`${SPAN_FRACTION} ${1 - SPAN_FRACTION}`}
              transform={trackTransform}
              initial={{ opacity: 0, pathOffset: SPAN_FRACTION }}
              animate={{ opacity: [0, 0.9, 0], pathOffset: [SPAN_FRACTION, 0, 0] }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              onAnimationComplete={() => onSunriseComplete?.()}
            />
          )}
        </AnimatePresence>

        {/* main progress arc */}
        {!badgeRevealed && (
          <motion.circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            transform={trackTransform}
            initial={false}
            animate={{ pathLength: progressPathLength, stroke: color }}
            transition={
              mode === "complete"
                ? { duration: 1.1, times: [0, 0.7, 1], ease: "easeInOut" }
                : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
            }
            onAnimationComplete={() => onArcSettled?.()}
          />
        )}

        {/* overshoot outer ring */}
        <AnimatePresence>
          {showOvershootRing && (
            <motion.circle
              key="overshoot-ring"
              cx={cx}
              cy={cy}
              r={r + STROKE * 1.5}
              fill="none"
              stroke="var(--pace-berry)"
              strokeWidth={2}
              strokeDasharray="6 7"
              strokeLinecap="round"
              pathLength={1}
              transform={`rotate(${DIAL_ROTATION_DEG} ${cx} ${cy})`}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: SPAN_FRACTION }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* liquid drop bead */}
        <AnimatePresence>
          {mode === "dropping" && (
            <motion.circle
              key="bead"
              r={7}
              fill={color}
              initial={{ cx: beadFrom.x, cy: beadFrom.y, opacity: 1, scale: 0.6 }}
              animate={{ cx: beadTo.x, cy: beadTo.y, scale: [0.6, 1.15, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0.35, 1] }}
              onAnimationComplete={() => onDropComplete?.()}
            />
          )}
        </AnimatePresence>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {badgeRevealed ? (
            <motion.div
              key="badge"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex h-[150px] w-[150px] flex-col items-center justify-center gap-2 rounded-full bg-action-primary text-white shadow-soft"
            >
              <SealCheckIllustration size={56} delay={0.15} filled={false} />
              <span className="font-display text-[13px] font-semibold">Trip complete</span>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              {centerLabel}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export { DIAL_ARC_SPAN_DEG };
