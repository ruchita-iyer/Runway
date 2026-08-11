import { motion } from "framer-motion";

export function NestedRingEcho({
  fraction,
  over,
  size = 190,
}: {
  /** spent / budget, can exceed 1 */
  fraction: number;
  over: boolean;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 15;
  const color = over ? "var(--pace-berry)" : "var(--pace-teal)";

  return (
    <svg width={size} height={size} className="overflow-visible -rotate-90">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--hairline)" strokeWidth={14} />
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={14}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: Math.min(fraction, 1) }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      {over && (
        <motion.circle
          cx={cx}
          cy={cy}
          r={r + 11}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeDasharray="5 6"
          strokeLinecap="round"
          pathLength={1}
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 0.7, pathLength: Math.min(fraction - 1, 1) }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        />
      )}
    </svg>
  );
}
