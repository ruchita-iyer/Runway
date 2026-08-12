import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { DotLottie } from "@lottiefiles/dotlottie-web";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AppShell } from "../../layout/AppShell";
import { formatCurrency } from "../../lib/format";

const SUCCESS_LOTTIE_SRC = "https://lottie.host/ded62c94-796c-45aa-80c2-747422d7cdf8/hNMsQU4e35.lottie";
/** Fallback in case the lottie's `complete` event never fires (e.g. load failure). */
const FALLBACK_ADVANCE_MS = 10000;

interface ExpenseSuccessState {
  amount?: number;
  categoryName?: string;
  justLoggedId?: string;
}

export function ExpenseSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as ExpenseSuccessState | null) ?? null;
  const wentHome = useRef(false);

  const goHome = useCallback(() => {
    if (wentHome.current) return;
    wentHome.current = true;
    navigate("/home", { replace: true, state: { justLoggedId: state?.justLoggedId } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(goHome, FALLBACK_ADVANCE_MS);
    return () => clearTimeout(timeout);
  }, [goHome]);

  const handleDotLottieRef = useCallback(
    (dotLottie: DotLottie | null) => {
      if (!dotLottie) return;
      dotLottie.addEventListener("complete", goHome);
    },
    [goHome],
  );

  return (
    <AppShell className="overflow-hidden">
      <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
          className="flex h-56 w-56 items-center justify-center"
        >
          <DotLottieReact
            src={SUCCESS_LOTTIE_SRC}
            autoplay
            loop={false}
            dotLottieRefCallback={handleDotLottieRef}
            className="h-full w-full"
          />
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
              {formatCurrency(state.amount)} to {state.categoryName ?? "Other"}
            </p>
          )}
        </motion.div>
      </div>
    </AppShell>
  );
}
