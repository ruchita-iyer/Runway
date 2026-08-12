import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppShell } from "../../layout/AppShell";
import { Celebration, CELEBRATION_DURATION_MS } from "./Celebration";
import { SealCheckIllustration } from "../../components/ui/illustrations/SealCheckIllustration";
import { useTripData } from "../../data/useTripData";
import { shouldPromptOvershoot } from "../../data/calculations";
import { formatCurrency } from "../../lib/format";

/** Close right after the confetti finishes — a small buffer so the last spark doesn't get cut off mid-fade. */
const AUTO_ADVANCE_MS = CELEBRATION_DURATION_MS + 150;

interface ExpenseSuccessState {
  amount?: number;
  categoryName?: string;
  justLoggedId?: string;
  symbol?: string;
}

export function ExpenseSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeTrip } = useTripData();
  const state = (location.state as ExpenseSuccessState | null) ?? null;
  const wentHome = useRef(false);

  const goHome = useCallback(() => {
    if (wentHome.current) return;
    wentHome.current = true;
    if (activeTrip && shouldPromptOvershoot(activeTrip)) {
      navigate("/overshoot", { replace: true });
      return;
    }
    navigate("/home", { replace: true, state: { justLoggedId: state?.justLoggedId } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrip]);

  useEffect(() => {
    const timeout = setTimeout(goHome, AUTO_ADVANCE_MS);
    return () => clearTimeout(timeout);
  }, [goHome]);

  return (
    <AppShell className="overflow-hidden">
      <div className="relative flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
        <Celebration show />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
          className="relative flex h-40 w-40 items-center justify-center rounded-full bg-pace-teal text-white shadow-soft"
        >
          <SealCheckIllustration size={88} delay={0.1} filled={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="space-y-1.5"
        >
          <h1 className="font-display text-[24px] font-bold text-ink">Expense logged!</h1>
          {state?.amount !== undefined && (
            <p className="text-[15px] text-slate">
              {formatCurrency(state.amount, { symbol: state.symbol })} to {state.categoryName ?? "Other"}
            </p>
          )}
        </motion.div>
      </div>
    </AppShell>
  );
}
