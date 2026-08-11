import { motion } from "framer-motion";
import { paceColorVar } from "../../theme/tokens";
import type { PaceStatus } from "../../theme/tokens";

const PULSE_DURATION: Record<PaceStatus, number> = {
  onPace: 2.4,
  tight: 1.3,
  over: 0.8,
};

export function PacePulseDot({ status }: { status: PaceStatus }) {
  const color = paceColorVar(status);
  return (
    <span className="relative flex h-2.5 w-2.5">
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: PULSE_DURATION[status], repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
    </span>
  );
}
