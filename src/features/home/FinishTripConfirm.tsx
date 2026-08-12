import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../../layout/AppShell";
import { Button } from "../../components/ui/Button";
import { Icon, X } from "../../components/ui/IconIndex";
import { SealCheckIllustration } from "../../components/ui/illustrations/SealCheckIllustration";
import { useTripData } from "../../data/useTripData";
import { daysLeft, totalSpent, tripCurrencySymbol } from "../../data/calculations";
import { formatCurrency } from "../../lib/format";

export function FinishTripConfirm() {
  const navigate = useNavigate();
  const { activeTrip, finishTrip } = useTripData();
  if (!activeTrip) return null;

  const symbol = tripCurrencySymbol(activeTrip);
  const spent = totalSpent(activeTrip);
  const left = Math.max(activeTrip.totalBudget - spent, 0);

  return (
    <AppShell>
      <div className="flex items-center justify-between px-5 pt-6">
        <h1 className="font-display text-[20px] font-bold text-ink">Finish trip</h1>
        <button onClick={() => navigate(-1)} className="text-ink">
          <Icon icon={X} size={22} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-6 px-8 pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-action-primary/12 text-action-primary"
        >
          <SealCheckIllustration size={52} delay={0.3} />
        </motion.div>
        <h2 className="font-display text-[22px] font-bold text-ink">Wrap up {activeTrip.name}?</h2>
        <p className="text-[14px] text-slate">You can still log expenses later, but this trip will move to your past trips and its budget won't track.</p>

        <div className="flex w-full gap-3">
          <Stat label="Spent" value={formatCurrency(spent, { symbol })} />
          <Stat label="Left over" value={formatCurrency(left, { symbol })} />
          <Stat label="Days" value={String(daysLeft(activeTrip))} />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 flex flex-col gap-3 px-6">
        <Button
          onClick={() => {
            finishTrip(activeTrip.id);
            navigate("/home", { replace: true });
          }}
        >
          Finish trip
        </Button>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Not yet, keep going
        </Button>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-xl bg-surface px-3 py-3 shadow-soft">
      <p className="text-[11px] font-medium uppercase text-slate">{label}</p>
      <p className="tabular font-display text-[16px] font-semibold text-ink">{value}</p>
    </div>
  );
}
