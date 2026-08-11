import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatCurrency } from "../../lib/format";

const AUTO_DISMISS_MS = 4200;

export function UndoBar({
  amount,
  categoryName,
  onUndo,
  onDismiss,
}: {
  amount: number | null;
  categoryName: string | null;
  onUndo: () => void;
  onDismiss: () => void;
}) {
  const visible = amount !== null;

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, amount]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: 10, height: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex items-center justify-between rounded-pill border border-hairline bg-surface px-4 py-2.5 shadow-soft"
        >
          <span className="tabular text-[13px] text-slate">
            Logged {formatCurrency(amount ?? 0)} to {categoryName ?? "Other"}
          </span>
          <button onClick={onUndo} className="text-[13px] font-medium text-action-primary">
            Undo
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
