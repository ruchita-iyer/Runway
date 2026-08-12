import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, Flame } from "./IconIndex";

/**
 * Always renders (even at 0) so the streak indicator stays in a consistent spot across
 * screens instead of popping in/out of the layout — it just dims to a neutral/slate tone
 * when there's no active streak.
 */
export function StreakChip({ streak }: { streak: number }) {
  const active = streak > 0;
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={streak}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className={clsx(
          "flex items-center gap-1 rounded-pill px-2.5 py-1",
          active ? "bg-pace-teal/12 text-pace-teal" : "bg-hairline/40 text-slate",
        )}
      >
        <Icon icon={Flame} size={13} />
        <span className="tabular text-[12px] font-semibold">{streak}</span>
      </motion.span>
    </AnimatePresence>
  );
}
