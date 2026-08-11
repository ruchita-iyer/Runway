import { motion } from "framer-motion";

const TICK_COUNT = 16;
const TICKS = Array.from({ length: TICK_COUNT }, (_, i) => (i / TICK_COUNT) * Math.PI * 2);

export function SealCheckIllustration({
  size = 96,
  className,
  animate = true,
  delay = 0,
  filled = true,
}: {
  size?: number;
  className?: string;
  animate?: boolean;
  delay?: number;
  /** When false, skips the inner filled disc — use on an already-colored badge background. */
  filled?: boolean;
}) {
  const cx = 48;
  const cy = 48;
  const rOuter = 40;
  const rTickIn = 34;
  const rTickOut = 40;

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" className={className}>
      {TICKS.map((a, i) => (
        <line
          key={i}
          x1={cx + Math.cos(a) * rTickIn}
          y1={cy + Math.sin(a) * rTickIn}
          x2={cx + Math.cos(a) * rTickOut}
          y2={cy + Math.sin(a) * rTickOut}
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.55}
        />
      ))}
      {filled && (
        <motion.circle
          cx={cx}
          cy={cy}
          r={rOuter - 8}
          fill="currentColor"
          initial={animate ? { scale: 0.6, opacity: 0 } : undefined}
          animate={animate ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.45, ease: "easeOut", delay }}
          style={{ transformOrigin: "48px 48px" }}
        />
      )}
      <motion.path
        d="M34 49.5 44 59 63 37"
        stroke={filled ? "white" : "currentColor"}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
        animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: delay + 0.35 }}
      />
    </svg>
  );
}
