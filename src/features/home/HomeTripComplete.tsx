import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppShell } from "../../layout/AppShell";
import { LatitudeDial } from "../../components/dial/LatitudeDial";
import { Button } from "../../components/ui/Button";
import { Celebration } from "../expense/Celebration";
import { useTripData } from "../../data/useTripData";
import { budgetFraction, budgetStatus, isOvershoot, totalSpent, tripCurrencySymbol } from "../../data/calculations";
import { formatCurrency } from "../../lib/format";

export function HomeTripComplete() {
  const navigate = useNavigate();
  const { activeTrip, acknowledgeTripComplete, startNewTripFlow } = useTripData();
  const [celebrate, setCelebrate] = useState(false);

  const overBudget = activeTrip ? isOvershoot(activeTrip) : false;

  useEffect(() => {
    if (!activeTrip || overBudget) return;
    const t = setTimeout(() => setCelebrate(true), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrip?.id]);

  if (!activeTrip) return null;

  // Mark this trip's completion as seen whenever the user leaves via one of the actions below,
  // so a later visit to Home shows the returning-user homepage instead of re-showing this
  // celebration forever.
  const leave = (to: () => void) => {
    acknowledgeTripComplete(activeTrip.id);
    to();
  };

  const symbol = tripCurrencySymbol(activeTrip);
  const status = budgetStatus(activeTrip);
  const fraction = 1 - budgetFraction(activeTrip);

  return (
    <AppShell>
      <div className="flex min-h-full flex-col items-center px-6 pt-10 pb-8">
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <Celebration show={celebrate} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className="flex h-16 w-16 items-center justify-center"
            >
              <img src="/illustrations/happy.svg" alt="" className="h-full w-full" />
            </motion.div>
          </div>
          <div className="text-center">
            <p className="text-[13px] text-slate">{activeTrip.name}</p>
            <h1 className="font-display text-[22px] font-bold text-ink">Trip complete</h1>
            <p className="mt-1 max-w-[260px] text-[13px] leading-relaxed text-slate">
              {overBudget
                ? "You went over budget this time — that happens on real trips. There's always the next one to land it under budget."
                : "You wrapped up under budget. Nice work pacing it out."}
            </p>
          </div>

          <LatitudeDial
            fraction={fraction}
            status={status}
            mode="complete"
            centerLabel={<span className="tabular font-display text-[24px] font-semibold text-ink" />}
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="tabular text-center text-[15px] text-slate"
          >
            Spent {formatCurrency(totalSpent(activeTrip), { symbol })} over {activeTrip.durationDays}{" "}
            {activeTrip.durationDays === 1 ? "day" : "days"}
          </motion.div>

          <div className="flex w-full flex-col gap-3 pt-4">
            <Button variant="secondary" onClick={() => leave(() => navigate("/summary"))}>
              View summary
            </Button>
            <Button variant="ghost" onClick={() => leave(() => navigate("/home"))}>
              Go home
            </Button>
          </div>
        </div>

        <div className="mt-auto flex w-full flex-col items-center gap-3 pt-8">
          <Button
            onClick={() =>
              leave(() => {
                startNewTripFlow();
                navigate("/new-trip");
              })
            }
          >
            Start a new trip
          </Button>
          <button
            onClick={() => leave(() => navigate("/account"))}
            className="text-[13px] font-medium text-slate underline"
          >
            View past trips
          </button>
        </div>
      </div>
    </AppShell>
  );
}
