import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const AUTO_DISMISS_MS = 2500;

const MILESTONE_COPY: Record<number, string> = {
  25: "Quarter of the way through your trip!",
  50: "Halfway through your trip!",
  75: "Almost there — final stretch!",
  100: "Last day. Make it count!",
};

export function MilestoneToast({ milestone, onDismiss }: { milestone: number | null; onDismiss: () => void }) {
  useEffect(() => {
    if (milestone === null) return;
    const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [milestone]);

  return (
    <AnimatePresence>
      {milestone !== null && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-x-5 top-4 z-40 flex items-center justify-center gap-2 rounded-pill bg-surface px-4 py-2.5 text-center shadow-soft"
        >
          <span className="text-[13px] font-medium text-ink">🎉 {MILESTONE_COPY[milestone] ?? "Milestone reached!"}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
