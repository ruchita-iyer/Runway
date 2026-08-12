import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppShell } from "../../layout/AppShell";
import { LatitudeDial } from "../../components/dial/LatitudeDial";
import { Button } from "../../components/ui/Button";
import { useTripData } from "../../data/useTripData";
import { budgetFraction, budgetStatus, totalSpent, tripCurrencySymbol } from "../../data/calculations";
import { formatCurrency } from "../../lib/format";

export function HomeTripComplete() {
  const navigate = useNavigate();
  const { activeTrip, acknowledgeTripComplete, startNewTripFlow } = useTripData();

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
      <div className="flex flex-col items-center gap-6 px-6 pt-10">
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="flex h-16 w-16 items-center justify-center"
        >
          <img src="/illustrations/happy.svg" alt="" className="h-full w-full" />
        </motion.div>
        <div className="text-center">
          <p className="text-[13px] text-slate">{activeTrip.name}</p>
          <h1 className="font-display text-[22px] font-bold text-ink">Trip complete</h1>
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

      <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 px-6">
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
    </AppShell>
  );
}
