import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, X } from "../../components/ui/IconIndex";
import { Button } from "../../components/ui/Button";
import { useTripData } from "../../data/useTripData";
import { effectiveBudget, tripCurrencySymbol } from "../../data/calculations";
import type { Trip } from "../../data/types";

export function EditBudgetSheet({ trip, open, onClose }: { trip: Trip; open: boolean; onClose: () => void }) {
  const { updateBudget } = useTripData();
  const symbol = tripCurrencySymbol(trip);
  const [amount, setAmount] = useState(() => String(effectiveBudget(trip)));

  useEffect(() => {
    if (open) setAmount(String(effectiveBudget(trip)));
  }, [open, trip]);

  const parsed = Number(amount);
  const valid = amount.trim() !== "" && !Number.isNaN(parsed) && parsed > 0;

  const handleSave = () => {
    if (!valid) return;
    updateBudget(trip.id, parsed);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 bottom-0 z-50 rounded-t-3xl bg-canvas px-5 pb-8 pt-4 shadow-soft"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-hairline" />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-[17px] font-bold text-ink">Edit budget</h2>
              <button onClick={onClose} className="text-slate">
                <Icon icon={X} size={20} />
              </button>
            </div>

            <div className="mb-5 flex items-center gap-2 rounded-2xl bg-surface px-4 py-4 shadow-soft">
              <span className="tabular font-display text-[24px] font-semibold text-slate">{symbol}</span>
              <input
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="0.00"
                className="tabular w-full bg-transparent font-display text-[24px] font-semibold text-ink placeholder:text-slate/40 focus:outline-none"
              />
            </div>

            <Button onClick={handleSave} disabled={!valid}>
              Save budget
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
